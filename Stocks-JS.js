const reddit_api = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

async function displayStockTable() {
    const response = await fetch(reddit_api);
    const data = await response.json();

    const tbody = document.querySelector('#stockTable tbody');

    /* extracts only the top 5 from reddit api & creates the table rows (ticker, comment count, sentiment) */
    data.slice(0, 5).forEach(stock => {
        const row = document.createElement('tr');

        const ticker = document.createElement('td');
        const link = document.createElement('a');
        link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
        link.textContent = stock.ticker;
        ticker.appendChild(link);

        const commentsCount = document.createElement('td');
        commentsCount.textContent = stock.no_of_comments;
        const sentiment = document.createElement('td');
        const img = document.createElement('img');
        /* logic to determine where bullish vs bearish according to sentiment from api */
        if (stock.sentiment === 'Bullish') {
            img.src = 'bullish.png';
        } else {
            img.src = 'bearish.png';
        }
        img.style.width = '150px';
        img.style.height = '150px';
        sentiment.appendChild(img);

        row.appendChild(ticker);
        row.appendChild(commentsCount);
        row.appendChild(sentiment);

        tbody.appendChild(row);
    });
}

let stockChart;

async function displayStockChart(stock, days) {
    /* handles EPOCH timestamp */
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const formattedStartDate = startDate.toISOString().split('T')[0]; /* new date format (ex. 2024-11-22: ISO) */

    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${formattedStartDate}/${endDate}?adjusted=true&sort=asc&limit=120&apiKey=yxSEUptiSFbvhoPXX3tyuaMa3FQxC0sP`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    /* map api data to extract dates and closing prices */
    const dates = data.results.map(result => new Date(result.t).toISOString().split('T')[0]);
    const closingPrices = data.results.map(result => result.c);

    const ctx = document.getElementById('stockChart');

    /* destroys previous chart instance if it exists to prevent console issues */
    if (stockChart) {
        stockChart.destroy();
    }

    /* line chart config */
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Stock Price',
                data: closingPrices,
                borderColor: 'lightblue',
                borderWidth: 2,
                fill: false,
            }],
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        /* ensures all dates are shown (esp 90 days) */
                        autoSkip: false,
                    },
                },
            },
        },
    });
}

function initializeAnnyang() {
    if (annyang) {
        const commands = {
            'hello': () => { console.log('Hello world!'); },
            'change the color to *color': (color) => {
                document.body.style.backgroundColor = color;
            },
            'navigate to *page': (page) => {
                if (page === "home") {
                    window.location.href = 'Home.html';
                } else if (page === "stocks") {
                    window.location.href = 'Stock_Page.html';
                } else if (page === "dogs") {
                    window.location.href = 'Dogs_Page.html';
                }
            },
            'look up *stock': (stock) => {
                /* populates stocks using displayStockChart function */
                document.getElementById('stock').value = stock.toUpperCase();
                document.getElementById('days').value = "30";
                displayStockChart(stock.toUpperCase(), "30");
            },
        };

        annyang.addCommands(commands);

        document.querySelector('.turn-on').addEventListener('click', () => annyang.start());
        document.querySelector('.turn-off').addEventListener('click', () => annyang.abort());
    }
}

/* event listener to handle form submission for stock table */
document.getElementById('chartStockForm').onsubmit = async (e) => {
    e.preventDefault();
    const stock = document.getElementById('stock').value.toUpperCase();
    const days = document.getElementById('days').value;
    await displayStockChart(stock, days);
};

window.onload = () => {
    displayStockTable();
    displayStockChart();
    initializeAnnyang();
};