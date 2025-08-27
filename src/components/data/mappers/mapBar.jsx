import { norm, toNumber } from '../utils';

export const mapBar = (raw, cfg) => {
    const rows = Array.isArray(raw?.values) ? raw.values : [];
    const cKey = cfg?.field_category || '';
    const vKey = cfg?.field_value || '';
    if (!cKey || !vKey) return null;

    const values = rows
        .map(r => ({ key: norm(r?.[cKey]), value: toNumber(r?.[vKey]) }))
        .filter(d => d.key !== '' && Number.isFinite(d.value));

    return { values, columns: [cKey, vKey] };
};
