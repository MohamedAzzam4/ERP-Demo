// Arabic formatting utilities

export const fmtNum = (val) => {
  if (val == null) return '—';
  return new Intl.NumberFormat('ar-EG').format(val);
};

export const fmtCurrency = (val) => {
  if (val == null) return '—';
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(val);
};

export const fmtDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
};

export const fmtPercent = (val) => {
  if (val == null) return '—';
  return new Intl.NumberFormat('ar-EG', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(val / 100);
};
