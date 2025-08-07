# WealthManager - Stock Portfolio Dashboard

WealthManager is a modern web application for tracking and analyzing your stock portfolio. It provides a clean dashboard with interactive charts, performance analytics, diversification scoring, and detailed holdings breakdown.

## Features

- 📈 **Performance Comparison:** Visualize your portfolio's performance against benchmarks like Nifty 50 and Gold.
- 🏆 **Top & Worst Performers:** Instantly see your best and worst performing stocks.
- 🥧 **Asset Allocation:** Interactive donut charts for sector and market cap allocation.
- 📊 **Holdings Table:** Sortable, searchable, and filterable table of all your holdings.
- 🛡️ **Diversification Score:** Dynamic score based on sector and market cap distribution.
- ⚡ **Risk Level:** Automated risk assessment based on your portfolio's concentration.
- 🔍 **Fast Search:** Debounced, real-time search for holdings.
- 🌙 **Modern UI:** Built with Next.js, React, Tailwind CSS, and Recharts.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Prabhat-Deshmukh022/Stock_View.git
cd Stock_View
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your PostgreSQL connection string:

```
DATABASE_URL=postgresql://username:password@host:port/database
```

> **Note:** The app expects a PostgreSQL database with the required tables and columns as used in the SQL queries.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) in your browser.

---

## Project Structure

```
src/
  app/
    api/
      portfolio/
        allocation/route.ts      # API: Asset allocation by sector & market cap
        holdings/route.ts        # API: Holdings data
        performance/route.ts     # API: Performance timeline & returns
        summary/route.ts         # API: Portfolio summary, diversification, risk
    dashboard/page.tsx           # Main dashboard UI
    globals.css                  # Tailwind & global styles
    layout.tsx                   # App layout
    page.tsx                     # Home page
  components/
    DonutChart.tsx               # Donut chart for allocation
    PerformanceChart.tsx         # Line chart for performance
    ui/card.tsx                  # Card UI component
  lib/
    utils.ts                     # Utility functions (e.g., cn)
db/
  db.ts                          # Database connection (PostgreSQL)
```

---

## Database Schema

The app expects the following tables and columns:

### `holdings`
- `symbol` (string)
- `company_name` (string)
- `quantity` (number)
- `avg_price` (number)
- `current_price` (number)
- `sector` (string)
- `market_cap` (string)
- `value` (number)
- `return_value` (number)
- `return_percent` (number)

### `historical_performance`
- `date` (string, format: `dd-MM-yyyy`)
- `value` (number, portfolio value)
- `nifty_fifty` (number)
- `gold` (number)

---

## Customization

- **Styling:** Uses [Tailwind CSS](https://tailwindcss.com/) for rapid UI development.
- **Charts:** Uses [Recharts](https://recharts.org/) for interactive charts.
- **Icons:** Uses [react-icons](https://react-icons.github.io/react-icons/).

---

## Development Notes

- **TypeScript** is used throughout for type safety.
- **API routes** are in `src/app/api/portfolio/`.
- **Database connection** is managed in `db/db.ts` using the `pg` library.
- **Debounced search** in holdings table for performance.
- **Diversification score** is dynamically calculated using the Herfindahl-Hirschman Index (HHI) for both sector and market cap distribution.

---

## Acknowledgements

- [WealthManager online](https://www.wealthmanager.online/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Supabase](https://supabase.com/) 
