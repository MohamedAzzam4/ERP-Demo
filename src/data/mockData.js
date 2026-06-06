// Mock Data — Synthetic records based on workbook analysis
// See workbook-analysis.md for schema and assumptions

const cottonSources = ['السودان', 'مصر', 'اليونان', 'أوزبكستان'];
const rawTypes = ['قطن سودان', 'قطن مصر', 'قطن يونان', 'قطن أوزبك'];
const storageLocations = ['شونة 31 اسكندرية', 'شونة 12 القاهرة', 'شونة 8 المنصورة', 'مخزن 5 دمياط'];
const spinningCompanies = ['مصر ايران', 'النيل للغزل', 'الدلتا للغزل'];
const twistingFactories = ['مصطفى ابوقمر', 'احمد فتحى', 'السلام للزوى'];
const customers = ['مصانع النسيج المتحدة', 'شركة الأمل للنسيج', 'مصنع النساجون', 'مجموعة الرشيد', 'شركة الغزل العربي', 'مصنع الفيوم للنسيج', 'مصانع الدلتا'];
const yarnNumbers = [16, 20, 24, 30, 40];
const warehouses = ['31اسكندرية', '12القاهرة', '8المنصورة', '5دمياط'];
const complaintReasons = ['ضعف المتانة', 'عدم تجانس الخيط', 'شعرات زائدة', 'عيب في البرم', 'لون غير مطابق', 'قطوعات متكررة'];
const resolutions = ['تم استبدال اللوط', 'جارى التحقيق', 'تم المراجعة مع المصنع', 'تم خصم قيمة العيب', 'معلق - بانتظار التحليل'];
const rejectionReasons = ['عدم مطابقة المواصفات', 'جودة غير مقبولة', 'تلف أثناء النقل', 'خطأ في الوزن'];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max, dec = 2) { return parseFloat((Math.random() * (max - min) + min).toFixed(dec)); }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }
function dateStr(y, m, d) { return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }

// ─── RAW MATERIALS ────────────────────────────────────────────────
export const rawMaterials = Array.from({ length: 35 }, (_, i) => {
  const srcIdx = i % cottonSources.length;
  const baleCount = rand(800, 2500);
  const grossWeight = baleCount * rand(190, 210);
  const netWeight = Math.round(grossWeight * randFloat(0.94, 0.98));
  const balesOut = rand(50, Math.min(200, baleCount));
  const weightOut = balesOut * rand(80, 90);
  const month = rand(1, 12);
  const year = rand(2025, 2026);
  return {
    id: i + 1,
    rawType: rawTypes[srcIdx],
    source: cottonSources[srcIdx],
    messageId: 20001 + i,
    baleCount,
    grossWeight,
    netWeight,
    storageLocation: storageLocations[i % storageLocations.length],
    storageDate: dateStr(year, month, rand(1, 28)),
    exitDate: dateStr(year, month < 12 ? month + 1 : 12, rand(1, 28)),
    destination: pick(spinningCompanies),
    purpose: `تصنيع خيط ${pick(yarnNumbers)}`,
    balesOut,
    weightOut,
    remainingBales: baleCount - balesOut,
    remainingWeight: netWeight - weightOut,
  };
});

