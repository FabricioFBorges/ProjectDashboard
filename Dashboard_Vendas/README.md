# Performance Comercial — Preço & Volume (HTML/CSS/JS)

Projeto estático pronto para versionar no Git e evoluir com dados reais.

## Rodar local
Opção 1 (simples): abrir o `index.html` no navegador.

Opção 2 (recomendado): usar um servidor local:
- VSCode: extensão "Live Server"
ou
- Python:
  - `python -m http.server 8000`
  - abra `http://localhost:8000`

## Onde editar
- Layout: `index.html`
- Estilos: `css/styles.css`
- Dados/Interações: `js/main.js` (dataset mock, tabs, export CSV, theme toggle)

## Próximos upgrades (opcional)
- Trocar dataset mock por API:
  - `fetch('/api/performance')`
- Adicionar Chart.js/ECharts para gráfico real
- Criar páginas:
  - /semana
  - /regionais
  - /projecao-vs-real
