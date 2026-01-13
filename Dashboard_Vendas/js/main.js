(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ===== Mock dataset (troque pelos seus dados reais)
  // Campos: date, venda, volume, preco, descontoPct
  const data = [
    { date: daysAgo(6), venda: 1284500, volume: 4821, preco: 266.41, descontoPct: 7.2 },
    { date: daysAgo(5), venda: 1199800, volume: 4610, preco: 260.26, descontoPct: 7.9 },
    { date: daysAgo(4), venda: 1312200, volume: 4992, preco: 262.86, descontoPct: 7.0 },
    { date: daysAgo(3), venda: 1418700, volume: 5124, preco: 276.78, descontoPct: 6.6 },
    { date: daysAgo(2), venda: 1360500, volume: 5080, preco: 267.81, descontoPct: 7.4 },
    { date: daysAgo(1), venda: 1523400, volume: 5395, preco: 282.37, descontoPct: 6.1 },
    { date: daysAgo(0), venda: 1489100, volume: 5288, preco: 281.66, descontoPct: 6.4 },
  ];

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  function formatBRL(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  function formatInt(v) {
    return v.toLocaleString("pt-BR");
  }
  function formatNum(v) {
    return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function formatPct(v) {
    return `${formatNum(v)}%`;
  }

  // ===== KPIs (último dia vs dia anterior)
  const last = data[data.length - 1];
  const prev = data[data.length - 2];

  const kpis = {
    venda: { value: last.venda, prev: prev.venda, fmt: formatBRL },
    volume: { value: last.volume, prev: prev.volume, fmt: formatInt },
    preco: { value: last.preco, prev: prev.preco, fmt: (x) => `R$ ${formatNum(x)}` },
    desconto: { value: last.descontoPct, prev: prev.descontoPct, fmt: formatPct },
  };

  for (const key of Object.keys(kpis)) {
    const nodes = $$(`[data-kpi="${key}"]`);
    nodes.forEach((n) => (n.textContent = kpis[key].fmt(kpis[key].value)));

    const delta = kpis[key].value - kpis[key].prev;
    const deltaPct = kpis[key].prev ? (delta / kpis[key].prev) * 100 : 0;

    const deltaNode = $(`[data-delta="${key}"]`);
    if (deltaNode) {
      const up = delta >= 0;
      deltaNode.classList.remove("up", "down");
      deltaNode.classList.add(up ? "up" : "down");

      const sign = up ? "+" : "";
      deltaNode.textContent = `${sign}${formatNum(delta)} (${sign}${formatNum(deltaPct)}%) vs D-2`;
    }
  }

  // metas mock
  const metaVenda = $("#metaVenda");
  const metaVolume = $("#metaVolume");
  if (metaVenda) metaVenda.textContent = formatBRL(1500000);
  if (metaVolume) metaVolume.textContent = formatInt(5200);

  // data de atualização
  const lastUpdated = $("#lastUpdated");
  if (lastUpdated) {
    const dt = new Date(last.date + "T08:00:00");
    lastUpdated.textContent = dt.toLocaleDateString("pt-BR");
  }

  // ano footer
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ===== tabela
  const tbody = $("#tbody");
  function renderTable(rows) {
    tbody.innerHTML = rows
      .map((r) => {
        return `
          <tr>
            <td>${new Date(r.date + "T00:00:00").toLocaleDateString("pt-BR")}</td>
            <td class="right">${formatBRL(r.venda)}</td>
            <td class="right">${formatInt(r.volume)}</td>
            <td class="right">R$ ${formatNum(r.preco)}</td>
            <td class="right">${formatPct(r.descontoPct)}</td>
          </tr>
        `;
      })
      .join("");
  }
  renderTable(data);

  // filtro
  const search = $("#search");
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      const filtered = data.filter((r) => {
        const dateBR = new Date(r.date + "T00:00:00").toLocaleDateString("pt-BR");
        return (
          dateBR.includes(q) ||
          String(r.venda).includes(q) ||
          String(r.volume).includes(q) ||
          String(r.preco).includes(q) ||
          String(r.descontoPct).includes(q)
        );
      });
      renderTable(filtered);
    });
  }

  // ===== tabs (mock)
  $$(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".tab").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      // aqui você trocaria o gráfico/tabela conforme a aba
    });
  });

  // ===== export CSV
  const btnExport = $("#btnExport");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const csv = toCSV(data);
      downloadText(csv, `performance_${last.date}.csv`, "text/csv;charset=utf-8;");
    });
  }

  function toCSV(rows) {
    const header = ["date", "venda", "volume", "preco", "descontoPct"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push([r.date, r.venda, r.volume, r.preco, r.descontoPct].join(","));
    }
    return lines.join("\n");
  }

  function downloadText(text, filename, mime) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ===== theme toggle (persistente)
  const btnTheme = $("#btnTheme");
  const themeKey = "pc_theme";
  const saved = localStorage.getItem(themeKey);

  if (saved) document.documentElement.setAttribute("data-theme", saved);

  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(themeKey, next);
    });
  }

  // ===== menu mobile
  const toggle = $(".nav__toggle");
  const navMenu = $("#navMenu");
  if (toggle && navMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // fecha ao clicar num link
    $$(".nav__link", navMenu).forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // fecha ao clicar fora
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!navMenu.contains(t) && !toggle.contains(t)) {
        navMenu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
