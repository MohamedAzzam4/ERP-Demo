# Workbook Analysis: متابعة انتاج وبيع خيوط الغزل

## Overview

This workbook tracks the complete business cycle of a yarn manufacturing company — from raw cotton intake through spinning, twisting, warehousing, and sales, with quality control and complaint handling.

## Discovered Sheets (7 total)

### 1. خام (Raw Materials)
**Purpose**: Track raw cotton shipments — intake, quality analysis, and dispatch to factories.

**Structure**: Single-record template with:
- **Metadata section** (rows 1-10): One shipment record
  - نوع الخام (Raw Type): قطن سودان
  - المصدر (Source): السودان
  - رسالة (Shipment/Message ID): 20031
  - عدد بال (Bale Count): 1500
  - وزن قائم (Gross Weight): 300,000
  - وزن صافى (Net Weight): 290,500
  - مكان التخزين (Storage Location): شونة 31 بالسكندرية
  - تاريخ التخزين بالشونة (Storage Date): 2026-02-01

- **Cotton analysis table** (rows 11-17): Per-bale quality testing
  - Columns: serial no, Export Lot, bal maker, bal no, note, sci, mic, mat i, lenth (uhml mm, ufi.i%, sfi%), strenth (str.g/tex, elg%), color (rd, b, color grad), trash (cnt, aria%), Neps/gram

- **Outgoing section** (rows 21-30): Cotton dispatch
  - تاريخ الخروج (Exit Date), جهة خروجها (Destination), الغرض (Purpose), عدد البال الخارج (Bales Out), وزن البال الخارج (Weight Out), الرسالة (Message ID), عدد باقى الرسالة (Remaining Bales), وزن باقى الرسالة (Remaining Weight)

**Normalized keys for CRUD**:
| Arabic Header | Internal Key | Type |
|---|---|---|
| نوع الخام | rawType | string |
| المصدر | source | string |
| رسالة | messageId | number |
| عدد بال | baleCount | number |
| وزن قائم | grossWeight | number |
| وزن صافى | netWeight | number |
| مكان التخزين | storageLocation | string |
| تاريخ التخزين بالشونة | storageDate | date |
| تاريخ الخروج | exitDate | date |
| جهة خروجها | destination | string |
| الغرض | purpose | string |
| عدد البال الخارج | balesOut | number |
| وزن البال الخارج | weightOut | number |
| عدد باقى الرسالة | remainingBales | number |
| وزن باقى الرسالة | remainingWeight | number |

### 2. مصنع الفرد (Spinning Factory)
**Purpose**: Track individual yarn (فرد) production at spinning factories.

**Structure**: Single production order record with:
- **Production metadata**: Company, yarn number, twist specs, raw material info
- **Input**: Cotton bales transferred (120 bales, 24,000 kg from shipment 20031)
- **Waste**: Agreed waste % (15%), expected output (20,400 kg)
- **Output**: Produced lots (184: 10,250 kg, 185: 10,150 kg)
- **Cost**: Processing cost per ton (40,000), expenses per ton (1,000)
- **Transfer**: Date, lot, destination factory
- **Quality analysis**: Ne, CV, Breaking Load, RKM, Elongation, T/m, Twist Factor, U%, CV%, Thin/Thick/Neps per 1000m, Hairness

**Normalized keys for CRUD**:
| Arabic Header | Internal Key | Type |
|---|---|---|
| الشركة المنتجة للفرد | spinningCompany | string |
| نمرة الخيط الفرد | yarnNumber | number |
| البرمات المطلوبة للمتر | twistsPerMeter | number |
| البرمات المطلوبة للبوصة | twistsPerInch | number |
| معامل البرم | twistFactor | number |
| تاريخ نقل الخام للمصنع | rawTransferDate | date |
| رسالة القطن | cottonMessageId | number |
| عدد البال المنقول | balesTransferred | number |
| وزن البال المنقول | weightTransferred | number |
| نسبة العادم المتفق عليها | agreedWastePercent | number |
| وزن الخيط المتوقع استلامه | expectedYarnWeight | number |
| لوطات الخيوط المنتجة | producedLots | string |
| وزن اللوطات المنتجة | producedLotsWeight | number |
| سعر التشغيل للطن | processingCostPerTon | number |
| مصروفات الطن | expensesPerTon | number |
| تاريخ نقل الخيط من المصنع | yarnTransferDate | date |
| اللوط المستلم | receivedLot | number |
| جهة نقل اللوط المستلم | lotDestination | string |

