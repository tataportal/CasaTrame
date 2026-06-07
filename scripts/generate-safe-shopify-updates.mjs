import fs from 'node:fs';
import path from 'node:path';

const currentPath = '/tmp/casa-trame-products-current.json';
const productSetDir = '/tmp/casa-trame-product-sync';
const outputDir = '/tmp/casa-trame-safe-sync';
const skipHandles = new Set(['camisa-basica-malabia', 'camisa-denim-soho']);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function selectedOptionKey(variant) {
  return (variant.selectedOptions || [])
    .map((option) => `${option.name}:${option.value}`)
    .sort()
    .join('|');
}

function main() {
  const current = readJson(currentPath);
  const currentByHandle = new Map(current.products.nodes.map((product) => [product.handle, product]));
  fs.mkdirSync(outputDir, { recursive: true });

  const mutationPath = path.join(outputDir, 'safe-sync.graphql');
  fs.writeFileSync(mutationPath, `mutation SafeSync($product: ProductUpdateInput!, $productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productUpdate(product: $product) {
    product { id handle title productType tags descriptionHtml }
    userErrors { field message }
  }
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    product { id handle title }
    productVariants { id price }
    userErrors { field message }
  }
}
`);

  const rows = [];
  const files = fs.readdirSync(productSetDir).filter((file) => file.endsWith('.json')).sort();
  for (const file of files) {
    const source = readJson(path.join(productSetDir, file));
    const handle = source.input.handle;
    if (skipHandles.has(handle)) continue;

    const existing = currentByHandle.get(handle);
    if (!existing) throw new Error(`Missing current product for ${handle}`);

    const variants = existing.variants.nodes.map((variant) => ({
      id: variant.id,
      price: source.input.variants[0].price,
      inventoryPolicy: 'DENY',
      taxable: true,
      inventoryItem: { tracked: false }
    }));

    const variableFile = path.join(outputDir, `${handle}.json`);
    fs.writeFileSync(variableFile, JSON.stringify({
      product: {
        id: existing.id,
        title: source.input.title,
        handle: source.input.handle,
        vendor: source.input.vendor,
        status: source.input.status,
        productType: source.input.productType,
        tags: source.input.tags,
        collectionsToJoin: source.input.collections,
        descriptionHtml: source.input.descriptionHtml
      },
      productId: existing.id,
      variants
    }, null, 2));

    rows.push({
      handle,
      currentVariants: existing.variants.nodes.length,
      updateVariants: variants.length,
      optionShape: existing.options.map((option) => `${option.name}:${option.values.join('/')}`).join(' | '),
      sampleVariant: selectedOptionKey(existing.variants.nodes[0]),
      variableFile
    });
  }

  console.log(JSON.stringify({ mutationPath, count: rows.length, rows }, null, 2));
}

main();
