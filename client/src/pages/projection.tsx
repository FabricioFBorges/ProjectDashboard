import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { PageLayout } from "@/components/sidebar-nav";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ViewBy = "regional" | "unit" | "channel";

interface ProjectionRow {
  name: string;
  projection: number;
  budget: number;
  diff: number;
  diffPct: number;
  trend: "up" | "down" | "stable";
  risk: "low" | "medium" | "high";
}

const dataByRegional: ProjectionRow[] = [
  { name: "Sudeste", projection: 48500000, budget: 44000000, diff: 4500000, diffPct: 10.2, trend: "up", risk: "low" },
  { name: "Sul", projection: 29500000, budget: 30000000, diff: -500000, diffPct: -1.7, trend: "down", risk: "medium" },
  { name: "Nordeste", projection: 24800000, budget: 21500000, diff: 3300000, diffPct: 15.3, trend: "up", risk: "low" },
  { name: "Centro-Oeste", projection: 16500000, budget: 15200000, diff: 1300000, diffPct: 8.6, trend: "up", risk: "low" },
  { name: "Norte", projection: 8500000, budget: 9500000, diff: -1000000, diffPct: -10.5, trend: "down", risk: "high" },
];

const dataByUnit: ProjectionRow[] = [
  { name: "São Paulo Capital", projection: 19800000, budget: 18000000, diff: 1800000, diffPct: 10.0, trend: "up", risk: "low" },
  { name: "Interior SP", projection: 13200000, budget: 12000000, diff: 1200000, diffPct: 10.0, trend: "up", risk: "low" },
  { name: "Paraná", projection: 12800000, budget: 13000000, diff: -200000, diffPct: -1.5, trend: "stable", risk: "medium" },
  { name: "Rio de Janeiro", projection: 9500000, budget: 8500000, diff: 1000000, diffPct: 11.8, trend: "up", risk: "low" },
  { name: "Santa Catarina", projection: 9500000, budget: 9500000, diff: 0, diffPct: 0, trend: "stable", risk: "low" },
  { name: "Bahia", projection: 9000000, budget: 7800000, diff: 1200000, diffPct: 15.4, trend: "up", risk: "low" },
  { name: "Rio Grande do Sul", projection: 7200000, budget: 7500000, diff: -300000, diffPct: -4.0, trend: "down", risk: "medium" },
  { name: "Pernambuco", projection: 7200000, budget: 6200000, diff: 1000000, diffPct: 16.1, trend: "up", risk: "low" },
];

const dataByChannel: ProjectionRow[] = [
  { name: "Varejo", projection: 52000000, budget: 48000000, diff: 4000000, diffPct: 8.3, trend: "up", risk: "low" },
  { name: "Atacado", projection: 38500000, budget: 40000000, diff: -1500000, diffPct: -3.8, trend: "down", risk: "medium" },
  { name: "Food Service", projection: 18200000, budget: 16500000, diff: 1700000, diffPct: 10.3, trend: "up", risk: "low" },
  { name: "Indústria", projection: 12800000, budget: 12000000, diff: 800000, diffPct: 6.7, trend: "up", risk: "low" },
  { name: "Exportação", projection: 6300000, budget: 5700000, diff: 600000, diffPct: 10.5, trend: "up", risk: "low" },
];

