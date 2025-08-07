'use client';

import { useEffect, useState, useMemo } from "react";
import {
  FaRupeeSign,
  FaChartLine,
  FaPercentage,
  FaLayerGroup,
  FaSearch,
} from "react-icons/fa";
import DonutChart from "@/components/DonutChart";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import PerformanceChart from "@/components/PerformanceChart";

interface Summary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  topPerformer: { symbol: string; name: string; gainPercent: number };
  worstPerformer: { symbol: string; name: string; gainPercent: number };
  diversificationScore: number;
  riskLevel: string;
  totalHoldings: number;
}

interface Holding {
  symbol: string;
  company_name: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  sector: string;
  market_cap: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [allocation, setAllocation] = useState<any>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [performance, setPerformance] = useState<any>(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      const res = await fetch("/api/portfolio/performance");
      const data = await res.json();

      const timeline = data.timeline.map((item: any) => ({
        date: item.date,
        portfolio: Number(item.portfolio),
        nifty_fifty: Number(item.nifty_fifty),
        gold: Number(item.gold),
      }));

      setPerformance({ ...data, timeline });
    };
    fetchPerformance();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch("/api/portfolio/summary");
      const data = await res.json();
      setSummary(data);
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchAllocation = async () => {
      const res = await fetch("/api/portfolio/allocation");
      const data = await res.json();
      setAllocation(data);
    };
    fetchAllocation();
  }, []);

  useEffect(() => {
    const fetchHoldings = async () => {
      const res = await fetch("/api/portfolio/holdings");
      const data = await res.json();
      console.log(data);
      const sanitized = data.map((row: any) => ({
      ...row,
      quantity: Number(row.quantity),
      avg_price: Number(row.avg_price),
      current_price: Number(row.current_price),
      value: Number(row.value),
      gainloss: Number(row.gainloss),
      gainlosspercent: Number(row.gainlosspercent),
      }));
      console.log("Sanitized holdings", sanitized);


      setHoldings(sanitized);
    };
    fetchHoldings();
  }, []);

  const columns = useMemo<ColumnDef<Holding>[]>(
    () => [
      {
        accessorKey: "symbol",
        header: "Symbol",
      },
      {
        accessorKey: "company_name",
        header: "Company",
      },
      {
        accessorKey: "quantity",
        header: "Qty",
      },
      {
        accessorKey: "avg_price",
        header: "Avg Price",
      },
      {
        accessorKey: "current_price",
        header: "Current Price",
      },
      {
        accessorKey: "value",
        header: "Value",
        cell: (info) => `₹${parseFloat(info.getValue() as string).toLocaleString()}`,
      },
{
  accessorKey: "gainloss",
  header: "Gain/Loss",
  cell: (info) => {
    const raw = info.getValue();
    const val = Number(raw);
    if (isNaN(val)) return "—";
    return (
      <span className={val >= 0 ? "text-green-600" : "text-red-600"}>
        ₹{val.toLocaleString()}
      </span>
    );
  },
},
{
  accessorKey: "gainlosspercent",
  header: "Gain/Loss %",
  cell: (info) => {
    const raw = info.getValue();
    const val = Number(raw);
    if (isNaN(val)) return "—";
    return (
      <span className={val >= 0 ? "text-green-600" : "text-red-600"}>
        {val.toFixed(2)}%
      </span>
    );
  },
},
         {
        accessorKey: "sector",
        header: "Sector",
      },
      {
        accessorKey: "market_cap",
        header: "Market Cap",
      },
    ],
    []
  );

  const filteredHoldings = useMemo(
  () =>
    holdings.filter((d) =>
      (d.symbol || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    ),  
  [holdings, debouncedSearch]
);


  const table = useReactTable({
    data: filteredHoldings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!summary || !allocation) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  const cardClass =
    "flex items-center gap-4 shadow-md border border-gray-200 rounded-2xl px-6 py-5 bg-white";

  const metrics = [
    {
      label: "Total Portfolio Value",
      value: `₹${summary.totalValue.toLocaleString()}`,
      icon: <FaRupeeSign className="text-3xl text-purple-700" />,
    },
    {
      label: "Total Gain/Loss",
      value: `₹${summary.totalGainLoss.toLocaleString()}`,
      icon: (
        <FaChartLine
          className={`text-3xl ${summary.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}
        />
      ),
    },
    {
      label: "Performance %",
      value: `${summary.totalGainLossPercent}%`,
      icon: (
        <FaPercentage
          className={`text-3xl ${summary.totalGainLossPercent >= 0 ? "text-green-600" : "text-red-600"}`}
        />
      ),
    },
    {
      label: "Number of Holdings",
      value: summary.totalHoldings,
      icon: <FaLayerGroup className="text-3xl text-indigo-600" />,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Portfolio Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((metric, idx) => (
          <div key={idx} className={cardClass}>
            {metric.icon}
            <div>
              <p className="text-sm text-gray-500 uppercase font-medium tracking-wider">
                {metric.label}
              </p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Allocation */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">Asset Allocation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4 border">
            <DonutChart
              title="Sector Allocation"
              data={allocation.bySector.map((item: any) => ({
                name: item.sector,
                percentage: item.percentage,
              }))}
            />
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border">
            <DonutChart
              title="Market Cap Allocation"
              data={Object.entries(allocation.byMarketCap).map(([name, val]: any) => ({
                name,
                percentage: val.percentage,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">Holdings</h2>
        <div className="mb-4 flex items-center gap-2">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by symbol..."
            className="border rounded px-3 py-1 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 font-semibold cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {table.getRowModel().rows.length === 0 && (
            <div className="p-4 text-center text-gray-400">No results found</div>
          )}
        </div>
      </div>

      {performance && (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 mt-10">
      <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">
        📈 Performance Comparison
      </h2>

      <PerformanceChart data={performance.timeline} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">1 Month Return</h3>
          <p>Portfolio: {performance.returns.portfolio.one_month}%</p>
          <p>Nifty 50: {performance.returns.nifty_fifty.one_month}%</p>
          <p>Gold: {performance.returns.gold.one_month}%</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">3 Months Return</h3>
          <p>Portfolio: {performance.returns.portfolio.three_months}%</p>
          <p>Nifty 50: {performance.returns.nifty_fifty.three_months}%</p>
          <p>Gold: {performance.returns.gold.three_months}%</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">1 Year Return</h3>
          <p>Portfolio: {performance.returns.portfolio.one_year}%</p>
          <p>Nifty 50: {performance.returns.nifty_fifty.one_year}%</p>
          <p>Gold: {performance.returns.gold.one_year}%</p>
        </div>
      </div>
    </div>
    )}
     <div className="my-10" />

    {/* Top Performers & Insights */}
<div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 mt-10">
  <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">
    🏆 Top Performers & Insights
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Best Performer */}
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-green-700 mb-1">Top Performer</h3>
      <p className="text-lg font-bold text-green-900">{summary.topPerformer.name}</p>
      <p className="text-sm text-green-600">({summary.topPerformer.symbol})</p>
      <p className="text-sm text-green-600 mt-1">
        Gain: {summary.topPerformer.gainPercent.toFixed(2)}%
      </p>
    </div>

    {/* Worst Performer */}
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-red-700 mb-1">Worst Performer</h3>
      <p className="text-lg font-bold text-red-900">{summary.worstPerformer.name}</p>
      <p className="text-sm text-red-600">({summary.worstPerformer.symbol})</p>
      <p className="text-sm text-red-600 mt-1">
        Loss: {summary.worstPerformer.gainPercent.toFixed(2)}%
      </p>
    </div>

    {/* Diversification Score */}
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-indigo-700 mb-1">Diversification Score</h3>
      <p className="text-2xl font-bold text-indigo-900">{summary.diversificationScore}/10</p>
      <p className="text-sm text-indigo-600 mt-1">Based on sector and market cap distribution</p>
    </div>

    {/* Risk Level */}
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-yellow-700 mb-1">Risk Level</h3>
      <p className="text-xl font-bold text-yellow-900">{summary.riskLevel}</p>
      <p className="text-sm text-yellow-600 mt-1">Based on asset concentration</p>
    </div>
  </div>
</div>
      

    </main>
  );
}
