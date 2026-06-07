import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const sourceDir = '/Users/tata/Desktop/Casa Trame/Casa Trame - Productos/_Productos 1200x1500';
const assetsDir = path.resolve('shopify-theme/assets');

const aliases = new Map([
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
    return { size: sourceSize, mode: 'copied-source' };
  }

  fs.renameSync(tmpPath, outputPath);
  return { size: tmpSize, mode: 'optimized' };
}

const sourceFiles = fs.readdirSync(sourceDir)
  .filter((file) => file.toLowerCase().endsWith('.png'))
  .sort();

let baseCount = 0;
let aliasCount = 0;
let totalBytes = 0;

for (const file of sourceFiles) {
  const sourcePath = path.join(sourceDir, file);
  const outputPath = path.join(assetsDir, file);
  const result = optimizePng(sourcePath, outputPath);
  baseCount += 1;
  totalBytes += result.size;

  for (const alias of aliases.get(file) || []) {
    fs.copyFileSync(outputPath, path.join(assetsDir, alias));
    aliasCount += 1;
  }
}

console.log(JSON.stringify({
  sourceDir,
  assetsDir,
  baseCount,
  aliasCount,
  totalMB: Number((totalBytes / 1024 / 1024).toFixed(2))
}, null, 2));
