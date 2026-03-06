import React from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingUp, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Studio } from '../types';

interface EconomyDashboardProps {
  studio: Studio;
}

export default function EconomyDashboard({ studio }: EconomyDashboardProps) {
  const profitData = (studio.monthlyProfit || []).map((profit, i) => ({
    month: `Month ${i + 1}`,
    profit: profit
  }));

  const revenueData = (studio.projects || [])
    .filter(p => p.boxOffice > 0)
    .map(p => ({
      name: p.title,
      theatrical: p.theatricalRevenue,
      streaming: p.streamingRevenue
    }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-6 rounded-[32px]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-2xl">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Studio Valuation</p>
              <h3 className="text-2xl font-bold text-white">${(studio.valuation / 1000000).toFixed(1)}M</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.5% vs last month</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 p-6 rounded-[32px]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Total Revenue</p>
              <h3 className="text-2xl font-bold text-white">${(studio.money / 1000000).toFixed(1)}M</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>+8.2% vs last month</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 p-6 rounded-[32px]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Profit Margin</p>
              <h3 className="text-2xl font-bold text-white">24.5%</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
            <ArrowDownRight className="w-4 h-4" />
            <span>-2.1% vs last month</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px]">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Monthly Profit Growth
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#6366f1" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px]">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <PieChart className="w-5 h-5 text-emerald-400" />
            Revenue by Project
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="theatrical" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                <Line type="monotone" dataKey="streaming" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              Theatrical
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              Streaming
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