// ─── SPINNING ─────────────────────────────────────────────────────
export const spinning = Array.from({ length: 35 }, (_, i) => {
  const rm = rawMaterials[i];
  const yarnNum = pick(yarnNumbers);
  const wastePct = randFloat(0.12, 0.18, 2);
  const weightTransferred = rm.balesOut * rand(80, 90);
  const expectedWeight = Math.round(weightTransferred * (1 - wastePct));
  const producedWeight = Math.round(expectedWeight * randFloat(0.92, 1.0));
  const lot = 180 + i;
  const sMonth = parseInt(rm.exitDate.split('-')[1], 10);
  const sYear = parseInt(rm.exitDate.split('-')[0], 10);
  const finMonth = sMonth < 12 ? sMonth + 1 : 12;
  return {
    id: i + 1,
    spinningCompany: rm.destination,
    yarnNumber: yarnNum,
    twistsPerMeter: rand(800, 1000),
    twistsPerInch: randFloat(20, 26, 1),
    twistFactor: randFloat(4.0, 5.5, 1),
    rawTransferDate: rm.exitDate,
    cottonMessageId: rm.messageId,
    balesTransferred: rm.balesOut,
    weightTransferred,
    agreedWastePercent: wastePct,
    expectedYarnWeight: expectedWeight,
    producedLot: lot,
    producedLotsWeight: producedWeight,
    processingCostPerTon: rand(35000, 50000),
    expensesPerTon: rand(800, 1500),
    yarnTransferDate: dateStr(sYear, finMonth, rand(1, 28)),
    receivedLot: lot,
    lotDestination: pick(twistingFactories),
    quality: {
      Ne: randFloat(22, 26, 1),
      CV: randFloat(1.2, 2.5, 1),
      breakingLoad: randFloat(260, 310, 1),
      RKM: randFloat(10, 13, 2),
      elongation: randFloat(6, 9, 2),
      Tm: rand(900, 1000),
      twistFactorQ: randFloat(4, 6, 1),
      UPercent: randFloat(10, 14, 2),
      thinPerKm: rand(5, 25),
      thickPerKm: rand(50, 120),
      nepsPerKm: rand(40, 90),
      hairness: randFloat(4, 6.5, 2),
    },
  };
});

// ─── TWISTING ─────────────────────────────────────────────────────
export const twisting = Array.from({ length: 30 }, (_, i) => {
  const sp = spinning[i];
  const expectedWaste = randFloat(0.01, 0.03, 2);
  const spinningWeight = Math.round(sp.producedLotsWeight * randFloat(0.4, 0.6));
  const actualWaste = randFloat(0.005, 0.025, 4);
  const receivedWeight = Math.round(spinningWeight * (1 - actualWaste));
  const sDate = sp.yarnTransferDate;
  const sMonth = parseInt(sDate.split('-')[1], 10);
  const sYear = parseInt(sDate.split('-')[0], 10);
  const finMonth = sMonth < 12 ? sMonth + 1 : 12;
  const twistingCost = rand(8000, 15000);
  const expPerTon = rand(300, 700);
  return {
    id: i + 1,
    yarnNumber: sp.yarnNumber,
    spinningLot: sp.producedLot,
    cottonMessageId: sp.cottonMessageId,
    spinningFactory: sp.spinningCompany,
    twistingFactory: sp.lotDestination,
    spinningReceiptDate: sDate,
    spinningYarnWeight: spinningWeight,
    expectedWastePercent: expectedWaste,
    twistsPerMeter: rand(350, 500),
    twistsPerInch: randFloat(8, 13, 2),
    twistFactor: randFloat(2.5, 3.5, 2),
    receivedWeight,
    actualWastePercent: actualWaste * 100,
    twistingReceiptDate: dateStr(sYear, finMonth, rand(1, 28)),
    recipient: pick(['مصنع احمد فتحى', 'مخزن الخيوط الرئيسي', 'مصنع النسيج']),
    twistingCostPerTon: twistingCost,
    expensesPerTon: expPerTon,
    totalCost: Math.round((receivedWeight / 1000) * (twistingCost + expPerTon)),
    quality: {
      Ne: `${sp.quality.Ne}\\2`,
      CV: randFloat(1.3, 2.2, 1),
      breakingLoad: randFloat(270, 320, 1),
      RKM: randFloat(10.5, 13.5, 2),
      elongation: randFloat(6.5, 9.5, 2),
      Tm: rand(900, 1000),
      twistFactorQ: randFloat(4, 6, 1),
      UPercent: randFloat(10, 14, 2),
      thinPerKm: rand(8, 20),
      thickPerKm: rand(60, 110),
      nepsPerKm: rand(45, 85),
      hairness: randFloat(4.5, 6.0, 2),
    },
  };
});

