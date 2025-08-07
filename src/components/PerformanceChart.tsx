"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from "recharts";

interface PerformancePoint {
  date: string;
  portfolio: number;
  nifty_fifty: number;
  gold: number;
}

export default function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  return (
    <div className="bg-white border rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">Performance Comparison</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
          <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
          <Legend />
          <Line type="monotone" dataKey="portfolio" stroke="#6366F1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="nifty_fifty" stroke="#22C55E" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="gold" stroke="#F59E0B" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
