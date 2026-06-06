import useStore from './store/useStore';
import Dashboard from './components/Dashboard';
import CrudModule from './components/CrudModule';
import {
  LayoutDashboard, Package, Factory, Settings2, Warehouse,
  ShoppingCart, AlertCircle
} from 'lucide-react';

const tabs = [
  { key: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { key: 'rawMaterials', label: 'الخام', icon: Package },
  { key: 'spinning', label: 'مصنع الفرد', icon: Factory },
  { key: 'twisting', label: 'مصنع الزوى', icon: Settings2 },
  { key: 'inventory', label: 'مخزن الخيوط', icon: Warehouse },
  { key: 'sales', label: 'المبيعات', icon: ShoppingCart },
  { key: 'complaints', label: 'الشكاوى', icon: AlertCircle },
];

function App() {
  const activeTab = useStore(s => s.activeTab);
  const setActiveTab = useStore(s => s.setActiveTab);

  const renderContent = () => {
    if (activeTab === 'dashboard') return <Dashboard />;
    return <CrudModule moduleKey={activeTab} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">نظام إدارة غزل الخيوط</h1>
          </div>
          <span className="text-xs text-gray-400">نموذج تجريبي</span>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
