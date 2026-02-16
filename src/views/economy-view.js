/**
 * WorldState — Economy Dashboard View (App Mode)
 * Simulated market data with sparkline canvas charts
 */

export class EconomyView {
    constructor() {
        this.el = null;
        this._interval = null;
        this.marketData = {
            dax: { name: 'DAX', value: 18742, change: +2.3, history: [] },
            sp500: { name: 'S&P 500', value: 6120, change: +0.8, history: [] },
            nikkei: { name: 'Nikkei', value: 41200, change: -0.4, history: [] }
        };
        this.cryptoData = {
            btc: { name: 'Bitcoin', symbol: 'BTC', value: 152340, change: +4.2 },
            eth: { name: 'Ethereum', symbol: 'ETH', value: 8920, change: +1.1 },
            sol: { name: 'Solana', symbol: 'SOL', value: 312, change: -2.1 }
        };

        // Generate initial history
        Object.values(this.marketData).forEach(m => {
            for (let i = 0; i < 40; i++) {
                m.history.push(m.value * (0.97 + Math.random() * 0.06));
            }
        });
    }

    render(container) {
        this.el = container;
        this.el.classList.add('economy-view');

        this.el.innerHTML = `
            <div class="view-header">
                <h2 class="view-title">📈 Wirtschaft</h2>
                <button class="view-header-btn">🌍</button>
            </div>

            <section class="eco-section">
                <h3 class="eco-section-title">Globale Märkte</h3>
                <a class="eco-source-link" href="https://finance.yahoo.com/" target="_blank" rel="noopener">📎 Quelle: Yahoo Finance</a>
                <div class="market-tiles" id="market-tiles"></div>
                <canvas id="dax-chart" class="sparkline-chart" width="340" height="120"></canvas>
            </section>

            <section class="eco-section">
                <h3 class="eco-section-title">Krypto</h3>
                <a class="eco-source-link" href="https://www.coingecko.com/" target="_blank" rel="noopener">📎 Quelle: CoinGecko</a>
                <div class="crypto-list" id="crypto-list"></div>
            </section>

            <section class="eco-section">
                <h3 class="eco-section-title">Rohstoffe</h3>
                <a class="eco-source-link" href="https://tradingeconomics.com/commodities" target="_blank" rel="noopener">📎 Quelle: Trading Economics</a>
                <div class="commodity-grid">
                    <div class="commodity-item">
                        <span class="commodity-dot" style="background:#f59e0b"></span>
                        <span>Öl</span>
                        <span class="commodity-val positive">$82.40 ▲</span>
                    </div>
                    <div class="commodity-item">
                        <span class="commodity-dot" style="background:#eab308"></span>
                        <span>Gold</span>
                        <span class="commodity-val positive">$2,840 ▲</span>
                    </div>
                    <div class="commodity-item">
                        <span class="commodity-dot" style="background:#06b6d4"></span>
                        <span>Gas</span>
                        <span class="commodity-val negative">$3.12 ▼</span>
                    </div>
                    <div class="commodity-item">
                        <span class="commodity-dot" style="background:#a3e635"></span>
                        <span>Weizen</span>
                        <span class="commodity-val positive">$5.40 ▲</span>
                    </div>
                </div>
            </section>

            <section class="eco-section">
                <h3 class="eco-section-title">Top Nachrichten</h3>
                <a class="eco-source-link" href="https://www.reuters.com/business/" target="_blank" rel="noopener">📎 Quelle: Reuters</a>
                <div class="eco-news">
                    <div class="eco-news-card">
                        <strong>EZB senkt Leitzins auf 2.5%</strong>
                        <p>Die Europäische Zentralbank hat den Leitzins gesenkt…</p>
                        <span class="eco-news-time">vor 2 Std</span>
                        <a class="eco-news-source" href="https://www.ecb.europa.eu/press/pr/date/2026/html/index.en.html" target="_blank" rel="noopener">📎 EZB Pressemitteilung</a>
                    </div>
                    <div class="eco-news-card">
                        <strong>China exportiert 12% mehr</strong>
                        <p>Chinesische Exporte steigen überraschend stark…</p>
                        <span class="eco-news-time">vor 4 Std</span>
                        <a class="eco-news-source" href="https://www.stats.gov.cn/english/" target="_blank" rel="noopener">📎 National Bureau of Statistics China</a>
                    </div>
                </div>
            </section>
        `;

        this._renderMarketTiles();
        this._renderCryptoList();
        this._drawChart();

        // Simulate live updates
        this._interval = setInterval(() => this._tick(), 3000);
    }

