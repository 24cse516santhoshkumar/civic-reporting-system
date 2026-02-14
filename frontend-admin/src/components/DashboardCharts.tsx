import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface DashboardChartsProps {
    stats: any;
}

const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444']; // Green, Yellow, Blue, Red

const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
    const pieData = [
        { name: 'Resolved', value: stats.resolved || 0 },
        // { name: 'In Progress', value: stats.inProgress || 0 }, // Using inProgress from API
        { name: 'Open', value: stats.open || 0 },
        // Ideally we should have rejected count too, but fit with current available data
    ];

    // Add In Progress if available
    if (stats.inProgress) {
        pieData.push({ name: 'In Progress', value: stats.inProgress });
    }

    // Mock Ward Data (or use real data if available in stats.wardPerformance)
    const wardData = stats.wardPerformance ? Object.keys(stats.wardPerformance).map(key => ({
        name: key,
        uv: stats.wardPerformance[key]
    })) : [
        { name: 'Ward 1', uv: 40 },
        { name: 'Ward 2', uv: 30 },
        { name: 'Ward 3', uv: 20 },
        { name: 'Ward 4', uv: 27 },
        { name: 'Ward 5', uv: 18 },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Reports Distribution */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-lg"
            >
                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Report Status Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Ward Performance */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-lg"
            >
                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Ward Performance Score</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={wardData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }}
                            />
                            <Bar dataKey="uv" fill="url(#colorUv)" radius={[4, 4, 0, 0]} >
                                {
                                    wardData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#3B82F6" : "#8B5CF6"} />
                                    ))
                                }
                            </Bar>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardCharts;
