import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import { fmtNum, fmtCurrency, fmtPercent } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList,
} from 'recharts';
import { DollarSign, AlertTriangle, TrendingUp, Factory, Warehouse } from 'lucide-react';

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const sales = useStore(s => s.sales);
  const inventory = useStore(s => s.inventory);
  const spinning = useStore(s => s.spinning);
  const twisting = useStore(s => s.twisting);
  const complaints = useStore(s => s.complaints);
  const setActiveTab = useStore(s => s.setActiveTab);

  // Filters State
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Helper to check if a date string matches the active year and month filters
  const filterRecordByDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return false;
    const parts = dateStr.split('-');
    if (parts.length < 2) return false;
    const y = parts[0];
    const m = parts[1];
    const yearMatch = selectedYear === 'all' || y === selectedYear;
    const monthMatch = selectedMonth === 'all' || parseInt(m, 10) === parseInt(selectedMonth, 10);
    return yearMatch && monthMatch;
  };

  // Filtered lists based on active filters
  const salesFiltered = useMemo(() => sales.filter(s => filterRecordByDate(s.date)), [sales, selectedYear, selectedMonth]);
  const inventoryFiltered = useMemo(() => inventory.filter(i => filterRecordByDate(i.storageDate)), [inventory, selectedYear, selectedMonth]);
  const spinningFiltered = useMemo(() => spinning.filter(s => filterRecordByDate(s.yarnTransferDate || s.rawTransferDate)), [spinning, selectedYear, selectedMonth]);
  const twistingFiltered = useMemo(() => twisting.filter(t => filterRecordByDate(t.twistingReceiptDate)), [twisting, selectedYear, selectedMonth]);
  const complaintsFiltered = useMemo(() => complaints.filter(c => filterRecordByDate(c.complaintDate)), [complaints, selectedYear, selectedMonth]);

  // Derived KPI calculations based on filtered state
  const totalSales = salesFiltered.reduce((sum, s) => sum + s.total, 0);
  const totalWeightSold = salesFiltered.reduce((sum, s) => sum + s.weightKg, 0);
  const totalInventory = inventoryFiltered.filter(i => !i.isReturn).reduce((sum, i) => sum + i.weightKg, 0);
  const totalReturns = inventoryFiltered.filter(i => i.isReturn).reduce((sum, i) => sum + i.returnWeightKg, 0);
  const avgSpinningWaste = spinningFiltered.length > 0
    ? spinningFiltered.reduce((sum, s) => sum + s.agreedWastePercent, 0) / spinningFiltered.length * 100
    : 0;
  const avgTwistingWaste = twistingFiltered.length > 0
    ? twistingFiltered.reduce((sum, t) => sum + t.actualWastePercent, 0) / twistingFiltered.length
    : 0;
  const totalSpinningWeight = spinningFiltered.reduce((sum, s) => sum + s.producedLotsWeight, 0);
  const totalTwistingWeight = twistingFiltered.reduce((sum, t) => sum + t.receivedWeight, 0);
  const complaintRate = salesFiltered.length > 0
    ? (complaintsFiltered.length / salesFiltered.length * 100)
    : 0;

  const kpis = [
    { label: 'إجمالي المبيعات', value: fmtCurrency(totalSales), icon: DollarSign, color: 'bg-blue-600', onClick: () => setActiveTab('sales') },
    { label: 'مستوى المخزون', value: fmtNum(totalInventory) + ' كجم', icon: Warehouse, color: 'bg-green-600', onClick: () => setActiveTab('inventory') },
    { label: 'نسبة عادم الغزل', value: fmtPercent(avgSpinningWaste), icon: TrendingUp, color: 'bg-amber-600', onClick: () => setActiveTab('spinning') },
    { label: 'نسبة عادم الزوى', value: fmtPercent(avgTwistingWaste), icon: TrendingUp, color: 'bg-orange-600', onClick: () => setActiveTab('twisting') },
    { label: 'إجمالي الإنتاج', value: fmtNum(totalSpinningWeight + totalTwistingWeight) + ' كجم', icon: Factory, color: 'bg-purple-600', onClick: null },
    { label: 'الشكاوى', value: `${complaintsFiltered.length} (${fmtPercent(complaintRate)})`, icon: AlertTriangle, color: 'bg-red-600', onClick: () => setActiveTab('complaints') },
  ];

  // Derived Monthly Production data for charts (grouped by month names)
  const monthlyProduction = useMemo(() => {
    const monthsData = monthNames.map(name => ({ month: name, spinning: 0, twisting: 0 }));
    spinningFiltered.forEach(s => {
      const date = s.yarnTransferDate || s.rawTransferDate;
      if (date) {
        const m = parseInt(date.split('-')[1], 10);
        if (m >= 1 && m <= 12) {
          monthsData[m - 1].spinning += s.producedLotsWeight || 0;
        }
      }
    });
    twistingFiltered.forEach(t => {
      const date = t.twistingReceiptDate;
      if (date) {
        const m = parseInt(date.split('-')[1], 10);
        if (m >= 1 && m <= 12) {
          monthsData[m - 1].twisting += t.receivedWeight || 0;
        }
      }
    });
    return monthsData;
  }, [spinningFiltered, twistingFiltered]);

  // Derived Sales by Customer data for charts
  const salesByCustomer = useMemo(() => {
    const map = {};
    salesFiltered.forEach(s => {
      if (!map[s.customer]) {
        map[s.customer] = { customer: s.customer, totalSales: 0, totalWeight: 0 };
      }
      map[s.customer].totalSales += s.total || 0;
      map[s.customer].totalWeight += s.weightKg || 0;
    });
    return Object.values(map);
  }, [salesFiltered]);

  // Production summary by factory
  const productionByFactory = useMemo(() => {
    const spinningByCompany = {};
    spinningFiltered.forEach(s => {
      if (!spinningByCompany[s.spinningCompany]) spinningByCompany[s.spinningCompany] = 0;
      spinningByCompany[s.spinningCompany] += s.producedLotsWeight || 0;
    });
    return Object.entries(spinningByCompany).map(([name, weight]) => ({ name, weight }));
  }, [spinningFiltered]);


  return (
    <div className="space-y-6">
      {/* Date Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="text-gray-800 font-bold">تصفية لوحة التحكم</div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">السنة:</span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="all">الكل</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">الشهر:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="all">الكل</option>
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx + 1}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`rounded-xl p-5 text-white ${kpi.color} ${kpi.onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
            onClick={kpi.onClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
              <kpi.icon className="w-10 h-10 opacity-60" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Production Chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">الإنتاج الشهري (كجم)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyProduction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="spinning" name="غزل" fill="#2563eb" />
              <Bar dataKey="twisting" name="زوى" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Customer */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">المبيعات حسب العميل</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={salesByCustomer}
                dataKey="totalSales"
                nameKey="customer"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {salesByCustomer.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => fmtCurrency(val)} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Production by Factory */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">الإنتاج حسب مصنع الغزل</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={productionByFactory} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={120} 
              tick={{ fontSize: 13, fill: '#4b5563', textAnchor: 'start', dx: -10 }} 
            />
            <Tooltip formatter={(val) => fmtNum(val) + ' كجم'} />
            <Bar dataKey="weight" name="الوزن (كجم)" fill="#8b5cf6" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص المبيعات الأخيرة</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="p-3 text-start">العميل</th>
                <th className="p-3 text-start">التاريخ</th>
                <th className="p-3 text-start">الوزن (كجم)</th>
                <th className="p-3 text-start">سعر الطن</th>
                <th className="p-3 text-start">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {salesFiltered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    لا توجد مبيعات مطابقة للفلتر المحدد
                  </td>
                </tr>
              ) : (
                salesFiltered.slice(0, 10).map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-3">{s.customer}</td>
                    <td className="p-3">{s.date}</td>
                    <td className="p-3">{fmtNum(s.weightKg)}</td>
                    <td className="p-3">{fmtCurrency(s.pricePerTon)}</td>
                    <td className="p-3 font-semibold">{fmtCurrency(s.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
