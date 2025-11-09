#!/usr/bin/env node

/**
 * Script de Otimização de Imagens
 * 
 * Este script:
 * 1. Recomprime imagens WebP com melhor compressão (qualidade 80)
 * 2. Gera versões AVIF (ainda menores que WebP)
 * 3. Mantém imagens responsivas em múltiplas resoluções
 * 4. Usa Sharp para processamento eficiente
 * 
 * Uso:
 *   node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Tentar carregar Sharp de múltiplos locais
let sharp;
try {
  // Tentar carregar do node_modules do frontend
  sharp = require(path.join(__dirname, '../frontend/node_modules/sharp'));
} catch (e1) {
  try {
    // Tentar carregar do node_modules da raiz
    sharp = require('sharp');
  } catch (e2) {
    try {
      // Tentar caminho absoluto
      sharp = require(path.resolve(__dirname, '../frontend/node_modules/sharp'));
    } catch (e3) {
      console.error('⚠️  Sharp não foi encontrado. Por favor, instale com:');
      console.error('   cd frontend && npm install --save-dev sharp');
      console.error('');
      console.error('Erro:', e3.message);
      process.exit(1);
    }
  }
}

// Configurações de otimização
const CONFIG = {
  webp: {
    quality: 90, // Aumentado para melhor qualidade visual
    effort: 6, // 0-6, quanto maior mais lento mas melhor compressão
    lossless: false
  },
  avif: {
    quality: 85, // Aumentado para melhor qualidade
    effort: 6,
    chromaSubsampling: '4:2:0'
  },
  // Não reprocessar imagens já otimizadas (economiza tempo)
  skipIfExists: false
};

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

/**
 * Formata bytes para leitura humana
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Processa uma imagem WebP existente para otimizar e gerar AVIF
 */
