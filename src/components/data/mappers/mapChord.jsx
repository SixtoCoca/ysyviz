import { norm, toNumber, rowsOf } from '../utils';

export const mapChord = (raw, cfg) => {
    if (Array.isArray(raw?.matrix) && Array.isArray(raw?.labels) && raw.matrix.length && raw.labels.length) {
        const n = raw.labels.length;
        const matrix = raw.matrix.map(row => row.slice(0, n).map(v => toNumber(v)));
        return { matrix, labels: raw.labels.map(norm) };
    }

    const rows = rowsOf(raw);
    if (!rows.length) return null;

    const sample = rows.find(r => r && typeof r === 'object') || {};
    const keys = Object.keys(sample).filter(k => k !== '__rowNum__');
    if (keys.length < 2) return null;

    let labelKey = keys.find(k => {
        const kLower = String(k).toLowerCase();
        return kLower === 'label' || kLower === 'name';
    }) || keys.find(k => typeof sample[k] === 'string') || keys[0];

    const numericKeys = keys.filter(k => k !== labelKey).filter(k => {
        const vv = rows.map(r => toNumber(r?.[k])).filter(v => v !== null);
        return vv.some(v => Number.isFinite(v));
    });

    if (numericKeys.length < 2) return null;

    const labels = numericKeys.map(norm);
    const n = labels.length;

    const rowNames = Array.from(new Set(rows.map(r => norm(r?.[labelKey])))).filter(Boolean).slice(0, n);
    if (!rowNames.length) return null;

    const rowIndex = new Map(rowNames.map((name, i) => [name, i]));
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (const r of rows) {
        const i = rowIndex.get(norm(r?.[labelKey]));
        if (i === undefined) continue;
        for (let j = 0; j < n; j++) {
            const v = toNumber(r?.[numericKeys[j]]);
            if (Number.isFinite(v)) matrix[i][j] = v;
        }
    }

    const hasAny = matrix.some(row => row.some(v => Number.isFinite(v) && v !== 0));
    if (!hasAny) return null;

    return { matrix, labels };
};
