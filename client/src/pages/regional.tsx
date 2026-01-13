import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  MapPin,
  TrendingUp,
  TrendingDown,
  Building2,
} from "lucide-react";
import { PageLayout } from "@/components/sidebar-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Unit {
  name: string;
  realized: number;
  projected: number;
  budget: number;
}

interface Regional {
  name: string;
  realized: number;
  projected: number;
  budget: number;
  units: Unit[];
}

const regionalData: Regional[] = [
  {
    name: "Sudeste",
    realized: 45200000,
    projected: 48500000,
    budget: 44000000,
    units: [
      { name: "São Paulo Capital", realized: 18500000, projected: 19800000, budget: 18000000 },
      { name: "Interior SP", realized: 12300000, projected: 13200000, budget: 12000000 },
      { name: "Rio de Janeiro", realized: 8900000, projected: 9500000, budget: 8500000 },
      { name: "Minas Gerais", realized: 5500000, projected: 6000000, budget: 5500000 },
    ],
  },
  {
    name: "Sul",
    realized: 28700000,
    projected: 29500000,
    budget: 30000000,
    units: [
      { name: "Paraná", realized: 12500000, projected: 12800000, budget: 13000000 },
      { name: "Santa Catarina", realized: 9200000, projected: 9500000, budget: 9500000 },
      { name: "Rio Grande do Sul", realized: 7000000, projected: 7200000, budget: 7500000 },
    ],
  },
  {
    name: "Nordeste",
    realized: 22400000,
    projected: 24800000,
    budget: 21500000,
    units: [
      { name: "Bahia", realized: 8200000, projected: 9000000, budget: 7800000 },
      { name: "Pernambuco", realized: 6500000, projected: 7200000, budget: 6200000 },
      { name: "Ceará", realized: 4800000, projected: 5200000, budget: 4600000 },
      { name: "Outros NE", realized: 2900000, projected: 3400000, budget: 2900000 },
    ],
  },
  {
    name: "Centro-Oeste",
    realized: 15800000,
    projected: 16500000,
    budget: 15200000,
    units: [
      { name: "Goiás", realized: 6200000, projected: 6500000, budget: 6000000 },
      { name: "Mato Grosso", realized: 5100000, projected: 5400000, budget: 5000000 },
      { name: "Distrito Federal", realized: 4500000, projected: 4600000, budget: 4200000 },
    ],
  },
  {
    name: "Norte",
    realized: 8900000,
    projected: 8500000,
    budget: 9500000,
    units: [
      { name: "Pará", realized: 4200000, projected: 4000000, budget: 4500000 },
      { name: "Amazonas", realized: 2800000, projected: 2700000, budget: 3000000 },
      { name: "Outros Norte", realized: 1900000, projected: 1800000, budget: 2000000 },
    ],
  },
];

function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  return `R$ ${(value / 1000).toFixed(0)}K`;
}

