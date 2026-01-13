import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { PageLayout } from "@/components/sidebar-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dayData = [
  { day: "Segunda", short: "Seg", realized: 18500, budget: 17800, lastYear: 16200, rank: 2 },
  { day: "Terça", short: "Ter", realized: 22100, budget: 21500, lastYear: 19800, rank: 1 },
  { day: "Quarta", short: "Qua", realized: 17200, budget: 18000, lastYear: 16500, rank: 4 },
  { day: "Quinta", short: "Qui", realized: 19800, budget: 19200, lastYear: 17900, rank: 3 },
  { day: "Sexta", short: "Sex", realized: 15400, budget: 16500, lastYear: 14800, rank: 5 },
  { day: "Sábado", short: "Sáb", realized: 8900, budget: 9200, lastYear: 8100, rank: 6 },
  { day: "Domingo", short: "Dom", realized: 3200, budget: 3500, lastYear: 2900, rank: 7 },
];

const average = dayData.reduce((acc, d) => acc + d.realized, 0) / dayData.length;

function DayCard({ data, index }: { data: typeof dayData[0]; index: number }) {
  const vsBudget = ((data.realized - data.budget) / data.budget * 100);
  const vsLastYear = ((data.realized - data.lastYear) / data.lastYear * 100);
  const isAboveAverage = data.realized > average;
  const isBest = data.rank === 1;
  const isWorst = data.rank === 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`glass rounded-xl p-4 relative overflow-hidden ${
        isBest ? "ring-2 ring-green-500/30" : isWorst ? "ring-2 ring-red-500/30" : ""
      }`}
      data-testid={`card-day-${data.short.toLowerCase()}`}
    >
      {isBest && (
        <div className="absolute top-2 right-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
        </div>
      )}
      {isWorst && (
        <div className="absolute top-2 right-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold">{data.day}</p>
          <p className="text-xs text-muted-foreground">Rank #{data.rank}</p>
        </div>
        <div className={`text-xs px-2 py-0.5 rounded-full ${isAboveAverage ? "bg-status-positive status-positive" : "bg-status-warning status-warning"}`}>
          {isAboveAverage ? "Acima" : "Abaixo"} da média
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-2xl font-semibold">R$ {(data.realized / 1000).toFixed(1)}K</p>
          <p className="text-xs text-muted-foreground">Realizado</p>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
          <div>
            <div className={`flex items-center gap-1 text-sm font-medium ${vsBudget >= 0 ? "status-positive" : "status-negative"}`}>
              {vsBudget >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {vsBudget >= 0 ? "+" : ""}{vsBudget.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs Orçado</p>
          </div>
          <div>
            <div className={`flex items-center gap-1 text-sm font-medium ${vsLastYear >= 0 ? "status-positive" : "status-negative"}`}>
              {vsLastYear >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {vsLastYear >= 0 ? "+" : ""}{vsLastYear.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs AA</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DayOfWeekPage() {
  const rankedData = [...dayData].sort((a, b) => b.realized - a.realized);

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 glass border-b border-border/50">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Análise por <span className="text-gradient">Dia da Semana</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Padrões de comportamento comercial por dia
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="2024-01">
                  <SelectTrigger className="w-40 glass-light text-xs" data-testid="select-period">
                    <Calendar className="w-3.5 h-3.5 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-01">Janeiro 2024</SelectItem>
                    <SelectItem value="2024-02">Fevereiro 2024</SelectItem>
                    <SelectItem value="2024-03">Março 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {dayData.map((day, i) => (
              <DayCard key={day.day} data={day} index={i} />
            ))}
          </section>

          <section className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Comparativo por Dia da Semana</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted-foreground">Realizado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-chart-2" />
                  <span className="text-muted-foreground">Orçado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-muted-foreground/50" />
                  <span className="text-muted-foreground">Ano Anterior</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" vertical={false} />
                  <XAxis dataKey="short" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={50} />
                  <Tooltip contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(217 33% 17%)", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => [`R$ ${(value / 1000).toFixed(1)}K`, ""]} />
                  <Bar dataKey="realized" fill="hsl(199 89% 48%)" radius={[4, 4, 0, 0]} name="Realizado" />
                  <Bar dataKey="budget" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} name="Orçado" />
                  <Bar dataKey="lastYear" fill="hsl(215 20% 55%)" opacity={0.5} radius={[4, 4, 0, 0]} name="Ano Anterior" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="glass rounded-xl p-5">
            <h3 className="font-medium mb-4">Ranking de Performance</h3>
            <div className="space-y-2">
              {rankedData.map((day, i) => {
                const vsBudget = ((day.realized - day.budget) / day.budget * 100);
                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                    data-testid={`rank-${i + 1}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? "bg-yellow-500/20 text-yellow-500" : 
                      i === 1 ? "bg-gray-400/20 text-gray-400" :
                      i === 2 ? "bg-orange-600/20 text-orange-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{day.day}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">R$ {(day.realized / 1000).toFixed(1)}K</p>
                      <p className={`text-xs ${vsBudget >= 0 ? "status-positive" : "status-negative"}`}>
                        {vsBudget >= 0 ? "+" : ""}{vsBudget.toFixed(1)}% vs Orçado
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  );
}
