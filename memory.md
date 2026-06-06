# Memory File — ERP Demo

## 1. Architecture Summary

```
Excel Workbook (متابعة انتاج وبيع خيوط الغزل.xlsx)
  → Python analysis script (analyze_workbook.py)
  → Mock Data (mockData.js — synthetic records based on workbook schema)
  → Zustand Store (useStore.js — global state for all CRUD entities)
  → UI Components (React + Tailwind + Recharts)
```

## 2. Data Model & Sheet Mapping

| Sheet (Arabic) | Internal Key | CRUD Module | Primary Key |
|---|---|---|---|
| خام | rawMaterials | RawMaterials | messageId |
| مصنع الفرد | spinning | Spinning | id (auto) |
| مصنع الزوى | twisting | Twisting | id (auto) |
| مخزن الخيوط | inventory | Inventory | id (auto) |
| شكاوى العملاء | complaints | Complaints | id (auto) |
| المبيعات | sales | Sales | id (auto) |
| مستوى الجودة | (embedded in quality metrics) | — | — |

### Cross-cutting relationships:
- `cottonMessageId` (رسالة قطن) links all entities in a production cycle
- `lot` (لوط) links spinning → twisting → inventory → sales/complaints
- `spinningCompany` / `twistingCompany` link factories to production records

## 3. Key Decisions

1. **No routing library** — Tab-based navigation via Zustand state
2. **No React Context** — Zustand exclusively for global state
3. **No backend** — All data in-memory via Zustand store with mock data initialization
4. **RTL-first** — HTML lang="ar" dir="rtl", logical Tailwind utilities (ms-, me-, ps-, pe-, text-start, text-end)
5. **Arabic number formatting** — Intl.NumberFormat('ar-EG'), Intl.DateTimeFormat('ar-EG')
6. **Quality Level sheet NOT a separate CRUD** — Quality data embedded in production/inventory records
7. **6 CRUD modules**: Raw Materials, Spinning, Twisting, Inventory, Sales, Complaints
8. **Chart library**: Recharts for dashboard visualizations
9. **Icons**: lucide-react

## 4. KPI Derivations

| KPI | Source | Formula |
|---|---|---|
| إجمالي المبيعات (Total Sales) | sales | Σ (weightKg × pricePerTon / 1000) |
| مستوى المخزون (Inventory Level) | inventory | Σ weightKg in warehouse (non-returned) |
| نسبة العادم (Waste Ratio) | spinning + twisting | avg(agreedWastePercent) for spinning; avg(actualWastePercent) for twisting |
| ملخص الإنتاج (Production Summary) | spinning + twisting | Σ produced weight per factory |
| معدل الشكاوى (Complaint Rate) | complaints / sales | count(complaints) / count(sales) × 100 |
| متوسط الجودة (Avg Quality) | quality metrics in spinning/twisting | avg(RKM) across records |

## 5. Assumptions

1. Single currency: EGP (Egyptian Pound)
2. Weight unit: kg (كجم)
3. Price unit: EGP per ton (سعر الطن)
4. Message ID (رسالة) is the production batch identifier
5. Lot (لوط) is the production lot number within a batch
6. The workbook represents a tracking system, not an accounting system
7. Waste percentage in spinning: typically 12-18%
8. Waste percentage in twisting: typically 1-3%
9. Cotton sources: Sudan, Egypt, Greece, Uzbekistan
10. Spinning companies: مصر ايران, النيل للغزل, الدلتا للغزل
11. Twisting factories: مصطفى ابوقمر, احمد فتحى, السلام للزوى
12. Date range for synthetic data: Jan 2025 – Jun 2026

## 6. Changelog

- [2026-06-06] Initial workbook analysis completed
- [2026-06-06] workbook-analysis.md created
- [2026-06-06] memory.md created
- [2026-06-06] Architecture decided: Vite + React + Tailwind + Zustand + Recharts
- [2026-06-06] 6 CRUD modules defined based on workbook evidence
- [2026-06-06] Quality Level sheet excluded as separate CRUD (reference only)