### 3. مصنع الزوى (Twisting/Plying Factory)
**Purpose**: Track plied/twisted yarn production at twisting factories.

**Structure**: Single production order record with:
- **Input**: Spun yarn from spinning factory (5,240 kg from lot 184)
- **Waste**: Expected 2%, Actual 1.01%
- **Output**: Received weight 5,187 kg
- **Cost**: Twisting cost per ton (10,000), expenses per ton (500), total cost (544,635)
- **Destination**: مصنع احمد فتحى
- **Quality analysis**: Same metrics as spinning + Twist Factor, U%, CV%

**Normalized keys for CRUD**:
| Arabic Header | Internal Key | Type |
|---|---|---|
| الخيط | yarnNumber | number |
| لوط تشغيل الفرد | spinningLot | number |
| رسالة قطن | cottonMessageId | number |
| مصنع انتاج الفرد | spinningFactory | string |
| مصنع الزوى | twistingFactory | string |
| تاريخ الاستلام للفرد | spinningReceiptDate | date |
| وزن الخيط الفرد | spinningYarnWeight | number |
| نسبة العادم المتوقعة | expectedWastePercent | number |
| البرمات المطلوبة للمتر | twistsPerMeter | number |
| البرمات المطلوبة للبوصة | twistsPerInch | number |
| معامل البرم | twistFactor | number |
| وزن الخيط المستلم | receivedWeight | number |
| نسبة العادم الفعلية | actualWastePercent | number |
| تاريخ الاستلام للزوى | twistingReceiptDate | date |
| وجهة المستلم | recipient | string |
| سعر زوى الطن | twistingCostPerTon | number |
| مصروفات الطن | expensesPerTon | number |
| اجمالى تكلفة | totalCost | number |

### 4. مخزن الخيوط (Yarn Warehouse/Inventory)
**Purpose**: Track finished yarn inventory and returns.

**Structure**:
- **Inventory record**: Warehouse name, date, yarn type, lot, message ID, company, weight
- **Quality analysis**: Standard yarn quality metrics
- **Returns section** (مرتجع): Date, yarn, lot, message ID, company, weight, analysis, rejection reason

**Normalized keys for CRUD**:
| Arabic Header | Internal Key | Type |
|---|---|---|
| اسم المخزن | warehouseName | string |
| تاريخ التخزين | storageDate | date |
| خيط | yarnType | string |
| لوط | lot | number |
| رسالة قطن | cottonMessageId | number |
| شركة منتجة | producingCompany | string |
| كجم | weightKg | number |
| مرتجع - تاريخ | returnDate | date |
| مرتجع - سبب الرفض | rejectionReason | string |

### 5. شكاوى العملاء (Customer Complaints)
**Purpose**: Track customer complaints and resolution.

**Normalized keys for CRUD**:
| Arabic Header | Internal Key | Type |
|---|---|---|
| تاريخ شكوى العميل | complaintDate | date |
| عميل النسيج | customerName | string |
| خيط | yarnType | string |
| لوط | lot | number |
| رسالة قطن | cottonMessageId | number |
| الشركة المنتجة للفرد | spinningCompany | string |
| الشركة المنتجة للزوى | twistingCompany | string |
| كجم | weightKg | number |
| الشكوى سبب الرفض | complaintReason | string |
| التحقق من الشكوى وحل المشكلة | resolution | string |

### 6. المبيعات (Sales)
**Purpose**: Track yarn sales to customers.

**Normalized keys for CRUD**:
| Arabic Header | Internal Key | Type |
|---|---|---|
| العميل | customer | string |
| التاريخ | date | date |
| كجم | weightKg | number |
| لوط التشغيل | operatingLot | number |
| رسالة القطن | cottonMessageId | number |
| الشركة المنتجة للفرد | spinningCompany | string |
| الشركة المنتجة للزوى | twistingCompany | string |
| المخزن | warehouse | string |
| سعر الطن | pricePerTon | number |
| اجمالى | total | number |
| ملاحظات | notes | string |

### 7. مستوى الجودة (Quality Level)
**Purpose**: Compare actual yarn quality against quality level benchmarks.

