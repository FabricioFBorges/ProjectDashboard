import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  ChevronRight,
  Package,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLayout } from "@/components/sidebar-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Packaging {
  name: string;
  volume: number;
  price: number;
  projection: number;
  varM1: number;
  varYoY: number;
}

interface Client {
  id: string;
  name: string;
  segment: string;
  region: string;
  volumeReal: number;
  price: number;
  projection: number;
  varM1: number;
  varYoY: number;
  packagings: Packaging[];
}

const clientsData: Client[] = [
  {
    id: "1",
    name: "Supermercados BomPreço",
    segment: "Varejo",
    region: "Sudeste",
    volumeReal: 4250,
    price: 285.50,
    projection: 4500,
    varM1: 5.2,
    varYoY: 12.8,
    packagings: [
      { name: "PET 500ml", volume: 1800, price: 295.00, projection: 1950, varM1: 6.5, varYoY: 15.2 },
      { name: "Lata 350ml", volume: 1450, price: 310.00, projection: 1500, varM1: 3.8, varYoY: 10.5 },
      { name: "Vidro 600ml", volume: 600, price: 265.00, projection: 650, varM1: 4.2, varYoY: 8.3 },
      { name: "RGB 1L", volume: 400, price: 245.00, projection: 400, varM1: 2.1, varYoY: 5.6 },
    ],
  },
  {
    id: "2",
    name: "Atacadão Distribuição",
    segment: "Atacado",
    region: "Sul",
    volumeReal: 8900,
    price: 258.30,
    projection: 8500,
    varM1: -4.5,
    varYoY: 3.2,
    packagings: [
      { name: "PET 500ml", volume: 4200, price: 268.00, projection: 4000, varM1: -5.2, varYoY: 2.8 },
      { name: "Lata 350ml", volume: 2800, price: 275.00, projection: 2700, varM1: -3.8, varYoY: 4.1 },
      { name: "Barril 50L", volume: 1900, price: 225.00, projection: 1800, varM1: -4.2, varYoY: 2.5 },
    ],
  },
  {
    id: "3",
    name: "Restaurantes Sabor & Arte",
    segment: "Food Service",
    region: "Nordeste",
    volumeReal: 1850,
    price: 312.80,
    projection: 2100,
    varM1: 8.5,
    varYoY: 22.4,
    packagings: [
      { name: "Vidro 600ml", volume: 980, price: 325.00, projection: 1100, varM1: 9.2, varYoY: 25.0 },
      { name: "Barril 50L", volume: 520, price: 295.00, projection: 600, varM1: 7.5, varYoY: 18.5 },
      { name: "Lata 350ml", volume: 350, price: 318.00, projection: 400, varM1: 8.0, varYoY: 20.0 },
    ],
  },
  {
    id: "4",
    name: "Indústria Alimentos SA",
    segment: "Indústria",
    region: "Centro-Oeste",
    volumeReal: 12500,
    price: 195.40,
    projection: 13000,
    varM1: 2.8,
    varYoY: 8.5,
    packagings: [
      { name: "Granel", volume: 10500, price: 188.00, projection: 11000, varM1: 3.0, varYoY: 9.0 },
      { name: "IBC 1000L", volume: 2000, price: 215.00, projection: 2000, varM1: 2.0, varYoY: 6.5 },
    ],
  },
  {
    id: "5",
    name: "Export Trading Co",
    segment: "Exportação",
    region: "Sudeste",
    volumeReal: 25000,
    price: 178.90,
    projection: 28000,
    varM1: 12.0,
    varYoY: 35.2,
    packagings: [
      { name: "Container 20'", volume: 15000, price: 175.00, projection: 17000, varM1: 13.5, varYoY: 38.0 },
      { name: "Container 40'", volume: 10000, price: 185.00, projection: 11000, varM1: 10.0, varYoY: 30.5 },
    ],
  },
  {
    id: "6",
    name: "Mercado Central LTDA",
    segment: "Varejo",
    region: "Norte",
    volumeReal: 980,
    price: 298.50,
    projection: 850,
    varM1: -12.5,
    varYoY: -5.8,
    packagings: [
      { name: "PET 500ml", volume: 450, price: 305.00, projection: 380, varM1: -15.0, varYoY: -8.2 },
      { name: "Lata 350ml", volume: 380, price: 298.00, projection: 340, varM1: -10.0, varYoY: -3.5 },
      { name: "Vidro 600ml", volume: 150, price: 285.00, projection: 130, varM1: -12.0, varYoY: -5.0 },
    ],
  },
];

