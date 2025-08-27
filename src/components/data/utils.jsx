export const norm = v => String(v ?? '').trim();

export const toNumber = v => {
    if (typeof v === 'number') return v;
    const s = String(v ?? '').trim();
    const standardized = s.includes(',') && !s.includes('.') ? s.replace(',', '.') : s;
    const n = Number(standardized);
    return Number.isFinite(n) ? n : NaN;
};

export const rowsOf = raw => {
    if (Array.isArray(raw?.values)) return raw.values;
    if (Array.isArray(raw)) return raw;
    return [];
};

export const resolveFieldKey = (sample, cfgKey, fallbacks = []) => {
    const candidates = [];
    if (cfgKey) {
        candidates.push(cfgKey);
        if (typeof cfgKey === 'string') {
            const alt = cfgKey === cfgKey.toLowerCase() ? cfgKey.toUpperCase() : cfgKey.toLowerCase();
            if (alt !== cfgKey) candidates.push(alt);
        }
    }
    fallbacks.forEach(f => {
        if (!candidates.includes(f)) candidates.push(f);
        if (typeof f === 'string') {
            const alt = f === f.toLowerCase() ? f.toUpperCase() : f.toLowerCase();
            if (!candidates.includes(alt)) candidates.push(alt);
        }
    });
    for (const k of candidates) {
        if (sample && Object.prototype.hasOwnProperty.call(sample, k)) return k;
    }
    return cfgKey || fallbacks[0] || '';
};
