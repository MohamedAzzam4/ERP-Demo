import useStore from '../store/useStore';
import { fmtNum, fmtCurrency, fmtPercent } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Package, DollarSign, AlertTriangle, TrendingUp, Factory, Warehouse } from 'lucide-react';

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

export default function Dashboard() {
  const sales = useStore(s => s.sales);
  const inventory = useStore(s => s.inventory);
  const spinning = useStore(s => s.spinning);
  const twisting = useStore(s => s.twisting);
  const complaints = useStore(s => s.complaints);
  const monthlyProduction = useStore(s => s.monthlyProduction);
  const salesByCustomer = useStore(s => s.salesByCustomer);
  const setActiveTab = useStore(s => s.setActiveTab);

  // KPI calculations
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalWeightSold = sales.reduce((sum, s) => sum + s.weightKg, 0);
  const totalInventory = inventory.filter(i => !i.isReturn).reduce((sum, i) => sum + i.weightKg, 0);
  const totalReturns = inventory.filter(i => i.isReturn).reduce((sum, i) => sum + i.returnWeightKg, 0);
  const avgSpinningWaste = spinning.length > 0
    ? spinning.reduce((sum, s) => sum + s.agreedWastePercent, 0) / spinning.length * 100
    : 0;
  const avgTwistingWaste = twisting.length > 0
    ? twisting.reduce((sum, t) => sum + t.actualWastePercent, 0) / twisting.length
    : 0;
  const totalSpinningWeight = spinning.reduce((sum, s) => sum + s.producedLotsWeight, 0);
  const totalTwistingWeight = twisting.reduce((sum, t) => sum + t.receivedWeight, 0);
  const complaintRate = sales.length > 0
    ? (complaints.length / sales.length * 100)
    : 0;

  const kpis = [
    { label: 'إجمالي المبيعات', value: fmtCurrency(totalSales), icon: DollarSign, color: 'bg-blue-600', onClick: () => setActiveTab('sales') },
    { label: 'مستوى المخزون', value: fmtNum(totalInventory) + ' كجم', icon: Warehouse, color: 'bg-green-600', onClick: () => setActiveTab('inventory') },
    { label: 'نسبة عادم الغزل', value: fmtPercent(avgSpinningWaste), icon: TrendingUp, color: 'bg-amber-600', onClick: () => setActiveTab('spinning') },
    { label: 'نسبة عادم الزوى', value: fmtPercent(avgTwistingWaste), icon: TrendingUp, color: 'bg-orange-600', onClick: () => setActiveTab('twisting') },
    { label: 'إجمالي الإنتاج', value: fmtNum(totalSpinningWeight + totalTwistingWeight) + ' كجم', icon: Factory, color: 'bg-purple-600', onClick: null },
    { label: 'الشكاوى', value: `${complaints.length} (${fmtPercent(complaintRate)})`, icon: AlertTriangle, color: 'bg-red-600', onClick: () => setActiveTab('complaints') },
  ];

  // Production summary by factory
  const spinningByCompany = {};
  spinning.forEach(s => {
    if (!spinningByCompany[s.spinningCompany]) spinningByCompany[s.spinningCompany] = 0;
    spinningByCompany[s.spinningCompany] += s.producedLotsWeight;
  });
  const productionByFactory = Object.entries(spinningByCompany).map(([name, weight]) => ({ name, weight }));

  return (
    <div className="space-y-6">
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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByCustomer}
                dataKey="totalSales"
                nameKey="customer"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ customer, percent }) => `${customer.substring(0, 12)}... ${(percent * 100).toFixed(0)}%`}
              >
                {salesByCustomer.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => fmtCurrency(val)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Production by Factory */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">الإنتاج حسب مصنع الغزل</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={productionByFactory} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 13 }} width={120} />
            <Tooltip formatter={(val) => fmtNum(val) + ' كجم'} />
            <Bar dataKey="weight" name="الوزن (كجم)" fill="#8b5cf6" />
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
              {sales.slice(0, 10).map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-3">{s.customer}</td>
                  <td className="p-3">{s.date}</td>
                  <td className="p-3">{fmtNum(s.weightKg)}</td>
                  <td className="p-3">{fmtCurrency(s.pricePerTon)}</td>
                  <td className="p-3 font-semibold">{fmtCurrency(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