function ClientRow({ client, index }: { client: Client; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
      <div
        className="grid grid-cols-8 gap-4 py-4 px-4 hover:bg-white/[0.02] cursor-pointer transition-colors items-center border-b border-border/30"
        onClick={() => setExpanded(!expanded)}
        data-testid={`row-client-${client.id}`}
      >
        <div className="flex items-center gap-3 col-span-2">
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
          <div>
            <p className="font-medium text-sm">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.segment} • {client.region}</p>
          </div>
        </div>
        <div className="text-right font-mono text-sm">{client.volumeReal.toLocaleString()} RTON</div>
        <div className="text-right font-mono text-sm">R$ {client.price.toFixed(2)}</div>
        <div className="text-right font-mono text-sm text-muted-foreground">{client.projection.toLocaleString()}</div>
        <div className={`text-right font-mono text-sm flex items-center justify-end gap-1 ${client.varM1 >= 0 ? "status-positive" : "status-negative"}`}>
          {client.varM1 >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {client.varM1 >= 0 ? "+" : ""}{client.varM1.toFixed(1)}%
        </div>
        <div className={`text-right font-mono text-sm flex items-center justify-end gap-1 ${client.varYoY >= 0 ? "status-positive" : "status-negative"}`}>
          {client.varYoY >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {client.varYoY >= 0 ? "+" : ""}{client.varYoY.toFixed(1)}%
        </div>
        <div className="text-right">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
            client.varYoY >= 10 ? "bg-status-positive status-positive" :
            client.varYoY >= 0 ? "bg-status-warning status-warning" :
            "bg-status-negative status-negative"
          }`}>
            {client.varYoY >= 10 ? "Destaque" : client.varYoY >= 0 ? "Regular" : "Atenção"}
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
            <div className="py-2 px-4 pl-14 border-b border-border/20">
              <p className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-1">
                <Package className="w-3 h-3" /> Detalhamento por Embalagem
              </p>
            </div>
            {client.packagings.map((pkg, i) => (
              <div
                key={pkg.name}
                className="grid grid-cols-8 gap-4 py-3 px-4 pl-14 text-sm border-b border-border/20 last:border-0"
                data-testid={`row-packaging-${client.id}-${i}`}
              >
                <div className="flex items-center gap-2 col-span-2">
                  <Package className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{pkg.name}</span>
                </div>
                <div className="text-right font-mono text-xs text-muted-foreground">{pkg.volume.toLocaleString()}</div>
                <div className="text-right font-mono text-xs text-muted-foreground">R$ {pkg.price.toFixed(2)}</div>
                <div className="text-right font-mono text-xs text-muted-foreground">{pkg.projection.toLocaleString()}</div>
                <div className={`text-right font-mono text-xs ${pkg.varM1 >= 0 ? "status-positive" : "status-negative"}`}>
                  {pkg.varM1 >= 0 ? "+" : ""}{pkg.varM1.toFixed(1)}%
                </div>
                <div className={`text-right font-mono text-xs ${pkg.varYoY >= 0 ? "status-positive" : "status-negative"}`}>
                  {pkg.varYoY >= 0 ? "+" : ""}{pkg.varYoY.toFixed(1)}%
                </div>
                <div></div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");

  const filteredClients = clientsData.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = segmentFilter === "all" || client.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  const totalVolume = filteredClients.reduce((acc, c) => acc + c.volumeReal, 0);
  const avgPrice = filteredClients.reduce((acc, c) => acc + c.price, 0) / filteredClients.length;

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 glass border-b border-border/50">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Ficha de <span className="text-gradient">Clientes</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Análise detalhada por cliente e embalagem
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    className="pl-9 w-64 glass-light text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-testid="input-search"
                  />
                </div>
                <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                  <SelectTrigger className="w-36 glass-light text-xs" data-testid="select-segment">
                    <Filter className="w-3.5 h-3.5 mr-2" />
                    <SelectValue placeholder="Segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Varejo">Varejo</SelectItem>
                    <SelectItem value="Atacado">Atacado</SelectItem>
                    <SelectItem value="Food Service">Food Service</SelectItem>
                    <SelectItem value="Indústria">Indústria</SelectItem>
                    <SelectItem value="Exportação">Exportação</SelectItem>
                  </SelectContent>
                </Select>
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
                <Button variant="outline" size="sm" className="glass-light text-xs" data-testid="button-export">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
          <section className="grid grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Total de Clientes</p>
              <p className="text-2xl font-semibold">{filteredClients.length}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Volume Total</p>
              <p className="text-2xl font-semibold">{totalVolume.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">RTON</span></p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Preço Médio</p>
              <p className="text-2xl font-semibold">R$ {avgPrice.toFixed(2)}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-5">
              <p className="text-muted-foreground text-sm mb-1">Em Destaque</p>
              <p className="text-2xl font-semibold status-positive">
                {filteredClients.filter(c => c.varYoY >= 10).length}
              </p>
            </motion.div>
          </section>

          <section className="glass rounded-xl overflow-hidden">
            <div className="grid grid-cols-8 gap-4 py-3 px-4 bg-card/80 border-b border-border/50 text-xs font-medium text-muted-foreground">
              <div className="col-span-2">Cliente</div>
              <div className="text-right">Volume Real</div>
              <div className="text-right">Preço</div>
              <div className="text-right">Projeção</div>
              <div className="text-right">Var. M-1</div>
              <div className="text-right">Var. AA</div>
              <div className="text-right">Status</div>
            </div>
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
              {filteredClients.map((client, i) => (
                <ClientRow key={client.id} client={client} index={i} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  );
}