    _renderMarketTiles() {
        const container = this.el.querySelector('#market-tiles');
        if (!container) return;

        container.innerHTML = Object.values(this.marketData).map(m => {
            const isPositive = m.change >= 0;
            return `
                <div class="market-tile">
                    <span class="market-name">${m.name}</span>
                    <span class="market-value">${m.value.toLocaleString()}</span>
                    <span class="market-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '▲' : '▼'} ${Math.abs(m.change).toFixed(1)}%
                    </span>
                </div>
            `;
        }).join('');
    }

    _renderCryptoList() {
        const container = this.el.querySelector('#crypto-list');
        if (!container) return;

        container.innerHTML = Object.values(this.cryptoData).map(c => {
            const isPositive = c.change >= 0;
            return `
                <div class="crypto-row">
                    <div class="crypto-info">
                        <strong>${c.name}</strong>
                        <span class="crypto-symbol">${c.symbol}</span>
                    </div>
                    <div class="crypto-values">
                        <span class="crypto-price">$${c.value.toLocaleString()}</span>
                        <span class="crypto-change ${isPositive ? 'positive' : 'negative'}">
                            ${isPositive ? '▲' : '▼'} ${Math.abs(c.change).toFixed(1)}%
                        </span>
                    </div>
                    <canvas class="crypto-spark" width="60" height="24" data-symbol="${c.symbol}"></canvas>
                </div>
            `;
        }).join('');

        // Draw mini sparklines
        container.querySelectorAll('.crypto-spark').forEach(canvas => {
            this._drawMiniSpark(canvas);
        });
    }

    _drawChart() {
        const canvas = this.el.querySelector('#dax-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.marketData.dax.history;
        const w = canvas.width;
        const h = canvas.height;
        const min = Math.min(...data) * 0.999;
        const max = Math.max(...data) * 1.001;
        const range = max - min || 1;

        ctx.clearRect(0, 0, w, h);

        // Gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(0, h);
        data.forEach((val, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((val - min) / range) * (h - 10);
            ctx.lineTo(x, y);
        });
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        data.forEach((val, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((val - min) / range) * (h - 10);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    _drawMiniSpark(canvas) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const points = [];
        for (let i = 0; i < 12; i++) {
            points.push(Math.random());
        }
        const min = Math.min(...points);
        const max = Math.max(...points);
        const range = max - min || 1;

        ctx.beginPath();
        points.forEach((val, i) => {
            const x = (i / (points.length - 1)) * w;
            const y = h - ((val - min) / range) * (h - 4);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    _tick() {
        // Simulate market fluctuation
        Object.values(this.marketData).forEach(m => {
            const delta = (Math.random() - 0.48) * m.value * 0.002;
            m.value = Math.round(m.value + delta);
            m.change = +(m.change + (Math.random() - 0.48) * 0.1).toFixed(1);
            m.history.push(m.value);
            if (m.history.length > 60) m.history.shift();
        });

        Object.values(this.cryptoData).forEach(c => {
            const delta = (Math.random() - 0.48) * c.value * 0.003;
            c.value = Math.round(c.value + delta);
            c.change = +(c.change + (Math.random() - 0.48) * 0.15).toFixed(1);
        });

        this._renderMarketTiles();
        this._renderCryptoList();
        this._drawChart();
    }
}
