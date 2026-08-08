import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Zap,
  Target,
} from "lucide-react";

interface AssetStrengthScoreProps {
  ticker: string;
  technicalData?: {
    rsi?: number;
    macd?: { macd: number; signal: number; histogram: number };
    sma20?: number;
    sma50?: number;
    sma200?: number;
    bollingerBands?: { upper: number; middle: number; lower: number };
    williamsR?: number;
    cci?: number;
    obv?: number;
    atr?: number;
    stochastic?: { k: number; d: number };
  };
  currentPrice?: number;
  change?: number;
  volume?: number;
  avgVolume?: number;
}

// Calculate individual indicator scores
function calculateRSIScore(rsi: number): { score: number; signal: string; color: string } {
  if (rsi <= 30) return { score: 80, signal: "Sobrevendido", color: "text-green-500" };
  if (rsi <= 40) return { score: 65, signal: "Compra", color: "text-green-400" };
  if (rsi >= 70) return { score: 20, signal: "Sobrecomprado", color: "text-red-500" };
  if (rsi >= 60) return { score: 35, signal: "Venda", color: "text-red-400" };
  return { score: 50, signal: "Neutro", color: "text-amber-400" };
}

function calculateMACDScore(macd: { macd: number; signal: number; histogram: number }): { score: number; signal: string; color: string } {
  const { histogram } = macd;
  if (histogram > 0.5) return { score: 80, signal: "Compra Forte", color: "text-green-500" };
  if (histogram > 0) return { score: 65, signal: "Compra", color: "text-green-400" };
  if (histogram < -0.5) return { score: 20, signal: "Venda Forte", color: "text-red-500" };
  if (histogram < 0) return { score: 35, signal: "Venda", color: "text-red-400" };
  return { score: 50, signal: "Neutro", color: "text-amber-400" };
}

function calculateSMAScore(price: number, sma20?: number, sma50?: number, sma200?: number): { score: number; signal: string; color: string } {
  let bullishCount = 0;
  let total = 0;
  
  if (sma20) { total++; if (price > sma20) bullishCount++; }
  if (sma50) { total++; if (price > sma50) bullishCount++; }
  if (sma200) { total++; if (price > sma200) bullishCount++; }
  
  // Golden Cross / Death Cross
  if (sma20 && sma50 && sma20 > sma50) bullishCount += 0.5;
  if (sma50 && sma200 && sma50 > sma200) bullishCount += 0.5;
  
  const ratio = total > 0 ? bullishCount / (total + 1) : 0.5;
  const score = Math.round(ratio * 100);
  
  if (score >= 70) return { score, signal: "Tendência Alta", color: "text-green-500" };
  if (score >= 55) return { score, signal: "Alta Moderada", color: "text-green-400" };
  if (score <= 30) return { score, signal: "Tendência Baixa", color: "text-red-500" };
  if (score <= 45) return { score, signal: "Baixa Moderada", color: "text-red-400" };
  return { score, signal: "Lateral", color: "text-amber-400" };
}

function calculateWilliamsRScore(williamsR: number): { score: number; signal: string; color: string } {
  if (williamsR <= -80) return { score: 80, signal: "Sobrevendido", color: "text-green-500" };
  if (williamsR <= -60) return { score: 65, signal: "Compra", color: "text-green-400" };
  if (williamsR >= -20) return { score: 20, signal: "Sobrecomprado", color: "text-red-500" };
  if (williamsR >= -40) return { score: 35, signal: "Venda", color: "text-red-400" };
  return { score: 50, signal: "Neutro", color: "text-amber-400" };
}

function calculateCCIScore(cci: number): { score: number; signal: string; color: string } {
  if (cci <= -100) return { score: 80, signal: "Sobrevendido", color: "text-green-500" };
  if (cci <= -50) return { score: 65, signal: "Compra", color: "text-green-400" };
  if (cci >= 100) return { score: 20, signal: "Sobrecomprado", color: "text-red-500" };
  if (cci >= 50) return { score: 35, signal: "Venda", color: "text-red-400" };
  return { score: 50, signal: "Neutro", color: "text-amber-400" };
}

function calculateVolumeScore(volume?: number, avgVolume?: number): { score: number; signal: string; color: string } {
  if (!volume || !avgVolume) return { score: 50, signal: "N/A", color: "text-muted-foreground" };
  
  const ratio = volume / avgVolume;
  if (ratio >= 2) return { score: 85, signal: "Volume Muito Alto", color: "text-green-500" };
  if (ratio >= 1.5) return { score: 70, signal: "Volume Alto", color: "text-green-400" };
  if (ratio <= 0.5) return { score: 30, signal: "Volume Baixo", color: "text-red-400" };
  if (ratio <= 0.7) return { score: 40, signal: "Volume Moderado", color: "text-amber-400" };
  return { score: 55, signal: "Volume Normal", color: "text-amber-400" };
}

function calculateMomentumScore(change?: number): { score: number; signal: string; color: string } {
  if (!change) return { score: 50, signal: "N/A", color: "text-muted-foreground" };
  
  if (change >= 5) return { score: 90, signal: "Momentum Forte", color: "text-green-500" };
  if (change >= 2) return { score: 70, signal: "Momentum Positivo", color: "text-green-400" };
  if (change <= -5) return { score: 10, signal: "Momentum Negativo", color: "text-red-500" };
  if (change <= -2) return { score: 30, signal: "Momentum Fraco", color: "text-red-400" };
  return { score: 50, signal: "Momentum Neutro", color: "text-amber-400" };
}