// ─── INVENTORY ─────────────────────────────────────────────────────
export const inventory = Array.from({ length: 35 }, (_, i) => {
  const tw = twisting[i % twisting.length];
  const sp = spinning[i % spinning.length];
  const tDate = tw.twistingReceiptDate;
  const tMonth = parseInt(tDate.split('-')[1], 10);
  const tYear = parseInt(tDate.split('-')[0], 10);
  const isReturn = i > 25;
  return {
    id: i + 1,
    warehouseName: warehouses[i % warehouses.length],
    storageDate: tDate,
    yarnType: `${tw.yarnNumber}\\2`,
    lot: sp.producedLot,
    cottonMessageId: sp.cottonMessageId,
    producingCompany: sp.spinningCompany,
    weightKg: isReturn ? 0 : Math.round(tw.receivedWeight * randFloat(0.3, 1.0)),
    isReturn,
    returnDate: isReturn ? dateStr(tYear, tMonth < 12 ? tMonth + 1 : 12, rand(1, 28)) : null,
    returnWeightKg: isReturn ? rand(200, 800) : 0,
    rejectionReason: isReturn ? pick(rejectionReasons) : '',
  };
});

// ─── SALES ─────────────────────────────────────────────────────────
export const sales = Array.from({ length: 45 }, (_, i) => {
  const inv = inventory[i % inventory.length];
  const weightKg = rand(500, 5000);
  const pricePerTon = rand(45000, 85000);
  const tDate = inv.storageDate;
  const tMonth = parseInt(tDate.split('-')[1], 10);
  const tYear = parseInt(tDate.split('-')[0], 10);
  const saleMonth = Math.min(tMonth < 12 ? tMonth + rand(0, 2) : 12, 12);
  return {
    id: i + 1,
    customer: pick(customers),
    date: dateStr(tYear, saleMonth, rand(1, 28)),
    weightKg,
    operatingLot: inv.lot,
    cottonMessageId: inv.cottonMessageId,
    spinningCompany: inv.producingCompany,
    twistingCompany: pick(twistingFactories),
    warehouse: inv.warehouseName,
    pricePerTon,
    total: Math.round((weightKg / 1000) * pricePerTon),
    notes: i % 7 === 0 ? 'توصيل عاجل' : '',
  };
});

// ─── COMPLAINTS ────────────────────────────────────────────────────
export const complaints = Array.from({ length: 15 }, (_, i) => {
  const sale = sales[i * 3];
  const sDate = sale.date;
  const sMonth = parseInt(sDate.split('-')[1], 10);
  const sYear = parseInt(sDate.split('-')[0], 10);
  const compMonth = sMonth < 12 ? sMonth + 1 : 12;
  return {
    id: i + 1,
    complaintDate: dateStr(sYear, compMonth, rand(1, 28)),
    customerName: sale.customer,
    yarnType: `${yarnNumbers[i % yarnNumbers.length]}\\2`,
    lot: sale.operatingLot,
    cottonMessageId: sale.cottonMessageId,
    spinningCompany: sale.spinningCompany,
    twistingCompany: sale.twistingCompany,
    weightKg: rand(100, 1000),
    complaintReason: pick(complaintReasons),
    resolution: pick(resolutions),
  };
});

// ─── MONTHLY PRODUCTION DATA (for charts) ─────────────────────────
export const monthlyProduction = [
  { month: 'يناير', spinning: 42000, twisting: 38000 },
  { month: 'فبراير', spinning: 45000, twisting: 41000 },
  { month: 'مارس', spinning: 48000, twisting: 43500 },
  { month: 'أبريل', spinning: 51000, twisting: 46000 },
  { month: 'مايو', spinning: 47000, twisting: 42500 },
  { month: 'يونيو', spinning: 49000, twisting: 44500 },
  { month: 'يوليو', spinning: 44000, twisting: 40000 },
  { month: 'أغسطس', spinning: 46000, twisting: 42000 },
  { month: 'سبتمبر', spinning: 50000, twisting: 45500 },
  { month: 'أكتوبر', spinning: 52000, twisting: 47000 },
  { month: 'نوفمبر', spinning: 48000, twisting: 43500 },
  { month: 'ديسمبر', spinning: 53000, twisting: 48000 },
];

// ─── SALES BY CUSTOMER (for charts) ───────────────────────────────
export const salesByCustomer = customers.map(c => {
  const custSales = sales.filter(s => s.customer === c);
  return {
    customer: c,
    totalSales: custSales.reduce((sum, s) => sum + s.total, 0),
    totalWeight: custSales.reduce((sum, s) => sum + s.weightKg, 0),
  };
});
