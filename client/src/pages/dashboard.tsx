import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  RefreshCw,
  Filter,
  ChevronRight,
  Package,
  MapPin,
  BarChart3,
  DollarSign,
  Box,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/sidebar-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type ViewMode = "price" | "volume";
type TimeGranularity = "daily" | "weekly" | "monthly";

const mockTrendData = {
  daily: [
    { period: "01/01", realized: 245, budget: 250, lastYear: 230 },
    { period: "02/01", realized: 252, budget: 250, lastYear: 235 },
    { period: "03/01", realized: 248, budget: 252, lastYear: 240 },
    { period: "04/01", realized: 260, budget: 255, lastYear: 238 },
    { period: "05/01", realized: 265, budget: 258, lastYear: 242 },
    { period: "06/01", realized: 255, budget: 260, lastYear: 245 },
    { period: "07/01", realized: 270, budget: 262, lastYear: 248 },
    { period: "08/01", realized: 275, budget: 265, lastYear: 250 },
    { period: "09/01", realized: 268, budget: 268, lastYear: 255 },
    { period: "10/01", realized: 280, budget: 270, lastYear: 258 },
    { period: "11/01", realized: 285, budget: 272, lastYear: 262 },
    { period: "12/01", realized: 278, budget: 275, lastYear: 265 },
  ],
  weekly: [
    { period: "S01", realized: 1720, budget: 1750, lastYear: 1610 },
    { period: "S02", realized: 1785, budget: 1765, lastYear: 1680 },
    { period: "S03", realized: 1850, budget: 1820, lastYear: 1715 },
    { period: "S04", realized: 1890, budget: 1855, lastYear: 1750 },
    { period: "S05", realized: 1920, budget: 1890, lastYear: 1785 },
    { period: "S06", realized: 1875, budget: 1905, lastYear: 1810 },
  ],
  monthly: [
    { period: "Jan", realized: 7450, budget: 7200, lastYear: 6800 },
    { period: "Fev", realized: 7100, budget: 7300, lastYear: 6950 },
    { period: "Mar", realized: 7800, budget: 7500, lastYear: 7200 },
    { period: "Abr", realized: 7650, budget: 7600, lastYear: 7350 },
    { period: "Mai", realized: 8100, budget: 7800, lastYear: 7500 },
    { period: "Jun", realized: 8250, budget: 8000, lastYear: 7680 },
  ],
};

const segmentData = [
  { name: "Varejo", value: 12.5, impact: "positive" },
  { name: "Atacado", value: -3.2, impact: "negative" },
  { name: "Food Service", value: 8.7, impact: "positive" },
  { name: "Indústria", value: -1.5, impact: "negative" },
  { name: "Exportação", value: 15.3, impact: "positive" },
];

const packagingData = [
  { name: "PET 500ml", value: 18.2, impact: "positive" },
  { name: "Lata 350ml", value: 5.8, impact: "positive" },
  { name: "Vidro 600ml", value: -7.4, impact: "negative" },
  { name: "RGB 1L", value: 2.1, impact: "positive" },
  { name: "Barril 50L", value: -4.2, impact: "negative" },
];

const regionalData = [
  { region: "Sudeste", realized: "R$ 45.2M", vsBudget: 8.5, vsLastYear: 12.3 },
  { region: "Sul", realized: "R$ 28.7M", vsBudget: -2.1, vsLastYear: 5.8 },
  { region: "Nordeste", realized: "R$ 22.4M", vsBudget: 15.2, vsLastYear: 18.7 },
  { region: "Centro-Oeste", realized: "R$ 15.8M", vsBudget: 3.4, vsLastYear: 7.2 },
  { region: "Norte", realized: "R$ 8.9M", vsBudget: -5.8, vsLastYear: 2.1 },
];

