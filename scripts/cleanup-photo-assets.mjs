import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const assetsDir = path.join(root, 'shopify-theme/assets');
const productSourceDir = '/Users/tata/Desktop/Casa Trame/Casa Trame - Productos/_Productos 1200x1500';

const productAliases = new Map([
  ['camisa-basica-malabia-blanco.png', ['camisa-basica-malabia-blanca.png']],
  ['camisa-denim-soho.png', ['camisa-denim-soho-denim-oscuro.png']],
  ['capa-patagonica-negra.png', ['capa-patagonica-negro.png']],
  ['jean-recto-ceibo-claro.png', ['jean-recto-ceibo-denim-claro.png']],
  ['jean-recto-ceibo-oscuro.png', ['jean-recto-ceibo-denim-oscuro.png']],
  ['jean-wide-leg-corrientes-claro.png', ['jean-wide-leg-corrientes-denim-claro.png']],
  ['jean-wide-leg-corrientes-oscuro.png', ['jean-wide-leg-corrientes-denim-oscuro.png']],
  ['polera-cuello-alto-calafate-blaco.png', [
    'polera-cuello-alto-calafate-blanco.png'
  ]],
  ['polo-cuello-cuadrado-guinda-guinda.png', ['polo-cuello-cuadrado-ombu-guinda.png']],
  ['tapado-simple-cordoba-gris.png', ['tapado-cordoba-gris.png']]
]);

const vestidorOutputs = [
  'vestidor-jogging-cafayate-perla.png',
  'vestidor-jogging-cafayate-verde.png',
  'vestidor-jogging-cafayate-negro.png',
  'vestidor-abrigo-suede-pampa-verde-b.png',
  'vestidor-abrigo-suede-pampa-verde-f.png',
  'vestidor-blazer-palermo-azul-oscuro-b.png',
  'vestidor-blazer-palermo-azul-oscuro-f.png',
  'vestidor-blazer-palermo-beige-b.png',
  'vestidor-blazer-palermo-beige-f.png',
  'vestidor-blazer-palermo-negro-b.png',
  'vestidor-blazer-palermo-negro-f.png',
  'vestidor-polera-con-capucha-aconcagua-negro.png',
  'vestidor-polera-con-capucha-aconcagua-perla.png',
  'vestidor-polera-cuello-alto-calafate-perla.png',
  'vestidor-polera-cuello-alto-calafate-negro.png',
  'vestidor-polera-cuello-alto-calafate-verde.png',
  'vestidor-camisa-basica-malabia-blanca.png',
  'vestidor-camisa-denim-soho-denim-oscuro.png',
  'vestidor-camisa-oversize-belgrano-perla.png',
  'vestidor-camisa-oversize-belgrano-celeste.png',
  'vestidor-camisa-oversize-belgrano-negro.png',
  'vestidor-capa-patagonica-camel-b.png',
  'vestidor-capa-patagonica-camel-f.png',
  'vestidor-capa-patagonica-negro-b.png',
  'vestidor-capa-patagonica-negro-f.png',
  'vestidor-falda-suede-pampa-verde.png',
  'vestidor-jean-recto-ceibo-denim-claro.png',
  'vestidor-jean-recto-ceibo-denim-oscuro.png',
  'vestidor-jean-wide-leg-corrientes-denim-claro.png',
  'vestidor-jean-wide-leg-corrientes-denim-oscuro.png',
  'vestidor-pantalon-ancho-barolo-azul-oscuro.png',
  'vestidor-pantalon-ancho-barolo-gris.png',
  'vestidor-pantalon-ancho-barolo-marron.png',
  'vestidor-pantalon-ancho-barolo-negro.png',
  'vestidor-pantalon-sastrero-jacaranda-azul-oscuro.png',
  'vestidor-pantalon-sastrero-jacaranda-beige.png',
  'vestidor-pantalon-sastrero-jacaranda-gris.png',
  'vestidor-pantalon-sastrero-jacaranda-negro.png',
  'vestidor-polo-basico-trenque-lauquen-azul.png',
  'vestidor-polo-basico-trenque-lauquen-marron.png',
  'vestidor-polo-basico-trenque-lauquen-negro.png',
  'vestidor-polo-basico-trenque-lauquen-perla.png',
  'vestidor-polo-cuello-alto-ushuaia-azul.png',
  'vestidor-polo-cuello-alto-ushuaia-blanco.png',
  'vestidor-polo-cuello-alto-ushuaia-guinda.png',
  'vestidor-polo-cuello-alto-ushuaia-negro.png',
  'vestidor-polo-cuello-cuadrado-ombu-azul.png',
  'vestidor-polo-cuello-cuadrado-ombu-blanco.png',
  'vestidor-polo-cuello-cuadrado-ombu-guinda.png',
  'vestidor-polo-cuello-cuadrado-ombu-negro.png',
  'vestidor-sweater-cuello-alto-bariloche-gris.png',
  'vestidor-sweater-cuello-alto-bariloche-negro.png',
  'vestidor-sweater-cuello-alto-bariloche-perla.png',
  'vestidor-tapado-mara-con-cinturon-guinda-b.png',
  'vestidor-tapado-mara-con-cinturon-guinda-f.png',
  'vestidor-tapado-mara-con-cinturon-negro-b.png',
  'vestidor-tapado-mara-con-cinturon-negro-f.png',
  'vestidor-tapado-cordoba-gris-b.png',
  'vestidor-tapado-cordoba-gris-f.png'
];

const productPrefixes = [
  'abrigo-',
  'blazer-',
  'camisa-',
  'capa-',
  'falda-',
  'jean-',
  'jogging-',
  'pantalon-',
  'polera-',
  'polo-',
  'sweater-',
  'tapado-',
  'vestidor-'
];

const keep = new Set();

for (const file of fs.readdirSync(productSourceDir).filter((name) => name.toLowerCase().endsWith('.png'))) {
  const aliases = productAliases.get(file) || [];
  if (aliases.length) {
    for (const alias of aliases) keep.add(alias);
  } else {
    keep.add(file);
  }
}

for (const output of vestidorOutputs) {
  keep.add(output);
  keep.add(output.replace(/\.png$/i, '.webp'));
}

const existing = fs.readdirSync(assetsDir).filter((name) => /\.(png|jpe?g|webp)$/i.test(name));
const stale = existing
  .filter((name) => productPrefixes.some((prefix) => name.startsWith(prefix)))
  .filter((name) => !keep.has(name))
  .sort();

if (!process.argv.includes('--apply')) {
  console.log(JSON.stringify({ mode: 'dry-run', keep: keep.size, staleCount: stale.length, stale }, null, 2));
  process.exit(0);
}

for (const file of stale) {
  fs.rmSync(path.join(assetsDir, file));
}

console.log(JSON.stringify({ mode: 'apply', removed: stale.length, stale }, null, 2));
