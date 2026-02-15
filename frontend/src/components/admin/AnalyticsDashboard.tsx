"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useSettings } from "@/context/SettingsContext";

interface AnalyticsDashboardProps {
  data: {
    dailyRevenue: { date: string; revenue: number }[];
    topProducts: { name: string; sales: number; revenue: number }[];
    orderStatus: { name: string; value: number }[];
  };
}

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#8884d8"];

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { formatPrice } = useSettings();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6">
            Revenue Trend (Last 7 Days)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value: any) => [
                    formatPrice(Number(value) || 0),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6">
            Order Status Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.orderStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.orderStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    color: "#fff",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Chart */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
        <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6">
          Top 5 Best-Selling Products
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.topProducts}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                horizontal={false}
              />
              <XAxis type="number" stroke="#666" />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#666"
                width={150}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  borderColor: "#27272a",
                  color: "#fff",
                }}
                cursor={{ fill: "#27272a" }}
              />
              <Bar
                dataKey="sales"
                fill="#00C49F"
                name="Units Sold"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