**Structure**: Single quality assessment record with:
- Actual analysis results
- Achieved level
- Results at achieved level, higher level, lower level
- Standard metrics: Ne, CV, Breaking Load, RKM, Elongation, T/m, Twist Factor, U%, CV%, Thin/Thick/Neps, Hairness

**This is a reference/analysis sheet, NOT a standalone CRUD module.** Quality data is embedded within production and warehouse records.

---

## Relationships & Workflow

```
خام (Raw Cotton)
  → رسالة (Message ID) links to all downstream sheets
  → مصنع الفرد (Spinning): Cotton sent to spinning factory
    → مصنع الزوى (Twisting): Spun yarn sent to twisting factory
      → مخزن الخيوط (Warehouse): Twisted yarn stored
        → المبيعات (Sales): Yarn sold to customers
        → شكاوى العملاء (Complaints): Customer complaints about sold yarn
  → مستوى الجودة (Quality): Benchmarks for quality assessment
```

**Key relationship**: `رسالة قطن` (Cotton Message ID) is the common thread linking all entities in a production cycle.

---

## Module Expansion Justifications

### Required Modules (from task spec):
1. **خام (Raw Materials)** — Direct workbook sheet
2. **مصنع الزوى (Twisting Factory)** — Direct workbook sheet
3. **شكاوى العملاء (Customer Complaints)** — Direct workbook sheet

### Additional Modules (justified by workbook evidence):
4. **مصنع الفرد (Spinning Factory)** — Critical intermediate step in production chain. Without it, the workflow is incomplete: Raw → ??? → Twisting. The workbook explicitly tracks spinning as a separate manufacturing stage with its own factory, costs, and quality metrics.

5. **مخزن الخيوط (Yarn Warehouse/Inventory)** — Essential for business owners to understand inventory levels. The dashboard requires "Inventory Levels" as a KPI. The workbook has a dedicated sheet with inventory records AND returns tracking.

6. **المبيعات (Sales)** — Essential for business owners. The dashboard requires "Total Sales" as a KPI. The workbook has a dedicated Sales sheet with pricing and totals.

### NOT included as separate CRUD modules:
- **مستوى الجودة (Quality Level)** — This is a reference/analysis sheet. Quality metrics are already embedded within the Spinning, Twisting, and Warehouse records. Creating a separate CRUD module would duplicate data and add no operational value.

---

## Synthetic Data Assumptions

The workbook contains only ONE complete production cycle (message 20031). For a convincing demo:

1. **Raw Materials (خام)**: Generate ~30 shipment records with varied cotton sources (Sudan, Egypt, Greece), different message IDs, varied bale counts and weights.

2. **Spinning (مصنع الفرد)**: Generate ~30 production orders across different spinning companies (مصر ايران, النيل للغزل, الدلتا), varied yarn numbers (16, 20, 24, 30, 40), with realistic waste percentages (12-18%).

3. **Twisting (مصنع الزوى)**: Generate ~30 twisting orders linked to spinning output, across different twisting factories, with realistic waste (1-3%).

4. **Warehouse (مخزن الخيوط)**: Generate ~30 inventory records with some returns.

5. **Customer Complaints (شكاوى العملاء)**: Generate ~15 complaint records with varied reasons and resolution statuses.

6. **Sales (المبيعات)**: Generate ~40 sales records across different customers, with varied pricing.

### Data consistency rules:
- Message IDs link raw materials through the entire chain
- Lot numbers are sequential within a message
- Weights decrease through the chain (raw → spinning → twisting) due to waste
- Prices are realistic for the Egyptian textile market
- Dates follow chronological order through the chain

---

## KPI Derivations

| KPI | Derivation |
|---|---|
| Total Sales | Sum of all sales totals (weightKg × pricePerTon / 1000) |
| Inventory Levels | Current warehouse stock (weightKg in) minus dispatched minus returns |
| Waste Ratios | actualWastePercent from twisting; agreedWastePercent from spinning |
| Production Summary | Total weight produced by spinning + twisting factories |
| Average Quality | Mean RKM, Breaking Load across quality analyses |
| Revenue by Customer | Group sales by customer, sum totals |
| Production by Factory | Group output by factory, sum weights |
| Complaint Rate | Complaints count / Sales count × 100 |
