import { norm, toNumber } from '../utils';

export const mapBar = (raw, cfg) => {
    const rows = Array.isArray(raw?.values) ? raw.values : [];
    const cKey = cfg?.field_category || '';
    const vKey = cfg?.field_value || '';
    const sKey = cfg?.field_series || '';
    
    if (!cKey || !vKey) return null;

    if (!sKey) {
        const values = rows
            .map(r => ({ key: norm(r?.[cKey]), value: toNumber(r?.[vKey]) }))
            .filter(d => d.key !== '' && Number.isFinite(d.value));
        return { values, columns: [cKey, vKey] };
    }

    const grouped = {};
    const seriesSet = new Set();
    const categorySet = new Set();

    rows.forEach(r => {
        const category = norm(r?.[cKey]);
        const series = norm(r?.[sKey]);
        const value = toNumber(r?.[vKey]);
        
        if (category && series && Number.isFinite(value)) {
            if (!grouped[category]) grouped[category] = {};
            grouped[category][series] = value;
            seriesSet.add(series);
            categorySet.add(category);
        }
    });

    const categories = Array.from(categorySet);
    const series = Array.from(seriesSet);
    const values = categories.map(category => ({
        key: category,
        values: series.map(s => ({
            series: s,
            value: grouped[category]?.[s] || 0
        }))
    }));

    return { values, series, categories, columns: [cKey, vKey, sKey], hasGrouped: true };
};
