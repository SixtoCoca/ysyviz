import { useMemo } from 'react';

const norm = (s) => String(s ?? '').trim();
const toNumber = (v) => {
    if (typeof v === 'number') return v;
    const s = String(v ?? '').trim();
    const standardized = s.includes(',') && !s.includes('.') ? s.replace(',', '.') : s;
    return Number(standardized);
};

export const useChartData = (rawData, chartType, config) => {
    return useMemo(() => {
        if (!rawData) return null;

        if (rawData.nodes && rawData.links) {
            return { nodes: rawData.nodes, links: rawData.links };
        }

        if (rawData.matrix && rawData.labels) {
            return { matrix: rawData.matrix, labels: rawData.labels };
        }

        if (chartType === 'sankey') {
            const sCol = config?.field_source || '';
            const tCol = config?.field_target || '';
            const vCol = config?.field_value || '';
            if (!Array.isArray(rawData.values) || !sCol || !tCol || !vCol) return null;

            const rows = rawData.values
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

        if (chartType === 'chord') {
            if (!Array.isArray(rawData.values) || rawData.values.length === 0) return null;
            const first = rawData.values.find(r => r && typeof r === 'object') || {};
            const keys = Object.keys(first).filter(k => k !== '__rowNum__');
            if (keys.length < 2) return null;

            const labelKey = keys.find(k => k === '' || k.toLowerCase() === 'label' || k.toLowerCase() === 'name') || keys[0];
            const labels = keys.filter(k => k !== labelKey).map(norm);
            const n = labels.length;
            if (n === 0) return null;

            const rowNames = Array.from(new Set(rawData.values.map(r => norm(r[labelKey])))).filter(Boolean).slice(0, n);
            const rowIndex = new Map(rowNames.map((name, i) => [name, i]));
            const matrix = Array.from({ length: n }, () => Array(n).fill(0));

            for (const row of rawData.values) {
                const i = rowIndex.get(norm(row[labelKey]));
                if (i === undefined) continue;
                for (let j = 0; j < n; j++) {
                    const v = toNumber(row[labels[j]]);
                    if (Number.isFinite(v)) matrix[i][j] = v;
                }
            }

            return { matrix, labels };
        }

        if (chartType === 'violin') {
            if (!Array.isArray(rawData.values)) return null;

            const looksNormalized = rawData.values.some(r => r && Object.prototype.hasOwnProperty.call(r, 'x') && Object.prototype.hasOwnProperty.call(r, 'y'));
            if (looksNormalized) {
                const values = rawData.values
                    .map(r => ({ x: norm(r.x), y: toNumber(r.y) }))
                    .filter(d => d.x !== '' && Number.isFinite(d.y));
                if (values.length === 0) return null;
                return { values, xAxisLabel: config?.field_x || 'x', yAxisLabel: config?.field_y || 'y', rLabel: '', labelLabel: '' };
            }

            const xCol = config?.field_x || '';
            const yCol = config?.field_y || '';
            if (!xCol || !yCol) return null;

            const values = rawData.values
                .map(r => ({ x: norm(r[xCol]), y: toNumber(r[yCol]) }))
                .filter(d => d.x !== '' && Number.isFinite(d.y));

            if (values.length === 0) return null;

            return { values, xAxisLabel: xCol, yAxisLabel: yCol, rLabel: '', labelLabel: '' };
        }

        if (!Array.isArray(rawData.values)) return null;

        const { color, title, ...mappings } = config || {};
        const mappedFields = Object.entries(mappings)
            .filter(([k, v]) => k.startsWith('field_') && v)
            .map(([k, v]) => [k.replace('field_', ''), v]);

        const values = rawData.values.map(row => {
            const newRow = {};
            mappedFields.forEach(([key, col]) => {
                newRow[key] = row[col];
            });
            return newRow;
        });

        const xAxisLabel = mappings.field_x || '';
        const yAxisLabel = mappings.field_y || '';
        const rLabel = mappings.field_r || '';
        const labelLabel = mappings.field_label || '';

        return { values, xAxisLabel, yAxisLabel, rLabel, labelLabel };
    }, [rawData, chartType, config]);
};

export default useChartData;
