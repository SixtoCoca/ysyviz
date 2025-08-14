import { useMemo } from 'react';

const norm = (s) => String(s ?? '').trim();
const toNumber = (v) => {
    if (typeof v === 'number') return v;
    const s = String(v ?? '').trim();
    const standardized = s.includes(',') && !s.includes('.') ? s.replace(',', '.') : s;
    return Number(standardized);
};

export const useChartData = (data, type, cfg) => {
    return useMemo(() => {
        if (!data) return null;

        if (type === 'sankey') {
            const sCol = cfg?.field_source || '';
            const tCol = cfg?.field_target || '';
            const vCol = cfg?.field_value || '';
            if (!(Array.isArray(data.values) && sCol && tCol && vCol)) return null;

            const rows = data.values
                .map(r => ({ source: norm(r[sCol]), target: norm(r[tCol]), value: toNumber(r[vCol]) }))
                .filter(d => d.source && d.target && Number.isFinite(d.value) && d.value > 0);
            if (rows.length === 0) return null;

            const names = Array.from(new Set(rows.flatMap(d => [d.source, d.target])));
            const index = new Map(names.map((n, i) => [n, i]));
            const pairMap = new Map();
            for (const d of rows) {
                const key = `${d.source}→${d.target}`;
                pairMap.set(key, (pairMap.get(key) || 0) + d.value);
            }
            const links = Array.from(pairMap.entries()).map(([k, val]) => {
                const [s, t] = k.split('→');
                return { source: index.get(s), target: index.get(t), value: val };
            });
            const nodes = names.map(n => ({ name: n }));
            return { nodes, links };
        }

        if (type === 'chord') {
            if (Array.isArray(data.matrix) && Array.isArray(data.labels)) {
                return { matrix: data.matrix, labels: data.labels };
            }
            if (!Array.isArray(data.values) || data.values.length === 0) return null;

            const first = data.values.find(r => r && typeof r === 'object') || {};
            const keys = Object.keys(first).filter(k => k !== '__rowNum__');
            if (keys.length < 2) return null;

            const labelKey = keys.find(k => k === '' || k.toLowerCase() === 'label' || k.toLowerCase() === 'name') || keys[0];
            const labels = keys.filter(k => k !== labelKey).map(norm);
            const n = labels.length;
            if (n === 0) return null;

            const rowIndex = new Map(
                Array.from(new Set(data.values.map(r => norm(r[labelKey]))))
                    .filter(Boolean)
                    .slice(0, n)
                    .map((name, i) => [name, i])
            );
            const matrix = Array.from({ length: n }, () => Array(n).fill(0));

            for (const row of data.values) {
                const i = rowIndex.get(norm(row[labelKey]));
                if (i === undefined) continue;
                for (let j = 0; j < n; j++) {
                    const v = toNumber(row[labels[j]]);
                    if (Number.isFinite(v)) matrix[i][j] = v;
                }
            }
            return { matrix, labels };
        }

        return data;
    }, [data, type, cfg]);
};

export default useChartData;