async function processImage(inputPath, outputDir) {
  try {
    const filename = path.basename(inputPath);
    const filenameWithoutExt = path.basename(inputPath, '.webp');
    
    // Paths de saída
    const webpOutput = path.join(outputDir, filename);
    const webpTempOutput = path.join(outputDir, filename + '.tmp');
    const avifOutput = path.join(outputDir, filenameWithoutExt + '.avif');
    
    // Verificar se já existe (skip se configurado)
    if (CONFIG.skipIfExists && fs.existsSync(avifOutput)) {
      console.log(`  ${colors.yellow}↷${colors.reset} ${filename} (já existe)`);
      return { skipped: true };
    }
    
    // Obter tamanho original
    const originalStats = await stat(inputPath);
    const originalSize = originalStats.size;
    
    // Carregar imagem em buffer para processar múltiplas vezes
    const imageBuffer = fs.readFileSync(inputPath);
    
    // 1. Recomprimir WebP com melhor qualidade (em arquivo temporário)
    await sharp(imageBuffer)
      .webp(CONFIG.webp)
      .toFile(webpTempOutput);
    
    // 2. Gerar AVIF
    await sharp(imageBuffer)
      .avif(CONFIG.avif)
      .toFile(avifOutput);
    
    // Obter tamanhos dos arquivos processados
    const webpStats = await stat(webpTempOutput);
    const webpSize = webpStats.size;
    const webpSavings = ((1 - webpSize / originalSize) * 100).toFixed(1);
    
    // Substituir arquivo original pelo otimizado (após processar AVIF)
    fs.renameSync(webpTempOutput, webpOutput);
    
    const avifStats = await stat(avifOutput);
    const avifSize = avifStats.size;
    const avifSavings = ((1 - avifSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ${colors.green}✓${colors.reset} ${filename}`);
    console.log(`    ${colors.cyan}WebP:${colors.reset} ${formatBytes(originalSize)} → ${formatBytes(webpSize)} (${webpSavings}% economia)`);
    console.log(`    ${colors.cyan}AVIF:${colors.reset} ${formatBytes(originalSize)} → ${formatBytes(avifSize)} (${avifSavings}% economia)`);
    
    return {
      filename,
      original: originalSize,
      webp: webpSize,
      avif: avifSize,
      webpSavings: originalSize - webpSize,
      avifSavings: originalSize - avifSize
    };
    
  } catch (error) {
    console.error(`  ${colors.red}✗${colors.reset} Erro ao processar ${path.basename(inputPath)}: ${error.message}`);
    return { error: true };
  }
}

/**
 * Processa todas as imagens em um diretório recursivamente
 */
async function processDirectory(dir) {
  const results = {
    processed: 0,
    skipped: 0,
    errors: 0,
    totalOriginal: 0,
    totalWebp: 0,
    totalAvif: 0
  };
  
  try {
    const items = await readdir(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemStat = await stat(fullPath);
      
      if (itemStat.isDirectory()) {
        // Processar subdiretórios recursivamente
        const subResults = await processDirectory(fullPath);
        results.processed += subResults.processed;
        results.skipped += subResults.skipped;
        results.errors += subResults.errors;
        results.totalOriginal += subResults.totalOriginal;
        results.totalWebp += subResults.totalWebp;
        results.totalAvif += subResults.totalAvif;
      } else if (item.endsWith('.webp')) {
        // Processar arquivo WebP
        const result = await processImage(fullPath, dir);
        
        if (result.skipped) {
          results.skipped++;
        } else if (result.error) {
          results.errors++;
        } else {
          results.processed++;
          results.totalOriginal += result.original;
          results.totalWebp += result.webp;
          results.totalAvif += result.avif;
        }
      }
    }
  } catch (error) {
    console.error(`${colors.red}Erro ao processar diretório ${dir}: ${error.message}${colors.reset}`);
  }
  
  return results;
}

/**
 * Main
 */
async function main() {
  console.log(`${colors.bright}${colors.blue}`);
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║   Otimização de Imagens - WebP + AVIF         ║');
  console.log('╚═══════════════════════════════════════════════╝');
  console.log(colors.reset);
  
  const imagesDir = path.join(__dirname, '../frontend/public/images');
  
  if (!fs.existsSync(imagesDir)) {
    console.error(`${colors.red}✗ Diretório de imagens não encontrado: ${imagesDir}${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.cyan}Diretório:${colors.reset} ${imagesDir}\n`);
  console.log(`${colors.cyan}Configurações:${colors.reset}`);
  console.log(`  WebP quality: ${CONFIG.webp.quality}`);
  console.log(`  AVIF quality: ${CONFIG.avif.quality}`);
  console.log('');
  
  console.log(`${colors.bright}Processando imagens...${colors.reset}\n`);
  
  const startTime = Date.now();
  const results = await processDirectory(imagesDir);
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('');
  console.log(`${colors.bright}${colors.green}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}Resumo:${colors.reset}\n`);
  console.log(`  ${colors.green}Processadas:${colors.reset} ${results.processed} imagens`);
  console.log(`  ${colors.yellow}Puladas:${colors.reset} ${results.skipped} imagens`);
  if (results.errors > 0) {
    console.log(`  ${colors.red}Erros:${colors.reset} ${results.errors} imagens`);
  }
  console.log(`  ${colors.cyan}Tempo:${colors.reset} ${duration}s`);
  console.log('');
  
  if (results.processed > 0) {
    const webpSavings = results.totalOriginal - results.totalWebp;
    const avifSavings = results.totalOriginal - results.totalAvif;
    const webpPercent = ((webpSavings / results.totalOriginal) * 100).toFixed(1);
    const avifPercent = ((avifSavings / results.totalOriginal) * 100).toFixed(1);
    
    console.log(`${colors.bright}Economia Total:${colors.reset}\n`);
    console.log(`  ${colors.cyan}Original:${colors.reset} ${formatBytes(results.totalOriginal)}`);
    console.log(`  ${colors.green}WebP otimizado:${colors.reset} ${formatBytes(results.totalWebp)} (${colors.green}-${webpPercent}%${colors.reset})`);
    console.log(`  ${colors.green}AVIF:${colors.reset} ${formatBytes(results.totalAvif)} (${colors.green}-${avifPercent}%${colors.reset})`);
    console.log('');
    console.log(`  ${colors.bright}${colors.green}Economia WebP: ${formatBytes(webpSavings)}${colors.reset}`);
    console.log(`  ${colors.bright}${colors.green}Economia AVIF: ${formatBytes(avifSavings)}${colors.reset}`);
    console.log('');
  }
  
  console.log(`${colors.bright}${colors.green}✓ Otimização concluída!${colors.reset}\n`);
  
  console.log(`${colors.cyan}Próximos passos:${colors.reset}`);
  console.log(`  1. Atualizar componentes para usar AVIF com fallback para WebP`);
  console.log(`  2. Fazer build: ${colors.bright}cd frontend && yarn build${colors.reset}`);
  console.log(`  3. Testar: ${colors.bright}npx serve -s frontend/build${colors.reset}`);
  console.log('');
}

// Executar
main().catch(error => {
  console.error(`${colors.red}Erro fatal: ${error.message}${colors.reset}`);
  process.exit(1);
});

