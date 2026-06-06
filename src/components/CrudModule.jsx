import { useState } from 'react';
import useStore from '../store/useStore';
import { fmtNum, fmtCurrency, fmtDate } from '../utils/format';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';

// ─── MODULE CONFIGS ───────────────────────────────────────────────
const moduleConfigs = {
  rawMaterials: {
    title: 'الخام',
    columns: [
      { key: 'rawType', label: 'نوع الخام' },
      { key: 'source', label: 'المصدر' },
      { key: 'messageId', label: 'رسالة' },
      { key: 'baleCount', label: 'عدد بال', num: true },
      { key: 'netWeight', label: 'وزن صافى', num: true },
      { key: 'storageLocation', label: 'مكان التخزين' },
      { key: 'storageDate', label: 'تاريخ التخزين', date: true },
      { key: 'balesOut', label: 'بال خارج', num: true },
      { key: 'remainingBales', label: 'بال متبقي', num: true },
    ],
    fields: [
      { key: 'rawType', label: 'نوع الخام', type: 'select', options: ['قطن سودان', 'قطن مصر', 'قطن يونان', 'قطن أوزبك'] },
      { key: 'source', label: 'المصدر', type: 'select', options: ['السودان', 'مصر', 'اليونان', 'أوزبكستان'] },
      { key: 'messageId', label: 'رسالة', type: 'number' },
      { key: 'baleCount', label: 'عدد بال', type: 'number' },
      { key: 'grossWeight', label: 'وزن قائم', type: 'number' },
      { key: 'netWeight', label: 'وزن صافى', type: 'number' },
      { key: 'storageLocation', label: 'مكان التخزين', type: 'text' },
      { key: 'storageDate', label: 'تاريخ التخزين', type: 'date' },
      { key: 'exitDate', label: 'تاريخ الخروج', type: 'date' },
      { key: 'destination', label: 'جهة الخروج', type: 'text' },
      { key: 'purpose', label: 'الغرض', type: 'text' },
      { key: 'balesOut', label: 'عدد البال الخارج', type: 'number' },
      { key: 'weightOut', label: 'وزن البال الخارج', type: 'number' },
      { key: 'remainingBales', label: 'عدد باقي الرسالة', type: 'number' },
      { key: 'remainingWeight', label: 'وزن باقي الرسالة', type: 'number' },
    ],
    storeKey: 'rawMaterials',
    addFn: 'addRawMaterial',
    updateFn: 'updateRawMaterial',
    deleteFn: 'deleteRawMaterial',
  },
  spinning: {
    title: 'مصنع الفرد',
    columns: [
      { key: 'spinningCompany', label: 'الشركة المنتجة' },
      { key: 'yarnNumber', label: 'نمرة الخيط' },
      { key: 'cottonMessageId', label: 'رسالة قطن' },
      { key: 'balesTransferred', label: 'بال منقول', num: true },
      { key: 'weightTransferred', label: 'وزن منقول', num: true },
      { key: 'agreedWastePercent', label: 'نسبة العادم', num: true, pct: true },
      { key: 'producedLotsWeight', label: 'وزن المنتج', num: true },
      { key: 'processingCostPerTon', label: 'سعر التشغيل/طن', num: true, currency: true },
      { key: 'yarnTransferDate', label: 'تاريخ النقل', date: true },
    ],
    fields: [
      { key: 'spinningCompany', label: 'الشركة المنتجة', type: 'select', options: ['مصر ايران', 'النيل للغزل', 'الدلتا للغزل'] },
      { key: 'yarnNumber', label: 'نمرة الخيط', type: 'number' },
      { key: 'twistsPerMeter', label: 'برمات/متر', type: 'number' },
      { key: 'twistFactor', label: 'معامل البرم', type: 'number' },
      { key: 'rawTransferDate', label: 'تاريخ نقل الخام', type: 'date' },
      { key: 'cottonMessageId', label: 'رسالة القطن', type: 'number' },
      { key: 'balesTransferred', label: 'عدد البال المنقول', type: 'number' },
      { key: 'weightTransferred', label: 'وزن البال المنقول', type: 'number' },
      { key: 'agreedWastePercent', label: 'نسبة العادم', type: 'number', step: '0.01' },
      { key: 'expectedYarnWeight', label: 'الوزن المتوقع', type: 'number' },
      { key: 'producedLot', label: 'لوط المنتج', type: 'number' },
      { key: 'producedLotsWeight', label: 'وزن اللوطات', type: 'number' },
      { key: 'processingCostPerTon', label: 'سعر التشغيل/طن', type: 'number' },
      { key: 'expensesPerTon', label: 'مصروفات/طن', type: 'number' },
      { key: 'yarnTransferDate', label: 'تاريخ نقل الخيط', type: 'date' },
      { key: 'lotDestination', label: 'وجهة اللوط', type: 'text' },
    ],
    storeKey: 'spinning',
    addFn: 'addSpinning',
    updateFn: 'updateSpinning',
    deleteFn: 'deleteSpinning',
  },
  twisting: {
    title: 'مصنع الزوى',
    columns: [
      { key: 'twistingFactory', label: 'مصنع الزوى' },
      { key: 'yarnNumber', label: 'نمرة الخيط' },
      { key: 'cottonMessageId', label: 'رسالة قطن' },
      { key: 'spinningYarnWeight', label: 'وزن الفرد', num: true },
      { key: 'actualWastePercent', label: 'عادم فعلي %', num: true },
      { key: 'receivedWeight', label: 'الوزن المستلم', num: true },
      { key: 'twistingCostPerTon', label: 'سعر الزوى/طن', num: true, currency: true },
      { key: 'totalCost', label: 'إجمالي التكلفة', num: true, currency: true },
      { key: 'twistingReceiptDate', label: 'تاريخ الاستلام', date: true },
    ],
    fields: [
      { key: 'yarnNumber', label: 'نمرة الخيط', type: 'number' },
      { key: 'spinningLot', label: 'لوط تشغيل الفرد', type: 'number' },
      { key: 'cottonMessageId', label: 'رسالة قطن', type: 'number' },
      { key: 'spinningFactory', label: 'مصنع الفرد', type: 'text' },
      { key: 'twistingFactory', label: 'مصنع الزوى', type: 'select', options: ['مصطفى ابوقمر', 'احمد فتحى', 'السلام للزوى'] },
      { key: 'spinningReceiptDate', label: 'تاريخ استلام الفرد', type: 'date' },
      { key: 'spinningYarnWeight', label: 'وزن خيط الفرد', type: 'number' },
      { key: 'expectedWastePercent', label: 'نسبة العادم المتوقعة', type: 'number', step: '0.01' },
      { key: 'twistsPerMeter', label: 'برمات/متر', type: 'number' },
      { key: 'twistFactor', label: 'معامل البرم', type: 'number' },
      { key: 'receivedWeight', label: 'الوزن المستلم', type: 'number' },
      { key: 'actualWastePercent', label: 'نسبة العادم الفعلية', type: 'number', step: '0.01' },
      { key: 'twistingReceiptDate', label: 'تاريخ استلام الزوى', type: 'date' },
      { key: 'recipient', label: 'وجهة المستلم', type: 'text' },
      { key: 'twistingCostPerTon', label: 'سعر الزوى/طن', type: 'number' },
      { key: 'expensesPerTon', label: 'مصروفات/طن', type: 'number' },
      { key: 'totalCost', label: 'إجمالي التكلفة', type: 'number' },
    ],
    storeKey: 'twisting',
    addFn: 'addTwisting',
    updateFn: 'updateTwisting',
    deleteFn: 'deleteTwisting',
  },
  inventory: {
    title: 'مخزن الخيوط',
    columns: [
      { key: 'warehouseName', label: 'المخزن' },
      { key: 'yarnType', label: 'خيط' },
      { key: 'lot', label: 'لوط' },
      { key: 'cottonMessageId', label: 'رسالة قطن' },
      { key: 'producingCompany', label: 'الشركة المنتجة' },
      { key: 'weightKg', label: 'كجم', num: true },
      { key: 'isReturn', label: 'مرتجع', bool: true },
      { key: 'returnWeightKg', label: 'وزن المرتجع', num: true },
    ],
    fields: [
      { key: 'warehouseName', label: 'اسم المخزن', type: 'select', options: ['31اسكندرية', '12القاهرة', '8المنصورة', '5دمياط'] },
      { key: 'storageDate', label: 'تاريخ التخزين', type: 'date' },
      { key: 'yarnType', label: 'نوع الخيط', type: 'text' },
      { key: 'lot', label: 'لوط', type: 'number' },
      { key: 'cottonMessageId', label: 'رسالة قطن', type: 'number' },
      { key: 'producingCompany', label: 'الشركة المنتجة', type: 'text' },
      { key: 'weightKg', label: 'الوزن (كجم)', type: 'number' },
      { key: 'isReturn', label: 'مرتجع', type: 'select', options: ['لا', 'نعم'] },
      { key: 'returnDate', label: 'تاريخ المرتجع', type: 'date' },
      { key: 'returnWeightKg', label: 'وزن المرتجع', type: 'number' },
      { key: 'rejectionReason', label: 'سبب الرفض', type: 'text' },
    ],
    storeKey: 'inventory',
    addFn: 'addInventory',
    updateFn: 'updateInventory',
    deleteFn: 'deleteInventory',
  },
  sales: {
    title: 'المبيعات',
    columns: [
      { key: 'customer', label: 'العميل' },
      { key: 'date', label: 'التاريخ', date: true },
      { key: 'weightKg', label: 'كجم', num: true },
      { key: 'operatingLot', label: 'لوط التشغيل' },
      { key: 'cottonMessageId', label: 'رسالة القطن' },
      { key: 'pricePerTon', label: 'سعر الطن', num: true, currency: true },
      { key: 'total', label: 'الإجمالي', num: true, currency: true },
    ],
    fields: [
      { key: 'customer', label: 'العميل', type: 'text' },
      { key: 'date', label: 'التاريخ', type: 'date' },
      { key: 'weightKg', label: 'الوزن (كجم)', type: 'number' },
      { key: 'operatingLot', label: 'لوط التشغيل', type: 'number' },
      { key: 'cottonMessageId', label: 'رسالة القطن', type: 'number' },
      { key: 'spinningCompany', label: 'الشركة المنتجة للفرد', type: 'text' },
      { key: 'twistingCompany', label: 'الشركة المنتجة للزوى', type: 'text' },
      { key: 'warehouse', label: 'المخزن', type: 'text' },
      { key: 'pricePerTon', label: 'سعر الطن', type: 'number' },
      { key: 'total', label: 'الإجمالي', type: 'number' },
      { key: 'notes', label: 'ملاحظات', type: 'text' },
    ],
    storeKey: 'sales',
    addFn: 'addSale',
    updateFn: 'updateSale',
    deleteFn: 'deleteSale',
  },
  complaints: {
    title: 'شكاوى العملاء',
    columns: [
      { key: 'customerName', label: 'العميل' },
      { key: 'complaintDate', label: 'تاريخ الشكوى', date: true },
      { key: 'yarnType', label: 'خيط' },
      { key: 'lot', label: 'لوط' },
      { key: 'complaintReason', label: 'سبب الشكوى' },
      { key: 'resolution', label: 'الحل' },
    ],
    fields: [
      { key: 'complaintDate', label: 'تاريخ الشكوى', type: 'date' },
      { key: 'customerName', label: 'عميل النسيج', type: 'text' },
      { key: 'yarnType', label: 'نوع الخيط', type: 'text' },
      { key: 'lot', label: 'لوط', type: 'number' },
      { key: 'cottonMessageId', label: 'رسالة قطن', type: 'number' },
      { key: 'spinningCompany', label: 'الشركة المنتجة للفرد', type: 'text' },
      { key: 'twistingCompany', label: 'الشركة المنتجة للزوى', type: 'text' },
      { key: 'weightKg', label: 'الوزن (كجم)', type: 'number' },
      { key: 'complaintReason', label: 'سبب الشكوى/الرفض', type: 'select', options: ['ضعف المتانة', 'عدم تجانس الخيط', 'شعرات زائدة', 'عيب في البرم', 'لون غير مطابق', 'قطوعات متكررة'] },
      { key: 'resolution', label: 'التحقق والحل', type: 'select', options: ['تم استبدال اللوط', 'جارى التحقيق', 'تم المراجعة مع المصنع', 'تم خصم قيمة العيب', 'معلق - بانتظار التحليل'] },
    ],
    storeKey: 'complaints',
    addFn: 'addComplaint',
    updateFn: 'updateComplaint',
    deleteFn: 'deleteComplaint',
  },
};

