'use client';

import { useEffect, useState } from "react";
import {
  FaRupeeSign,
  FaChartLine,
  FaPercentage,
  FaLayerGroup,
} from "react-icons/fa";
import DonutChart from "@/components/DonutChart";

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

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [allocation, setAllocation] = useState<any>(null);

  useEffect(() => {
    const fetchAllocation = async () => {
      const res = await fetch("/api/portfolio/allocation");
      const data = await res.json();
      setAllocation(data);
    };
    fetchAllocation();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch("/api/portfolio/summary");
      const data = await res.json();
      setSummary(data);
    };
    fetchSummary();
  }, []);

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
          className={`text-3xl ${
            summary.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
          }`}
        />
      ),
    },
    {
      label: "Performance %",
      value: `${summary.totalGainLossPercent}%`,
      icon: (
        <FaPercentage
          className={`text-3xl ${
            summary.totalGainLossPercent >= 0 ? "text-green-600" : "text-red-600"
          }`}
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
      {/* Page Title */}
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

      {/* Asset Allocation Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
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
    </main>
  );
}
