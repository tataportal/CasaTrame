import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const sourceDir = '/Users/tata/Desktop/Casa Trame/Casa Trame - Productos/_Productos 1200x1500_Vestidor';
const assetsDir = path.resolve('shopify-theme/assets');

const files = [
  ['Jogging-Cafayate-Blanco.png', 'vestidor-jogging-cafayate-perla.png'],
  ['Jogging-Cafayate-Verde.png', 'vestidor-jogging-cafayate-verde.png'],
  ['Jogging-Cafayate-negro.png', 'vestidor-jogging-cafayate-negro.png'],
  ['abrigo-suede-pampa-tapado-b.png', 'vestidor-abrigo-suede-pampa-verde-b.png'],
  ['abrigo-suede-pampa-tapado-f.png', 'vestidor-abrigo-suede-pampa-verde-f.png'],
  ['blazer-palermo-azul-b.png', 'vestidor-blazer-palermo-azul-oscuro-b.png'],
  ['blazer-palermo-azul-f.png', 'vestidor-blazer-palermo-azul-oscuro-f.png'],
  ['blazer-palermo-beige-b.png', 'vestidor-blazer-palermo-beige-b.png'],
  ['blazer-palermo-beige-f.png', 'vestidor-blazer-palermo-beige-f.png'],
  ['blazer-palermo-negro-b.png', 'vestidor-blazer-palermo-negro-b.png'],
  ['blazer-palermo-negro-f.png', 'vestidor-blazer-palermo-negro-f.png'],
  ['buzo-capucha-negro.png', 'vestidor-polera-con-capucha-aconcagua-negro.png'],
  ['buzo-capucha-perla.png', 'vestidor-polera-con-capucha-aconcagua-perla.png'],
  ['buzo-cuello-alto-blanco.png', 'vestidor-polera-cuello-alto-calafate-perla.png'],
  ['buzo-cuello-alto-negro.png', 'vestidor-polera-cuello-alto-calafate-negro.png'],
  ['buzo-cuello-alto-verde.png', 'vestidor-polera-cuello-alto-calafate-verde.png'],
  ['camisa-basica-malabia-blanca.png', 'vestidor-camisa-basica-malabia-blanca.png'],
  ['camisa-jean-soho-oscuro.png', 'vestidor-camisa-denim-soho-denim-oscuro.png'],
  ['camisa-oversized-belgrano-blanco.png', 'vestidor-camisa-oversize-belgrano-perla.png'],
  ['camisa-oversized-belgrano-celeste.png', 'vestidor-camisa-oversize-belgrano-celeste.png'],
  ['camisa-oversized-belgrano-negro.png', 'vestidor-camisa-oversize-belgrano-negro.png'],
  ['capa-patagonica-camel_b.png', 'vestidor-capa-patagonica-camel-b.png'],
  ['capa-patagonica-camel_f.png', 'vestidor-capa-patagonica-camel-f.png'],
  ['capa-patagonica-negra_b.png', 'vestidor-capa-patagonica-negro-b.png'],
  ['capa-patagonica-negra_f.png', 'vestidor-capa-patagonica-negro-f.png'],
  ['falda-suede-pampa-oliva-.png', 'vestidor-falda-suede-pampa-verde.png'],
  ['jean-recto-ceibo-claro.png', 'vestidor-jean-recto-ceibo-denim-claro.png'],
  ['jean-recto-ceibo-oscuro.png', 'vestidor-jean-recto-ceibo-denim-oscuro.png'],
  ['jean-wide-leg-corrientes-claro.png', 'vestidor-jean-wide-leg-corrientes-denim-claro.png'],
  ['jean-wide-leg-corrientes-oscuro.png', 'vestidor-jean-wide-leg-corrientes-denim-oscuro.png'],
  ['pantalon-ancho-barolo-azul.png', 'vestidor-pantalon-ancho-barolo-azul-oscuro.png'],
  ['pantalon-ancho-barolo-gris.png', 'vestidor-pantalon-ancho-barolo-gris.png'],
  ['pantalon-ancho-barolo-marron.png', 'vestidor-pantalon-ancho-barolo-marron.png'],
  ['pantalon-ancho-barolo-negro.png', 'vestidor-pantalon-ancho-barolo-negro.png'],
  ['pantalon-sastrero-jacaranda-azul.png', 'vestidor-pantalon-sastrero-jacaranda-azul-oscuro.png'],
  ['pantalon-sastrero-jacaranda-beige.png', 'vestidor-pantalon-sastrero-jacaranda-beige.png'],
  ['pantalon-sastrero-jacaranda-gris.png', 'vestidor-pantalon-sastrero-jacaranda-gris.png'],
  ['pantalon-sastrero-jacaranda-negro.png', 'vestidor-pantalon-sastrero-jacaranda-negro.png'],
  ['polo-basico-trenque-lauquen-azul.png', 'vestidor-polo-basico-trenque-lauquen-azul.png'],
  ['polo-basico-trenque-lauquen-marron.png', 'vestidor-polo-basico-trenque-lauquen-marron.png'],
  ['polo-basico-trenque-lauquen-negro.png', 'vestidor-polo-basico-trenque-lauquen-negro.png'],
  ['polo-basico-trenque-lauquen-perla.png', 'vestidor-polo-basico-trenque-lauquen-perla.png'],
  ['polo-cuello-alto-ushuaia-azul.png', 'vestidor-polo-cuello-alto-ushuaia-azul.png'],
  ['polo-cuello-alto-ushuaia-blanco.png', 'vestidor-polo-cuello-alto-ushuaia-blanco.png'],
  ['polo-cuello-alto-ushuaia-guinda.png', 'vestidor-polo-cuello-alto-ushuaia-guinda.png'],
  ['polo-cuello-alto-ushuaia-negro.png', 'vestidor-polo-cuello-alto-ushuaia-negro.png'],
  ['polo-cuello-cuadrado-ombu-azul.png', 'vestidor-polo-cuello-cuadrado-ombu-azul.png'],
  ['polo-cuello-cuadrado-ombu-blanco.png', 'vestidor-polo-cuello-cuadrado-ombu-blanco.png'],
  ['polo-cuello-cuadrado-ombu-guinda.png', 'vestidor-polo-cuello-cuadrado-ombu-guinda.png'],
  ['polo-cuello-cuadrado-ombu-negro.png', 'vestidor-polo-cuello-cuadrado-ombu-negro.png'],
  ['sweater-bariloche-gris.png', 'vestidor-sweater-cuello-alto-bariloche-gris.png'],
  ['sweater-bariloche-negro.png', 'vestidor-sweater-cuello-alto-bariloche-negro.png'],
  ['sweater-bariloche-perla.png', 'vestidor-sweater-cuello-alto-bariloche-perla.png'],
  ['tapado-mara-guinda-b.png', 'vestidor-tapado-mara-con-cinturon-guinda-b.png'],
  ['tapado-mara-guinda-f.png', 'vestidor-tapado-mara-con-cinturon-guinda-f.png'],
  ['tapado-mara-negro-b.png', 'vestidor-tapado-mara-con-cinturon-negro-b.png'],
  ['tapado-mara-negro-f.png', 'vestidor-tapado-mara-con-cinturon-negro-f.png'],
  ['tapado-simple-cordoba-gris-b.png', 'vestidor-tapado-cordoba-gris-b.png'],
  ['tapado-simple-cordoba-gris-f.png', 'vestidor-tapado-cordoba-gris-f.png'],
];