export default function CrudModule({ moduleKey }) {
  const config = moduleConfigs[moduleKey];
  const data = useStore(s => s[config.storeKey]);
  const addFn = useStore(s => s[config.addFn]);
  const updateFn = useStore(s => s[config.updateFn]);
  const deleteFn = useStore(s => s[config.deleteFn]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  const filtered = data.filter(row =>
    !search || Object.values(row).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const openAdd = () => {
    const init = {};
    config.fields.forEach(f => { init[f.key] = f.type === 'number' ? '' : ''; });
    setForm(init);
    setEditMode(false);
    setEditId(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setForm({ ...row });
    setEditMode(true);
    setEditId(row.id);
    setModalOpen(true);
  };

  const handleSave = () => {
    // Convert number fields
    const processed = { ...form };
    config.fields.forEach(f => {
      if (f.type === 'number' && processed[f.key] !== '' && processed[f.key] !== undefined) {
        processed[f.key] = Number(processed[f.key]);
      }
    });
    if (editMode) {
      updateFn(editId, processed);
    } else {
      addFn(processed);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('هل تريد حذف هذا السجل؟')) {
      deleteFn(id);
    }
  };

  const renderCellValue = (row, col) => {
    const val = row[col.key];
    if (val == null || val === '') return '—';
    if (col.bool) return val ? 'نعم' : 'لا';
    if (col.date) return fmtDate(val);
    if (col.currency) return fmtCurrency(val);
    if (col.num) return fmtNum(val);
    if (col.pct) return fmtNum(val) + '%';
    return val;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800">{config.title}</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ps-9 pe-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-3 text-start font-medium">#</th>
              {config.columns.map(col => (
                <th key={col.key} className="p-3 text-start font-medium">{col.label}</th>
              ))}
              <th className="p-3 text-start font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                <td className="p-3 text-gray-400">{idx + 1}</td>
                {config.columns.map(col => (
                  <td key={col.key} className="p-3">{renderCellValue(row, col)}</td>
                ))}
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(row)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={config.columns.length + 2} className="p-8 text-center text-gray-400">
                  لا توجد بيانات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                {editMode ? 'تعديل' : 'إضافة'} — {config.title}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      value={form[field.key] || ''}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">اختر...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      step={field.step}
                      value={form[field.key] ?? ''}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editMode ? 'تحديث' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
