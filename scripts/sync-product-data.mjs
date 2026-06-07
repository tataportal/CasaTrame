import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const currentPath = '/tmp/casa-trame-products-current.json';
const outputDir = '/tmp/casa-trame-product-sync';
const themePagePath = path.join(root, 'shopify-theme/sections/casa-trame-page.liquid');
const productAssetsDir = '/Users/tata/Desktop/Casa Trame/Casa Trame - Productos/_Productos 1200x1500';
const vestidorAssetsDir = '/Users/tata/Desktop/Casa Trame/Casa Trame - Productos/_Productos 1200x1500_Vestidor';

const exchangePolicyHtml = '<p>Consulta nuestra política de cambios y devoluciones en <a href="/policies/refund-policy">este enlace</a>.</p>';

const products = [
  {
    title: 'Abrigo Suede Pampa',
    category: 'Abrigos',
    colors: ['Verde Pacay'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '259.00',
    description: 'Abrigo suede verde con forro interno y un botón de bronce en el cuello. Cuenta con bolsillos laterales.',
    composition: '96% policotton / 4% spandex. Forro: 100% Poliéster',
    care: 'Lavar en seco / No usar cloro / No usar secadora / No planchar'
  },
  {
    title: 'Blazer Palermo',
    category: 'Abrigos',
    colors: ['Black', 'Azul oscuro', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '289.00',
    description: 'Blazer de corte recto y largo medio con solapas en pico, mangas largas y bolsillos delanteros. Un botón frontal y tres botones decorativos por puño. Corte en la parte posterior. Forro interior y hombreras.',
    composition: '70% poliéster / 30% viscosa. Forro: 100% poliéster.',
    care: 'Lavar en seco / No usar cloro / No usar secadora / Planchar a temperatura baja'
  },
  {
    title: 'Tapado Córdoba',
    category: 'Abrigos',
    colors: ['Gris'],
    sizes: ['S', 'M', 'L'],
    price: '455.00',
    description: 'Abrigo largo midi de corte recto y con solapas en punta. Un botón central y dos bolsillos funcionales en los laterales frontales. Corte posterior. Forro interno y hombreras.',
    composition: '60% poliéster / 20% viscosa / 20% acrílico. Forro: 100% poliéster.',
    care: 'Lavar en seco / No usar cloro / No usar secadora / Planchar a temperatura baja'
  },
  {
    title: 'Tapado Mara con Cinturón',
    category: 'Abrigos',
    colors: ['Negro', 'Guinda'],
    sizes: ['S', 'M', 'L'],
    price: '477.00',
    description: 'Abrigo largo de silueta recta, con solapas en media punta, botón press on frontal y cinturón. Tres botones en cada puño. Corte posterior. Forro interno y hombreras.',
    composition: '65% acrílico / 35% poliéster. Forro: 100% poliéster.',
    care: 'Lavar en seco / No usar cloro / No usar secadora / Planchar a temperatura baja'
  },
  {
    title: 'Sweater Cuello Alto Bariloche',
    category: 'Poleras y Sweaters',
    colors: ['Negro', 'Perla', 'Gris oscuro'],
    sizes: ['S', 'M', 'L'],
    price: '223.00',
    description: 'Sweater tejido holgado con cuello alto y puño con doblez.',
    composition: '15% alpaca / 85% dralón',
    care: 'Lavado delicado a temperatura baja / No usar cloro / No usar secadora / No planchar'
  },
  {
    title: 'Capa Patagónica',
    category: 'Abrigos',
    colors: ['Negro', 'Camel'],
    sizes: ['Talla Única'],
    price: '269.00',
    description: 'Capa con abertura frontal. Botón decorativo y gancho oculto.',
    composition: '55% lana / 45% viscosa',
    care: 'Lavar en seco / No usar cloro / No usar secadora / No planchar'
  },
  {
    title: 'Camisa Oversize Belgrano',
    category: 'Camisas',
    colors: ['Perla', 'Negro', 'Celeste'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '199.00',
    description: 'Camisa holgada con botones frontales y en puños.',
    composition: '97% rayon / 3% spandex',
    care: 'Ciclo de lavado delicado con agua fría / No usar cloro / No usar secadora / Planchar a temperatura media / Lavar con colores similares / Planchar por el revés'
  },
  {
    title: 'Camisa Básica Malabia',
    category: 'Camisas',
    colors: ['Blanca'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '189.00',
    description: 'Camisa al cuerpo botones frontales ocultos y en puños. Con cuello estructurado.',
    composition: '75% algodón / 25% poliéster.',
    care: 'Ciclo de lavado delicado con agua fría / No usar cloro / No usar secadora / Planchar a temperatura media / Lavar con colores similares / Planchar por el revés'
  },
  {
    title: 'Camisa Denim Soho',
    category: 'Camisas',
    colors: ['Denim oscuro'],
    sizes: ['S', 'M', 'L'],
    price: '249.00',
    description: 'Camisa de denim rígido holgada con botones frontales y en puños.',
    composition: '100% algodón.',
    care: 'Ciclo de lavado delicado con agua fría / No usar cloro / No usar secadora / Planchar a temperatura media / Lavar con colores similares / Lavar por el revés'
  },
  {
    title: 'Polera Cuello Alto Calafate',
    category: 'Poleras y Sweaters',
    colors: ['Negro', 'Perla', 'Verde Botella'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '159.00',
    description: 'Polera de cuello alto acanalado, con mangas acampanadas. Interior con cepillado suave.',
    composition: '66% algodón / 34% poliéster',
    care: 'Lavado a máquina con agua fría / No usar cloro / No usar secadora / Planchar a temperatura media por el revés / Lavar con colores similares / Lavar de revés'
  },
  {
    title: 'Polera con Capucha Aconcagua',
    category: 'Poleras y Sweaters',
    colors: ['Negro', 'Perla'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '159.00',
    description: 'Polera con cordón ajustable, capucha y mangas acampanadas. Interior con cepillado suave.',
    composition: '66% algodón / 34% poliéster',
    care: 'Lavado a máquina con agua fría / No usar cloro / No usar secadora / Planchar a temperatura media por el revés / Lavar con colores similares / Lavar de revés'
  },
  {
    title: 'Jogging Cafayate',
    category: 'Pantalones',
    colors: ['Verde Botella', 'Perla', 'Negro'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '169.00',
    description: 'Pantalón largo holgado de buzo con elástico en la cintura y cordón de ajuste. Bolsillos en costuras laterales.',
    composition: '66% algodón / 34% poliéster',
    care: 'Lavado a máquina con agua fría / No usar cloro / No usar secadora / Planchar a temperatura media por el revés / Lavar con colores similares / Lavar de revés'
  },
  {
    title: 'Falda Suede Pampa',
    category: 'Faldas',
    colors: ['Verde Pacay'],
    sizes: ['28', '30', '32', '34'],
    price: '139.00',
    description: 'Falda corta entrecruzada, con press on interno y gancho de cierre lateral.',
    composition: '96% policotton / 4% spandex',
    care: 'Lavar en seco / No usar cloro o lejía / No usar secadora / No planchar'
  },
  {
    title: 'Pantalón Sastrero Jacarandá',
    category: 'Pantalones',
    colors: ['Negro', 'Gris oscuro', 'Azul oscuro', 'Beige'],
    sizes: ['28', '30', '32', '34'],
    price: '229.00',
    description: 'Pantalón sastrero recto con cierre y broche de corchete oculto. Con una pinza frontal por lado, dos pinzas posteriores, bolsillos laterales funcionales y presillas en la cintura.',
    composition: '70% poliéster / 30% viscosa',
    care: 'Lavar en seco / No usar cloro / No usar secadora / Planchar a temperatura baja'
  },
  {
    title: 'Pantalón Ancho Barolo',
    category: 'Pantalones',
    colors: ['Gris oscuro', 'Negro', 'Azul oscuro', 'Marrón'],
    sizes: ['28', '30', '32', '34'],
    price: '239.00',
    description: 'Pantalón sastrero ancho con cierre y broche de corchete oculto. Con dos pinzas frontales por lado y una pinza posterior por lado. Bolsillos laterales funcionales. Bolsillos posteriores no funcionales.',
    composition: '70% poliéster / 30% viscosa (Gris oscuro / negro / azul oscuro). 87% poliéster / 11% viscosa / 2% spandex (Marrón).',
    care: 'Lavar en seco / No usar cloro / No usar secadora / Planchar a temperatura baja'
  },
  {
    title: 'Jean Recto Ceibo',
    category: 'Denim',
    colors: ['Denim oscuro', 'Denim claro'],
    sizes: ['28', '30', '32', '34'],
    price: '219.00',
    description: 'Jean en denim rígido de corte recto con cintura de talle alto, cierre y botón metálico. Bolsillos frontales y posteriores funcionales.',
    composition: '100% algodón',
    care: 'Ciclo de lavado delicado con agua fría / No usar cloro / No usar secadora / Planchar a temperatura media / Lavar con colores similares / Lavar por el revés'
  },
  {
    title: 'Jean Wide Leg Corrientes',
    category: 'Denim',
    colors: ['Denim oscuro', 'Denim claro'],
    sizes: ['28', '30', '32', '34'],
    price: '239.00',
    description: 'Jean en denim rígido de pierna ancha con cintura de talle alto, cierre y botón metálico. Bolsillos frontales y posteriores funcionales.',
    composition: '100% algodón',
    care: 'Ciclo de lavado delicado con agua fría / No usar cloro / No usar secadora / Planchar a temperatura media / Lavar con colores similares / Lavar por el revés'
  },
  {
    title: 'Polo Cuello Cuadrado Ombú',
    category: 'Polos',
    colors: ['Blanco', 'Negro', 'Guinda', 'Azul oscuro'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '99.00',
    description: 'Polo entallado con escote cuadrado y mangas largas.',
    composition: '93% algodón / 7% Spandex',
    care: 'Ciclo de lavado delicado con agua fría / No usar cloro / No usar secadora / Planchar a temperatura baja / Lavar con colores similares / Lavar y planchar por el revés'
  },
  {
    title: 'Polo Básico Trenque Lauquen',
    category: 'Polos',
    colors: ['Perla', 'Negro', 'Marrón', 'Azul oscuro'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '109.00',
    description: 'Polo holgado con cuello bote, mangas largas y cortes laterales.',
    composition: '100% algodón',
    care: 'Lavado a máquina con agua fría / No usar cloro / No usar secadora / Planchar a temperatura media / Lavar con colores similares / Lavar de revés'
  },
  {
    title: 'Polo Cuello Alto Ushuaia',
    category: 'Polos',
    colors: ['Blanco', 'Negro', 'Guinda', 'Azul oscuro'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: '119.00',
    description: 'Polo entallado con cuello alto y mangas largas.',
    composition: '93% algodón / 7% Spandex',
    care: 'Ciclo de lavado delicado con agua fría / No usar cloro / No usar secadora / Planchar a temperatura baja / Lavar con colores similares / Lavar y planchar por el revés'
  }
];

const manualHandles = new Map([
  ['Polo Cuello Cuadrado Ombú', 'polo-cuello-cuadrado-ombu']
]);

const catalogAssetAliases = new Map([
  ['abrigo-suede-pampa-verde-pacay', 'abrigo-suede-pampa-verde.png'],
  ['blazer-palermo-negro', 'blazer-palermo-negro.png'],
  ['blazer-palermo-azul-oscuro', 'blazer-palermo-azul.png'],
  ['blazer-palermo-black', 'blazer-palermo-negro.png'],
  ['capa-patagonica-negro', 'capa-patagonica-negra.png'],
  ['camisa-basica-malabia-blanca', 'camisa-basica-malabia-blanco.png'],
  ['camisa-denim-soho-denim-oscuro', 'camisa-denim-soho.png'],
  ['camisa-oversize-belgrano-perla', 'camisa-oversize-belgrano-blanco.png'],
  ['jogging-cafayate-perla', 'jogging-cafayate-blanco.png'],
  ['jogging-cafayate-verde-botella', 'jogging-cafayate-verde.png'],
  ['pantalon-ancho-barolo-azul-oscuro', 'pantalon-ancho-barolo-azul.png'],
  ['pantalon-ancho-barolo-gris-oscuro', 'pantalon-ancho-barolo-gris.png'],
  ['polera-con-capucha-aconcagua-perla', 'polera-con-capucha-aconcagua-blanco.png'],
  ['polera-cuello-alto-calafate-perla', 'polera-cuello-alto-calafate-blaco.png'],
  ['polera-cuello-alto-calafate-verde-botella', 'polera-cuello-alto-calafate-verde.png'],
  ['pantalon-sastrero-jacaranda-azul-oscuro', 'pantalon-sastrero-jacaranda-azul.png'],
  ['pantalon-sastrero-jacaranda-gris-oscuro', 'pantalon-sastrero-jacaranda-gris.png'],
  ['tapado-cordoba-gris', 'tapado-simple-cordoba-gris.png'],
  ['sweater-cuello-alto-bariloche-perla', 'sweater-cuello-alto-bariloche-blanco.png'],
  ['sweater-cuello-alto-bariloche-gris-oscuro', 'sweater-cuello-alto-bariloche-gris.png'],
  ['jean-recto-ceibo-denim-claro', 'jean-recto-ceibo-claro.png'],
  ['jean-recto-ceibo-denim-oscuro', 'jean-recto-ceibo-oscuro.png'],
  ['jean-wide-leg-corrientes-denim-claro', 'jean-wide-leg-corrientes-claro.png'],
  ['jean-wide-leg-corrientes-denim-oscuro', 'jean-wide-leg-corrientes-oscuro.png'],
  ['polo-basico-trenque-lauquen-perla', 'polo-basico-trenque-lauquen-blanco.png'],
  ['polo-basico-trenque-lauquen-azul-oscuro', 'polo-basico-trenque-lauquen-azul.png'],
  ['polo-cuello-cuadrado-ombu-guinda', 'polo-cuello-cuadrado-guinda-guinda.png'],
  ['polo-cuello-cuadrado-ombu-azul-oscuro', 'polo-cuello-cuadrado-ombu-azul.png'],
  ['polo-cuello-alto-ushuaia-azul-oscuro', 'polo-cuello-alto-ushuaia-azul.png']
]);

const vestidorSourceMap = new Map([
  ['abrigo-suede-pampa-verde-b', 'abrigo-suede-pampa-tapado-b.png'],
  ['abrigo-suede-pampa-verde-f', 'abrigo-suede-pampa-tapado-f.png'],
  ['blazer-palermo-azul-oscuro-b', 'blazer-palermo-azul-b.png'],
  ['blazer-palermo-azul-oscuro-f', 'blazer-palermo-azul-f.png'],
  ['blazer-palermo-beige-b', 'blazer-palermo-beige-b.png'],
  ['blazer-palermo-beige-f', 'blazer-palermo-beige-f.png'],
  ['blazer-palermo-negro-b', 'blazer-palermo-negro-b.png'],
  ['blazer-palermo-negro-f', 'blazer-palermo-negro-f.png'],
  ['capa-patagonica-camel-b', 'capa-patagonica-camel_b.png'],
  ['capa-patagonica-camel-f', 'capa-patagonica-camel_f.png'],
  ['capa-patagonica-negro-b', 'capa-patagonica-negra_b.png'],
  ['capa-patagonica-negro-f', 'capa-patagonica-negra_f.png'],
  ['tapado-cordoba-gris-b', 'tapado-simple-cordoba-gris-b.png'],
  ['tapado-cordoba-gris-f', 'tapado-simple-cordoba-gris-f.png'],
  ['tapado-mara-con-cinturon-guinda-b', 'tapado-mara-guinda-b.png'],
  ['tapado-mara-con-cinturon-guinda-f', 'tapado-mara-guinda-f.png'],
  ['tapado-mara-con-cinturon-negro-b', 'tapado-mara-negro-b.png'],
  ['tapado-mara-con-cinturon-negro-f', 'tapado-mara-negro-f.png'],
  ['camisa-basica-malabia-blanca', 'camisa-basica-malabia-blanca.png'],
  ['camisa-denim-soho-denim-oscuro', 'camisa-jean-soho-oscuro.png'],
  ['camisa-oversize-belgrano-perla', 'camisa-oversized-belgrano-blanco.png'],
  ['camisa-oversize-belgrano-celeste', 'camisa-oversized-belgrano-celeste.png'],
  ['camisa-oversize-belgrano-negro', 'camisa-oversized-belgrano-negro.png'],
  ['falda-suede-pampa-verde', 'falda-suede-pampa-oliva-.png'],
  ['jean-recto-ceibo-denim-claro', 'jean-recto-ceibo-claro.png'],
  ['jean-recto-ceibo-denim-oscuro', 'jean-recto-ceibo-oscuro.png'],
  ['jean-wide-leg-corrientes-denim-claro', 'jean-wide-leg-corrientes-claro.png'],
  ['jean-wide-leg-corrientes-denim-oscuro', 'jean-wide-leg-corrientes-oscuro.png'],
  ['jogging-cafayate-negro', 'Jogging-Cafayate-negro.png'],
  ['jogging-cafayate-perla', 'Jogging-Cafayate-Blanco.png'],
  ['jogging-cafayate-verde', 'Jogging-Cafayate-Verde.png'],
  ['pantalon-ancho-barolo-azul-oscuro', 'pantalon-ancho-barolo-azul.png'],
  ['pantalon-ancho-barolo-gris', 'pantalon-ancho-barolo-gris.png'],
  ['pantalon-ancho-barolo-marron', 'pantalon-ancho-barolo-marron.png'],
  ['pantalon-ancho-barolo-negro', 'pantalon-ancho-barolo-negro.png'],
  ['pantalon-sastrero-jacaranda-azul-oscuro', 'pantalon-sastrero-jacaranda-azul.png'],
  ['pantalon-sastrero-jacaranda-beige', 'pantalon-sastrero-jacaranda-beige.png'],
  ['pantalon-sastrero-jacaranda-gris', 'pantalon-sastrero-jacaranda-gris.png'],
  ['pantalon-sastrero-jacaranda-negro', 'pantalon-sastrero-jacaranda-negro.png'],
  ['polera-con-capucha-aconcagua-negro', 'buzo-capucha-negro.png'],
  ['polera-con-capucha-aconcagua-perla', 'buzo-capucha-perla.png'],
  ['polera-cuello-alto-calafate-negro', 'buzo-cuello-alto-negro.png'],
  ['polera-cuello-alto-calafate-perla', 'buzo-cuello-alto-blanco.png'],
  ['polera-cuello-alto-calafate-verde', 'buzo-cuello-alto-verde.png'],
  ['polo-basico-trenque-lauquen-azul', 'polo-basico-trenque-lauquen-azul.png'],
  ['polo-basico-trenque-lauquen-marron', 'polo-basico-trenque-lauquen-marron.png'],
  ['polo-basico-trenque-lauquen-negro', 'polo-basico-trenque-lauquen-negro.png'],
  ['polo-basico-trenque-lauquen-perla', 'polo-basico-trenque-lauquen-perla.png'],
  ['polo-cuello-alto-ushuaia-azul', 'polo-cuello-alto-ushuaia-azul.png'],
  ['polo-cuello-alto-ushuaia-blanco', 'polo-cuello-alto-ushuaia-blanco.png'],
  ['polo-cuello-alto-ushuaia-guinda', 'polo-cuello-alto-ushuaia-guinda.png'],
  ['polo-cuello-alto-ushuaia-negro', 'polo-cuello-alto-ushuaia-negro.png'],
  ['polo-cuello-cuadrado-ombu-azul', 'polo-cuello-cuadrado-ombu-azul.png'],
  ['polo-cuello-cuadrado-ombu-blanco', 'polo-cuello-cuadrado-ombu-blanco.png'],
  ['polo-cuello-cuadrado-ombu-guinda', 'polo-cuello-cuadrado-ombu-guinda.png'],
  ['polo-cuello-cuadrado-ombu-negro', 'polo-cuello-cuadrado-ombu-negro.png'],
  ['sweater-cuello-alto-bariloche-gris', 'sweater-bariloche-gris.png'],
  ['sweater-cuello-alto-bariloche-negro', 'sweater-bariloche-negro.png'],
  ['sweater-cuello-alto-bariloche-perla', 'sweater-bariloche-perla.png']
]);

function handleize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function productHandle(product) {
  return manualHandles.get(product.title) || handleize(product.title);
}

function categoryForTheme(product) {
  if (product.category === 'Abrigos') return 'abrigos';
  if (product.category === 'Camisas') return 'camisas';
  if (product.category === 'Denim') return 'denim';
  if (product.category === 'Faldas') return 'faldas';
  if (product.category === 'Pantalones') return 'pantalones';
  if (product.category === 'Poleras y Sweaters') return 'poleras';
  if (product.category === 'Polos') return 'polos';
  return handleize(product.category);
}

function productType(product) {
  return product.category;
}

function descriptionHtml(product) {
  return [
    `<p><strong>Descripción:</strong> ${product.description}</p>`,
    `<p><strong>Composición:</strong> ${product.composition}</p>`,
    `<p><strong>Cuidados:</strong> ${product.care}</p>`,
    exchangePolicyHtml
  ].join('');
}

function visualKey(product, color) {
  const handle = productHandle(product);
  if (!color) return handle;
  return `${handle}-${handleize(color)}`;
}

function productAssetColorSlug(color) {
  const slug = handleize(color);
  if (slug === 'black') return 'negro';
  if (slug === 'verde-pacay' || slug === 'verde-botella') return 'verde';
  if (slug === 'gris-oscuro') return 'gris';
  if (slug === 'azul-oscuro') return 'azul';
  if (slug === 'perla') return 'blanco';
  return slug;
}

function vestidorColorSlug(product, color) {
  const slug = handleize(color);
  if (slug === 'black') return 'negro';
  if (slug === 'verde-pacay' || slug === 'verde-botella') return 'verde';
  if (slug === 'gris-oscuro') return 'gris';
  if (slug === 'azul-oscuro' && productHandle(product).includes('polo')) return 'azul';
  return slug;
}

function productAssetKey(product, color) {
  const handle = productHandle(product);
  if (!color) return handle;
  return `${handle}-${productAssetColorSlug(color)}`;
}

function vestidorKey(product, color) {
  const handle = productHandle(product);
  if (!color) return handle;
  return `${handle}-${vestidorColorSlug(product, color)}`;
}

function expectedCatalogAsset(product, color) {
  const key = productAssetKey(product, color);
  return catalogAssetAliases.get(key) || `${key}.png`;
}

function isDoubleLayer(handle) {
  return /^(abrigo-suede-pampa|blazer-palermo|capa-patagonica|tapado-cordoba|tapado-mara-con-cinturon)/.test(handle);
}

function makeVariants(product) {
  const variants = [];
  product.colors.forEach((color) => {
    product.sizes.forEach((size) => {
      variants.push({
        optionValues: [
          { optionName: 'Color', name: color },
          { optionName: 'Talla', name: size }
        ],
        price: product.price,
        inventoryItem: { tracked: false, requiresShipping: true },
        inventoryPolicy: 'DENY',
        taxable: true
      });
    });
  });
  return variants;
}

function buildProductSetInput(product, existing, collectionId) {
  const handle = productHandle(product);
  return {
    title: product.title,
    handle,
    vendor: 'Casa Tramé',
    status: 'ACTIVE',
    productType: productType(product),
    tags: [product.category],
    collections: collectionId ? [collectionId] : [],
    descriptionHtml: descriptionHtml(product),
    productOptions: [
      { name: 'Color', position: 1, values: product.colors.map((name) => ({ name })) },
      { name: 'Talla', position: 2, values: product.sizes.map((name) => ({ name })) }
    ],
    variants: makeVariants(product)
  };
}

function writeGraphqlFiles(productInputs) {
  fs.mkdirSync(outputDir, { recursive: true });
  const mutationPath = path.join(outputDir, 'product-set.graphql');
  fs.writeFileSync(mutationPath, `mutation ProductSet($identifier: ProductSetIdentifiers!, $input: ProductSetInput!) {
  productSet(identifier: $identifier, input: $input, synchronous: true) {
    product {
      id
      title
      handle
      productType
      options { name values }
      variants(first: 100) { nodes { id title price selectedOptions { name value } } }
    }
    userErrors { field message code }
  }
}
`);

  const files = [];
  for (const { product, existing, input } of productInputs) {
    const file = path.join(outputDir, `${productHandle(product)}.json`);
    fs.writeFileSync(file, JSON.stringify({ identifier: { id: existing.id }, input }, null, 2));
    files.push(file);
  }
  return { mutationPath, files };
}

function updateThemeKeys(productInputs, dryRun) {
  const singleKeys = [];
  const doubleKeys = [];
  for (const { product } of productInputs) {
    const handle = productHandle(product);
    product.colors.forEach((color) => {
      const key = vestidorKey(product, color);
      if (isDoubleLayer(handle)) doubleKeys.push(key);
      else singleKeys.push(key);
    });
  }

  let source = fs.readFileSync(themePagePath, 'utf8');
  source = source.replace(
    /assign vestidor_single_keys = '[^']*'/,
    `assign vestidor_single_keys = '|${singleKeys.join('|')}|'`
  );
  source = source.replace(
    /assign vestidor_double_keys = '[^']*'/,
    `assign vestidor_double_keys = '|${doubleKeys.join('|')}|'`
  );
  if (!dryRun) fs.writeFileSync(themePagePath, source);
  return { singleKeys, doubleKeys };
}

function audit(productInputs, themeKeys) {
  const productSourceFiles = new Set(fs.readdirSync(productAssetsDir));
  const vestidorSourceFiles = new Set(fs.readdirSync(vestidorAssetsDir));
  const themeAssetFiles = fs.existsSync(path.join(root, 'shopify-theme/assets'))
    ? new Set(fs.readdirSync(path.join(root, 'shopify-theme/assets')))
    : new Set();
  const missingCatalog = [];
  const missingVestidorSource = [];
  const expectedThemeAssets = [];

  for (const { product } of productInputs) {
    product.colors.forEach((color) => {
      const catalogAsset = expectedCatalogAsset(product, color);
      if (!productSourceFiles.has(catalogAsset) && !themeAssetFiles.has(catalogAsset)) missingCatalog.push(catalogAsset);

      const key = vestidorKey(product, color);
      if (themeKeys.doubleKeys.includes(key)) {
        [`${key}-b`, `${key}-f`].forEach((layerKey) => {
          const source = vestidorSourceMap.get(layerKey);
          expectedThemeAssets.push(`vestidor-${layerKey}.webp`);
          if (!source || !vestidorSourceFiles.has(source)) missingVestidorSource.push(`${layerKey} -> ${source || 'NO_MAP'}`);
        });
      } else {
        const source = vestidorSourceMap.get(key);
        expectedThemeAssets.push(`vestidor-${key}.webp`);
        if (!source || !vestidorSourceFiles.has(source)) missingVestidorSource.push(`${key} -> ${source || 'NO_MAP'}`);
      }
    });
  }

  return {
    products: productInputs.length,
    visualColors: productInputs.reduce((sum, row) => sum + row.product.colors.length, 0),
    variants: productInputs.reduce((sum, row) => sum + row.input.variants.length, 0),
    missingCatalog,
    missingVestidorSource,
    expectedThemeAssets
  };
}

const current = fs.existsSync(currentPath) ? JSON.parse(fs.readFileSync(currentPath, 'utf8')) : null;
const currentByHandle = new Map((current?.products?.nodes || []).map((product) => [product.handle, product]));
const collection = (current?.collections?.nodes || []).find((item) => item.handle === 'coleccion-otono-invierno-2026');
const collectionId = collection?.id || null;
const dryRun = process.argv.includes('--dry-run');
const missingExisting = products
  .map((product) => productHandle(product))
  .filter((handle) => !currentByHandle.has(handle));
if (missingExisting.length) {
  throw new Error(`Missing existing Shopify products:\n${missingExisting.join('\n')}`);
}
const productInputs = products.map((product) => ({
  product,
  existing: currentByHandle.get(productHandle(product)),
  input: buildProductSetInput(product, currentByHandle.get(productHandle(product)), collectionId)
}));

const themeKeys = updateThemeKeys(productInputs, dryRun);
const graph = writeGraphqlFiles(productInputs);
const report = audit(productInputs, themeKeys);

console.log(JSON.stringify({
  dryRun,
  outputDir,
  mutationPath: graph.mutationPath,
  variableFiles: graph.files,
  collectionId,
  themeKeys: {
    single: themeKeys.singleKeys.length,
    double: themeKeys.doubleKeys.length
  },
  report
}, null, 2));