function optimizePng(sourcePath, outputPath) {
  const tmpPath = `${outputPath}.tmp.png`;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const result = spawnSync('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    sourcePath,
    '-frames:v',
    '1',
    '-compression_level',
    '9',
    '-pred',
    'mixed',
    tmpPath
  ], { stdio: 'pipe' });

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${path.basename(sourcePath)}: ${result.stderr.toString().trim()}`);
  }

  const sourceSize = fs.statSync(sourcePath).size;
  const tmpSize = fs.statSync(tmpPath).size;
  if (tmpSize > sourceSize) {
    fs.copyFileSync(sourcePath, outputPath);
    fs.rmSync(tmpPath);
    return { bytes: sourceSize, mode: 'copied-source' };
  }

  fs.renameSync(tmpPath, outputPath);
  return { bytes: tmpSize, mode: 'optimized' };
}

function optimizeWebp(sourcePath, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const result = spawnSync('cwebp', [
    '-quiet',
    '-mt',
    '-m',
    '6',
    '-q',
    '88',
    '-alpha_q',
    '95',
    sourcePath,
    '-o',
    outputPath
  ], { stdio: 'pipe' });

  if (result.status !== 0) {
    throw new Error(`cwebp failed for ${path.basename(sourcePath)}: ${result.stderr.toString().trim()}`);
  }

  return { bytes: fs.statSync(outputPath).size, mode: 'webp-q88' };
}

let totalBytes = 0;
let totalWebpBytes = 0;
const missing = [];
const written = [];
const writtenWebp = [];

for (const [sourceName, outputName] of files) {
  const sourcePath = path.join(sourceDir, sourceName);
  const outputPath = path.join(assetsDir, outputName);
  const webpOutputPath = outputPath.replace(/\.png$/i, '.webp');
  if (!fs.existsSync(sourcePath)) {
    missing.push(sourceName);
    continue;
  }

  const result = optimizePng(sourcePath, outputPath);
  const webpResult = optimizeWebp(sourcePath, webpOutputPath);
  totalBytes += result.bytes;
  totalWebpBytes += webpResult.bytes;
  written.push({ sourceName, outputName, ...result });
  writtenWebp.push({ sourceName, outputName: path.basename(webpOutputPath), ...webpResult });
}

if (missing.length) {
  throw new Error(`Missing vestidor files:\n${missing.join('\n')}`);
}

console.log(JSON.stringify({
  sourceDir,
  assetsDir,
  written: written.length,
  writtenWebp: writtenWebp.length,
  totalMB: Number((totalBytes / 1024 / 1024).toFixed(2)),
  totalWebpMB: Number((totalWebpBytes / 1024 / 1024).toFixed(2))
}, null, 2));