function RegionalRow({ regional, index }: { regional: Regional; index: number }) {
  const [expanded, setExpanded] = useState(false);
  
  const diffBudget = regional.realized - regional.budget;
  const diffBudgetPct = (diffBudget / regional.budget) * 100;
  const diffProjected = regional.projected - regional.budget;
  const diffProjectedPct = (diffProjected / regional.budget) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <div
        className="grid grid-cols-6 gap-4 py-4 px-4 hover:bg-white/[0.02] cursor-pointer transition-colors items-center border-b border-border/30"
        onClick={() => setExpanded(!expanded)}
        data-testid={`row-regional-${regional.name.toLowerCase()}`}
      >
        <div className="flex items-center gap-3 col-span-1">
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-medium">{regional.name}</span>
        </div>
        <div className="text-right font-mono text-sm">{formatCurrency(regional.realized)}</div>
        <div className="text-right font-mono text-sm">{formatCurrency(regional.projected)}</div>
        <div className="text-right font-mono text-sm">{formatCurrency(regional.budget)}</div>
        <div className={`text-right font-mono text-sm flex items-center justify-end gap-1 ${diffBudgetPct >= 0 ? "status-positive" : "status-negative"}`}>
          {diffBudgetPct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {diffBudgetPct >= 0 ? "+" : ""}{diffBudgetPct.toFixed(1)}%
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            diffProjectedPct >= 5 ? "bg-status-positive status-positive" :
            diffProjectedPct >= 0 ? "bg-status-warning status-warning" :
            "bg-status-negative status-negative"
          }`}>
            {diffProjectedPct >= 0 ? "+" : ""}{diffProjectedPct.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-card/50"
          >
            {regional.units.map((unit) => {
              const unitDiffPct = ((unit.realized - unit.budget) / unit.budget) * 100;
              const unitProjDiffPct = ((unit.projected - unit.budget) / unit.budget) * 100;
              return (
                <div
                  key={unit.name}
                  className="grid grid-cols-6 gap-4 py-3 px-4 pl-14 text-sm border-b border-border/20 last:border-0"
                  data-testid={`row-unit-${unit.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-2 col-span-1">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{unit.name}</span>
                  </div>
                  <div className="text-right font-mono text-xs text-muted-foreground">{formatCurrency(unit.realized)}</div>
                  <div className="text-right font-mono text-xs text-muted-foreground">{formatCurrency(unit.projected)}</div>
                  <div className="text-right font-mono text-xs text-muted-foreground">{formatCurrency(unit.budget)}</div>
                  <div className={`text-right font-mono text-xs ${unitDiffPct >= 0 ? "status-positive" : "status-negative"}`}>
                    {unitDiffPct >= 0 ? "+" : ""}{unitDiffPct.toFixed(1)}%
                  </div>
                  <div className={`text-right font-mono text-xs ${unitProjDiffPct >= 0 ? "status-positive" : "status-negative"}`}>
                    {unitProjDiffPct >= 0 ? "+" : ""}{unitProjDiffPct.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RegionalPage() {
  const totalRealized = regionalData.reduce((acc, r) => acc + r.realized, 0);
  const totalProjected = regionalData.reduce((acc, r) => acc + r.projected, 0);
  const totalBudget = regionalData.reduce((acc, r) => acc + r.budget, 0);

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 glass border-b border-border/50">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Análise por <span className="text-gradient">Regionais</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Performance por regional e unidade
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
          <section className="grid grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Total Realizado</p>
              <p className="text-2xl font-semibold">{formatCurrency(totalRealized)}</p>
              <p className={`text-sm mt-1 ${((totalRealized - totalBudget) / totalBudget * 100) >= 0 ? "status-positive" : "status-negative"}`}>
                {((totalRealized - totalBudget) / totalBudget * 100) >= 0 ? "+" : ""}
                {((totalRealized - totalBudget) / totalBudget * 100).toFixed(1)}% vs Orçado
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Total Projetado</p>
              <p className="text-2xl font-semibold">{formatCurrency(totalProjected)}</p>
              <p className={`text-sm mt-1 ${((totalProjected - totalBudget) / totalBudget * 100) >= 0 ? "status-positive" : "status-negative"}`}>
                {((totalProjected - totalBudget) / totalBudget * 100) >= 0 ? "+" : ""}
                {((totalProjected - totalBudget) / totalBudget * 100).toFixed(1)}% vs Orçado
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Total Orçado</p>
              <p className="text-2xl font-semibold">{formatCurrency(totalBudget)}</p>
              <p className="text-sm mt-1 text-muted-foreground">Meta do período</p>
            </motion.div>
          </section>

          <section className="glass rounded-xl overflow-hidden">
            <div className="grid grid-cols-6 gap-4 py-3 px-4 bg-card/80 border-b border-border/50 text-xs font-medium text-muted-foreground">
              <div>Regional / Unidade</div>
              <div className="text-right">Realizado</div>
              <div className="text-right">Projetado</div>
              <div className="text-right">Orçado</div>
              <div className="text-right">Dif. Real</div>
              <div className="text-right">Dif. Proj.</div>
            </div>
            <div>
              {regionalData.map((regional, i) => (
                <RegionalRow key={regional.name} regional={regional} index={i} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  );
}