function KPICard({
  label,
  value,
  unit,
  change,
  changeLabel,
  delay = 0,
}: {
  label: string;
  value: string;
  unit?: string;
  change: number;
  changeLabel: string;
  delay?: number;
}) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-xl p-5 relative overflow-hidden group hover:border-primary/30 transition-colors"
      data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="gradient-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      <div className="relative z-10">
        <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-3xl font-semibold tracking-tight">{value}</span>
          {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              isPositive
                ? "bg-status-positive status-positive"
                : isNeutral
                ? "bg-muted text-muted-foreground"
                : "bg-status-negative status-negative"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : isNeutral ? (
              <Minus className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{isPositive ? "+" : ""}{change.toFixed(1)}%</span>
          </div>
          <span className="text-muted-foreground text-xs">{changeLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ImpactChart({
  title,
  data,
  icon: Icon,
  delay = 0,
}: {
  title: string;
  data: typeof segmentData;
  icon: typeof Package;
  delay?: number;
}) {
  const sortedData = [...data].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-xl p-5"
      data-testid={`chart-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ left: 0, right: 10 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(222 47% 9%)",
                border: "1px solid hsl(217 33% 17%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value > 0 ? "+" : ""}${value}%`, "vs Orçado"]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.impact === "positive" ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)"}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function RegionalTable({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-xl p-5"
      data-testid="table-regional"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Visão Regional</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          Ver detalhes <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
      <div className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-2 text-muted-foreground font-medium text-xs">Região</th>
              <th className="text-right py-2 text-muted-foreground font-medium text-xs">Realizado</th>
              <th className="text-right py-2 text-muted-foreground font-medium text-xs">vs Orçado</th>
              <th className="text-right py-2 text-muted-foreground font-medium text-xs">vs AA</th>
            </tr>
          </thead>
          <tbody>
            {regionalData.map((row, i) => (
              <tr
                key={row.region}
                className="border-b border-border/30 last:border-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
                data-testid={`row-region-${i}`}
              >
                <td className="py-3 font-medium">{row.region}</td>
                <td className="py-3 text-right font-mono text-xs">{row.realized}</td>
                <td className={`py-3 text-right font-mono text-xs ${row.vsBudget >= 0 ? "status-positive" : "status-negative"}`}>
                  {row.vsBudget >= 0 ? "+" : ""}{row.vsBudget}%
                </td>
                <td className={`py-3 text-right font-mono text-xs ${row.vsLastYear >= 0 ? "status-positive" : "status-negative"}`}>
                  {row.vsLastYear >= 0 ? "+" : ""}{row.vsLastYear}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function TrendChart({
  granularity,
  delay = 0,
}: {
  granularity: TimeGranularity;
  delay?: number;
}) {
  const data = mockTrendData[granularity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-xl p-5"
      data-testid="chart-trend"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Tendência Temporal</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-primary rounded-full" />
            <span className="text-muted-foreground">Realizado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-chart-2 rounded-full" />
            <span className="text-muted-foreground">Orçado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-muted-foreground rounded-full opacity-50" style={{ borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">Ano Anterior</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" vertical={false} />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              width={45}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(222 47% 9%)",
                border: "1px solid hsl(217 33% 17%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="realized"
              stroke="hsl(199 89% 48%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(199 89% 48%)" }}
              name="Realizado"
            />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="hsl(142 71% 45%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(142 71% 45%)" }}
              name="Orçado"
            />
            <Line
              type="monotone"
              dataKey="lastYear"
              stroke="hsl(215 20% 55%)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              opacity={0.6}
              name="Ano Anterior"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function FilterPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-80 glass-light z-50 p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Filtros Avançados</h3>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-filters">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Região</label>
              <Select>
                <SelectTrigger data-testid="select-filter-region">
                  <SelectValue placeholder="Todas as regiões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as regiões</SelectItem>
                  <SelectItem value="sudeste">Sudeste</SelectItem>
                  <SelectItem value="sul">Sul</SelectItem>
                  <SelectItem value="nordeste">Nordeste</SelectItem>
                  <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
                  <SelectItem value="norte">Norte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Segmento</label>
              <Select>
                <SelectTrigger data-testid="select-filter-segment">
                  <SelectValue placeholder="Todos os segmentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os segmentos</SelectItem>
                  <SelectItem value="varejo">Varejo</SelectItem>
                  <SelectItem value="atacado">Atacado</SelectItem>
                  <SelectItem value="food-service">Food Service</SelectItem>
                  <SelectItem value="industria">Indústria</SelectItem>
                  <SelectItem value="exportacao">Exportação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Embalagem</label>
              <Select>
                <SelectTrigger data-testid="select-filter-packaging">
                  <SelectValue placeholder="Todas as embalagens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as embalagens</SelectItem>
                  <SelectItem value="pet">PET 500ml</SelectItem>
                  <SelectItem value="lata">Lata 350ml</SelectItem>
                  <SelectItem value="vidro">Vidro 600ml</SelectItem>
                  <SelectItem value="rgb">RGB 1L</SelectItem>
                  <SelectItem value="barril">Barril 50L</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Coordenador</label>
              <Select>
                <SelectTrigger data-testid="select-filter-coordinator">
                  <SelectValue placeholder="Todos os coordenadores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os coordenadores</SelectItem>
                  <SelectItem value="coord1">Carlos Silva</SelectItem>
                  <SelectItem value="coord2">Ana Santos</SelectItem>
                  <SelectItem value="coord3">Pedro Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <Button className="w-full" data-testid="button-apply-filters">
              Aplicar Filtros
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("price");
  const [granularity, setGranularity] = useState<TimeGranularity>("monthly");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const lastUpdate = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const kpis = viewMode === "price"
    ? [
        { label: "Realizado", value: "R$ 285", unit: "/RTON", change: 5.4, changeLabel: "vs Orçado" },
        { label: "vs Orçado", value: "+4.8", unit: "%", change: 4.8, changeLabel: "acima da meta" },
        { label: "vs Ano Anterior", value: "+12.3", unit: "%", change: 12.3, changeLabel: "crescimento" },
        { label: "Margem Bruta", value: "32.5", unit: "%", change: 2.1, changeLabel: "vs Orçado" },
      ]
    : [
        { label: "Realizado", value: "125.4K", unit: "RTON", change: 3.2, changeLabel: "vs Orçado" },
        { label: "vs Orçado", value: "+3.2", unit: "%", change: 3.2, changeLabel: "acima da meta" },
        { label: "vs Ano Anterior", value: "+8.7", unit: "%", change: 8.7, changeLabel: "crescimento" },
        { label: "Bonificação", value: "2.8", unit: "%", change: -0.5, changeLabel: "vs Orçado" },
      ];

  return (
    <PageLayout>
    <div className="min-h-screen bg-background">
      <FilterPanel isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
      
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setFiltersOpen(false)}
        />
      )}

      <header className="sticky top-0 z-30 glass border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Performance Comercial – <span className="text-gradient">Preço & Volume</span>
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <RefreshCw className="w-3 h-3" />
                <span>Atualizado em {lastUpdate}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList className="glass-light">
                  <TabsTrigger value="price" className="gap-1.5 text-xs" data-testid="toggle-price">
                    <DollarSign className="w-3.5 h-3.5" />
                    Preço (R$/RTON)
                  </TabsTrigger>
                  <TabsTrigger value="volume" className="gap-1.5 text-xs" data-testid="toggle-volume">
                    <Box className="w-3.5 h-3.5" />
                    Volume (RTON)
                  </TabsTrigger>
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
                  <SelectItem value="2024-04">Abril 2024</SelectItem>
                  <SelectItem value="2024-05">Maio 2024</SelectItem>
                  <SelectItem value="2024-06">Junho 2024</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="glass-light text-xs"
                onClick={() => setFiltersOpen(true)}
                data-testid="button-filters"
              >
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <KPICard key={kpi.label} {...kpi} delay={i * 0.1} />
          ))}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <Tabs value={granularity} onValueChange={(v) => setGranularity(v as TimeGranularity)}>
              <TabsList className="glass-light">
                <TabsTrigger value="daily" className="text-xs" data-testid="granularity-daily">
                  Diário
                </TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs" data-testid="granularity-weekly">
                  Semanal
                </TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs" data-testid="granularity-monthly">
                  Mensal
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <TrendChart granularity={granularity} delay={0.4} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ImpactChart
            title="Performance por Segmento"
            data={segmentData}
            icon={BarChart3}
            delay={0.5}
          />
          <ImpactChart
            title="Performance por Embalagem"
            data={packagingData}
            icon={Package}
            delay={0.6}
          />
        </section>

        <section>
          <RegionalTable delay={0.7} />
        </section>
      </main>
    </div>
    </PageLayout>
  );
}
