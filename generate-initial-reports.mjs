#!/usr/bin/env node
/**
 * Script para gerar os 3 relatórios iniciais:
 * - Relatório Semanal (última semana)
 * - Relatório Mensal (último mês)
 * - Relatório Trimestral (último trimestre)
 */

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

async function generateReports() {
  console.log('🚀 Iniciando geração de relatórios iniciais...\n');

  try {
    // Import after env is loaded
    const { generateMarketReport } = await import('../server/services/reportGenerator.ts');
    
    // Generate weekly report
    console.log('📊 Gerando relatório semanal...');
    const weeklyId = await generateMarketReport('weekly');
    console.log(`✅ Relatório semanal criado (ID: ${weeklyId})\n`);
    
    // Generate monthly report
    console.log('📊 Gerando relatório mensal...');
    const monthlyId = await generateMarketReport('monthly');
    console.log(`✅ Relatório mensal criado (ID: ${monthlyId})\n`);
    
    // Generate quarterly report
    console.log('📊 Gerando relatório trimestral...');
    const quarterlyId = await generateMarketReport('quarterly');
    console.log(`✅ Relatório trimestral criado (ID: ${quarterlyId})\n`);
    
    console.log('🎉 Todos os relatórios foram gerados com sucesso!');
    console.log(`\nRelatórios criados:`);
    console.log(`- Semanal: ID ${weeklyId}`);
    console.log(`- Mensal: ID ${monthlyId}`);
    console.log(`- Trimestral: ID ${quarterlyId}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao gerar relatórios:', error);
    process.exit(1);
  }
}

generateReports();