function getOverallRecommendation(score: number): { text: string; color: string; bgColor: string } {
  if (score >= 80) return { text: "COMPRA FORTE", color: "text-green-500", bgColor: "bg-green-500/20" };
  if (score >= 65) return { text: "COMPRA", color: "text-green-400", bgColor: "bg-green-500/10" };
  if (score <= 20) return { text: "VENDA FORTE", color: "text-red-500", bgColor: "bg-red-500/20" };
  if (score <= 35) return { text: "VENDA", color: "text-red-400", bgColor: "bg-red-500/10" };
  return { text: "NEUTRO", color: "text-amber-400", bgColor: "bg-amber-500/10" };
}

export default function AssetStrengthScore({
  ticker,
  technicalData,
  currentPrice,
  change,
  volume,
  avgVolume,
}: AssetStrengthScoreProps) {
  // Calculate individual scores
  const rsiScore = technicalData?.rsi ? calculateRSIScore(technicalData.rsi) : null;
  const macdScore = technicalData?.macd ? calculateMACDScore(technicalData.macd) : null;
  const smaScore = currentPrice ? calculateSMAScore(
    currentPrice,
    technicalData?.sma20,
    technicalData?.sma50,
    technicalData?.sma200
  ) : null;
  const williamsRScore = technicalData?.williamsR !== undefined ? calculateWilliamsRScore(technicalData.williamsR) : null;
  const cciScore = technicalData?.cci !== undefined ? calculateCCIScore(technicalData.cci) : null;
  const volumeScore = calculateVolumeScore(volume, avgVolume);
  const momentumScore = calculateMomentumScore(change);
  
  // Calculate overall score (weighted average)
  const scores = [
    { score: rsiScore?.score, weight: 2 },
    { score: macdScore?.score, weight: 2 },
    { score: smaScore?.score, weight: 2 },
    { score: williamsRScore?.score, weight: 1 },
    { score: cciScore?.score, weight: 1 },
    { score: volumeScore?.score, weight: 1 },
    { score: momentumScore?.score, weight: 1.5 },
  ].filter(s => s.score !== undefined && s.score !== null);
  
  const totalWeight = scores.reduce((acc, s) => acc + s.weight, 0);
  const weightedSum = scores.reduce((acc, s) => acc + (s.score! * s.weight), 0);
  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
  
  const recommendation = getOverallRecommendation(overallScore);
  
  // Indicators list for display
  const indicators = [
    { name: "RSI (14)", value: technicalData?.rsi?.toFixed(1), ...rsiScore },
    { name: "MACD", value: technicalData?.macd?.histogram?.toFixed(3), ...macdScore },
    { name: "Médias Móveis", value: smaScore?.signal, ...smaScore },
    { name: "Williams %R", value: technicalData?.williamsR?.toFixed(1), ...williamsRScore },
    { name: "CCI", value: technicalData?.cci?.toFixed(1), ...cciScore },
    { name: "Volume", value: volumeScore.signal, ...volumeScore },
    { name: "Momentum", value: `${change?.toFixed(2)}%`, ...momentumScore },
  ].filter(i => i.score !== undefined);
  
  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader className="border-b border-slate-700/50 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-cyan-400" />
          Score de Força - {ticker}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Overall Score */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(overallScore / 100) * 352} 352`}
                className={overallScore >= 65 ? "text-green-500" : overallScore <= 35 ? "text-red-500" : "text-amber-500"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono">{overallScore}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          
          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full ${recommendation.bgColor}`}>
            {overallScore >= 50 ? (
              <ArrowUpRight className={`h-5 w-5 ${recommendation.color}`} />
            ) : (
              <ArrowDownRight className={`h-5 w-5 ${recommendation.color}`} />
            )}
            <span className={`font-bold ${recommendation.color}`}>{recommendation.text}</span>
          </div>
        </div>
        
        {/* Indicators Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Indicadores Técnicos</h4>
          {indicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{indicator.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono">{indicator.value || "N/A"}</span>
                <Badge className={`${
                  indicator.score && indicator.score >= 65 ? "bg-green-500/20 text-green-400" :
                  indicator.score && indicator.score <= 35 ? "bg-red-500/20 text-red-400" :
                  "bg-amber-500/20 text-amber-400"
                }`}>
                  {indicator.signal || "N/A"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Indicators */}
        {technicalData && (
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Indicadores Adicionais</h4>
            <div className="grid grid-cols-2 gap-4">
              {technicalData.atr && (
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-muted-foreground">ATR (Volatilidade)</p>
                  <p className="font-mono font-medium">{technicalData.atr.toFixed(2)}</p>
                </div>
              )}
              {technicalData.stochastic && (
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-muted-foreground">Stochastic K/D</p>
                  <p className="font-mono font-medium">
                    {technicalData.stochastic.k.toFixed(1)} / {technicalData.stochastic.d.toFixed(1)}
                  </p>
                </div>
              )}
              {technicalData.bollingerBands && (
                <div className="p-3 rounded-lg bg-slate-800/50 col-span-2">
                  <p className="text-xs text-muted-foreground">Bollinger Bands</p>
                  <div className="flex justify-between font-mono text-sm mt-1">
                    <span className="text-red-400">↓ {technicalData.bollingerBands.lower.toFixed(2)}</span>
                    <span className="text-amber-400">— {technicalData.bollingerBands.middle.toFixed(2)}</span>
                    <span className="text-green-400">↑ {technicalData.bollingerBands.upper.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-muted-foreground text-center">
            Score baseado em análise técnica. Não constitui recomendação de investimento.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
