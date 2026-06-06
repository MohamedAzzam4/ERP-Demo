import { create } from 'zustand';
import {
  rawMaterials as initialRaw,
  spinning as initialSpinning,
  twisting as initialTwisting,
  inventory as initialInventory,
  sales as initialSales,
  complaints as initialComplaints,
} from '../data/mockData';

const useStore = create((set, get) => ({
  // Navigation
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // ─── RAW MATERIALS ────────────────────────
  rawMaterials: initialRaw,
  addRawMaterial: (item) => set((s) => ({
    rawMaterials: [...s.rawMaterials, { ...item, id: crypto.randomUUID() }]
  })),
  updateRawMaterial: (id, item) => set((s) => ({
    rawMaterials: s.rawMaterials.map(r => r.id === id ? { ...r, ...item } : r)
  })),
  deleteRawMaterial: (id) => set((s) => ({
    rawMaterials: s.rawMaterials.filter(r => r.id !== id)
  })),

  // ─── SPINNING ─────────────────────────────
  spinning: initialSpinning,
  addSpinning: (item) => set((s) => ({
    spinning: [...s.spinning, { ...item, id: crypto.randomUUID() }]
  })),
  updateSpinning: (id, item) => set((s) => ({
    spinning: s.spinning.map(r => r.id === id ? { ...r, ...item } : r)
  })),
  deleteSpinning: (id) => set((s) => ({
    spinning: s.spinning.filter(r => r.id !== id)
  })),

  // ─── TWISTING ─────────────────────────────
  twisting: initialTwisting,
  addTwisting: (item) => set((s) => ({
    twisting: [...s.twisting, { ...item, id: crypto.randomUUID() }]
  })),
  updateTwisting: (id, item) => set((s) => ({
    twisting: s.twisting.map(r => r.id === id ? { ...r, ...item } : r)
  })),
  deleteTwisting: (id) => set((s) => ({
    twisting: s.twisting.filter(r => r.id !== id)
  })),

  // ─── INVENTORY ────────────────────────────
  inventory: initialInventory,
  addInventory: (item) => set((s) => ({
    inventory: [...s.inventory, { ...item, id: crypto.randomUUID() }]
  })),
  updateInventory: (id, item) => set((s) => ({
    inventory: s.inventory.map(r => r.id === id ? { ...r, ...item } : r)
  })),
  deleteInventory: (id) => set((s) => ({
    inventory: s.inventory.filter(r => r.id !== id)
  })),

  // ─── SALES ────────────────────────────────
  sales: initialSales,
  addSale: (item) => set((s) => ({
    sales: [...s.sales, { ...item, id: crypto.randomUUID() }]
  })),
  updateSale: (id, item) => set((s) => ({
    sales: s.sales.map(r => r.id === id ? { ...r, ...item } : r)
  })),
  deleteSale: (id) => set((s) => ({
    sales: s.sales.filter(r => r.id !== id)
  })),

  // ─── COMPLAINTS ───────────────────────────
  complaints: initialComplaints,
  addComplaint: (item) => set((s) => ({
    complaints: [...s.complaints, { ...item, id: crypto.randomUUID() }]
  })),
  updateComplaint: (id, item) => set((s) => ({
    complaints: s.complaints.map(r => r.id === id ? { ...r, ...item } : r)
  })),
  deleteComplaint: (id) => set((s) => ({
    complaints: s.complaints.filter(r => r.id !== id)
  })),

  // ─── CHART DATA (removed static state, derived in component) ───

  // ─── MODAL STATE ──────────────────────────
  modalOpen: false,
  modalMode: 'add',
  modalEntity: null,
  editingItem: null,
  openAddModal: (entity) => set({ modalOpen: true, modalMode: 'add', modalEntity: entity, editingItem: null }),
  openEditModal: (entity, item) => set({ modalOpen: true, modalMode: 'edit', modalEntity: entity, editingItem: item }),
  closeModal: () => set({ modalOpen: false, modalMode: 'add', modalEntity: null, editingItem: null }),
}));

export default useStore;