function formatCurrency(value: number) {
  if (Math.abs(value) >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  return `R$ ${(value / 1000).toFixed(0)}K`;
}

function ProjectionTable({ data }: { data: ProjectionRow[] }) {
  const totalProjection = data.reduce((acc, r) => acc + r.projection, 0);
  const totalBudget = data.reduce((acc, r) => acc + r.budget, 0);
  const totalDiff = totalProjection - totalBudget;
  const totalDiffPct = (totalDiff / totalBudget) * 100;

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="grid grid-cols-6 gap-4 py-3 px-4 bg-card/80 border-b border-border/50 text-xs font-medium text-muted-foreground">
        <div className="col-span-2">Descrição</div>
        <div className="text-right">Projeção</div>
        <div className="text-right">Orçado</div>
        <div className="text-right">Diferença</div>
        <div className="text-right">Tendência</div>
      </div>
      <div>
        {data.map((row, i) => (
          <motion.div
            key={row.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-6 gap-4 py-4 px-4 border-b border-border/30 last:border-0 hover:bg-white/[0.02] transition-colors"
            data-testid={`row-projection-${row.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="col-span-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                row.risk === "low" ? "bg-green-500" :
                row.risk === "medium" ? "bg-yellow-500" :
                "bg-red-500"
              }`} />
              <span className="font-medium">{row.name}</span>
            </div>
            <div className="text-right font-mono text-sm">{formatCurrency(row.projection)}</div>
            <div className="text-right font-mono text-sm text-muted-foreground">{formatCurrency(row.budget)}</div>
            <div className="text-right">
              <div className={`font-mono text-sm ${row.diffPct >= 0 ? "status-positive" : "status-negative"}`}>
                {row.diffPct >= 0 ? "+" : ""}{row.diffPct.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {row.diff >= 0 ? "+" : ""}{formatCurrency(row.diff)}
              </div>
            </div>
            <div className="text-right flex items-center justify-end gap-1">
              {row.trend === "up" ? (
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-xs">Subindo</span>
                </div>
              ) : row.trend === "down" ? (
                <div className="flex items-center gap-1 text-red-500">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-xs">Caindo</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Minus className="w-4 h-4" />
                  <span className="text-xs">Estável</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-4 py-4 px-4 bg-card/80 border-t border-border/50 font-medium">
        <div className="col-span-2">Total</div>
        <div className="text-right font-mono">{formatCurrency(totalProjection)}</div>
        <div className="text-right font-mono text-muted-foreground">{formatCurrency(totalBudget)}</div>
        <div className="text-right">
          <span className={`font-mono ${totalDiffPct >= 0 ? "status-positive" : "status-negative"}`}>
            {totalDiffPct >= 0 ? "+" : ""}{totalDiffPct.toFixed(1)}%
          </span>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default function ProjectionPage() {
  const [viewBy, setViewBy] = useState<ViewBy>("regional");

  const data = viewBy === "regional" ? dataByRegional :
               viewBy === "unit" ? dataByUnit :
               dataByChannel;

  const totalProjection = data.reduce((acc, r) => acc + r.projection, 0);
  const totalBudget = data.reduce((acc, r) => acc + r.budget, 0);
  const aboveBudget = data.filter(r => r.diffPct > 0).length;
  const atRisk = data.filter(r => r.risk === "high").length;

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 glass border-b border-border/50">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  <span className="text-gradient">Projeção</span> vs Orçado
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aderência e antecipação de desvios
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Tabs value={viewBy} onValueChange={(v) => setViewBy(v as ViewBy)}>
                  <TabsList className="glass-light">
                    <TabsTrigger value="regional" className="text-xs" data-testid="view-regional">Regional</TabsTrigger>
                    <TabsTrigger value="unit" className="text-xs" data-testid="view-unit">Unidade</TabsTrigger>
                    <TabsTrigger value="channel" className="text-xs" data-testid="view-channel">Canal</TabsTrigger>
                  </TabsList>
                </Tabs>
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
          <section className="grid grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Total Projetado</p>
              <p className="text-2xl font-semibold">{formatCurrency(totalProjection)}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Total Orçado</p>
              <p className="text-2xl font-semibold">{formatCurrency(totalBudget)}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Acima do Orçado</p>
              <p className="text-2xl font-semibold status-positive">{aboveBudget} <span className="text-base text-muted-foreground font-normal">de {data.length}</span></p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Em Risco</p>
              <p className={`text-2xl font-semibold ${atRisk > 0 ? "status-negative" : "status-positive"}`}>
                {atRisk} <span className="text-base text-muted-foreground font-normal">itens</span>
              </p>
            </motion.div>
          </section>

          <section className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">Legenda de risco:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Baixo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Médio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Alto</span>
            </div>
          </section>

          <section>
            <ProjectionTable data={data} />
          </section>
        </main>
      </div>
    </PageLayout>
  );
}
