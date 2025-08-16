import { useMemo } from 'react';

const toNumber = v => {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string') {
        const n = Number(v.replace(',', '.'));
        return Number.isFinite(n) ? n : NaN;
    }
    return NaN;
};

const toString = v => (v == null ? '' : String(v));

const normalizeHeatmapValues = rows => {
    if (!Array.isArray(rows) || rows.length === 0) return { values: [] };
    const keys = Object.keys(rows[0] || {});
    const lower = k => k.toLowerCase().trim();
    const kx = keys.find(k => ['x', 'col', 'column'].includes(lower(k)));
    const ky = keys.find(k => ['y', 'row'].includes(lower(k)));
    const kv = keys.find(k => ['value', 'val', 'v'].includes(lower(k)));
    if (kx && ky && kv) {
        const values = rows
            .map(r => ({ x: toString(r[kx]).trim(), y: toString(r[ky]).trim(), value: toNumber(r[kv]) }))
            .filter(d => d.x !== '' && d.y !== '' && Number.isFinite(d.value));
        return { values };
    }
    const first = keys[0];
    const xLabels = keys.slice(1);
    const values = [];
    for (let i = 0; i < rows.length; i++) {
        const y = toString(rows[i]?.[first]).trim();
        if (y === '') continue;
        for (const xKey of xLabels) {
            const x = toString(xKey).trim();
            const v = toNumber(rows[i]?.[xKey]);
            if (x !== '' && Number.isFinite(v)) values.push({ x, y, value: v });
        }
    }
    return { values };
};

const validateRows = (rows, fields) => {
    const cleaned = [];
    const issues = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i] || {};
        const out = {};
        let ok = true;
        for (const k of Object.keys(fields)) {
            const rules = fields[k];
            let v = row[k];
            if ((v == null || v === '') && rules.required) {
                issues.push({ row: i, field: k, reason: 'required' });
                ok = false;
                continue;
            }
            if (v == null || v === '') {
                out[k] = v;
                continue;
            }
            if (rules.type === 'string') {
                v = toString(v);
                if (rules.trim) v = v.trim();
                out[k] = v;
            } else if (rules.type === 'number') {
                const n = toNumber(v);
                if (!Number.isFinite(n)) {
                    issues.push({ row: i, field: k, reason: 'notNumber' });
                    ok = false;
                } else {
                    out[k] = n;
                }
            } else {
                out[k] = v;
            }
        }
        if (ok) cleaned.push(out);
    }
    return { rows: cleaned, issues };
};

const validateMatrixNumbers = m =>
    Array.isArray(m) &&
    m.length > 0 &&
    m.every(r => Array.isArray(r) && r.every(c => Number.isFinite(toNumber(c))));

const coerceMatrix = m => m.map(r => r.map(c => toNumber(c)));

const validateSankey = raw => {
    const issues = [];
    const nodes = Array.isArray(raw && raw.nodes) ? raw.nodes : [];
    const links = Array.isArray(raw && raw.links) ? raw.links : [];
    if (!nodes.length || !links.length) return { data: null, issues: [{ reason: 'emptySankey' }] };
    const names = nodes.map(n => toString(n && n.name).trim());
    const nameToIndex = new Map(names.map((n, i) => [n, i]));
    const cleanNodes = names.map(n => ({ name: n }));
    const cleanLinks = [];
    for (let i = 0; i < links.length; i++) {
        const l = links[i] || {};
        let s = l.source;
        let t = l.target;
        const v = toNumber(l.value);
        if (typeof s === 'string') s = nameToIndex.get(toString(s).trim());
        if (typeof t === 'string') t = nameToIndex.get(toString(t).trim());
        if (!Number.isInteger(s) || !Number.isInteger(t) || !Number.isFinite(v)) {
            issues.push({ row: i, reason: 'invalidLink' });
            continue;
        }
        cleanLinks.push({ source: s, target: t, value: v });
    }
    if (!cleanLinks.length) return { data: null, issues: issues.length ? issues : [{ reason: 'noValidLinks' }] };
    return { data: { nodes: cleanNodes, links: cleanLinks }, issues };
};

const validateChord = raw => {
    const labels = Array.isArray(raw && raw.labels) ? raw.labels.map(toString) : [];
    const matrix = raw && raw.matrix;
    if (!labels.length || !validateMatrixNumbers(matrix)) return { data: null, issues: [{ reason: 'invalidChord' }] };
    const m = coerceMatrix(matrix);
    if (m.length !== labels.length || !m.every(r => r.length === labels.length)) return { data: null, issues: [{ reason: 'notSquare' }] };
    return { data: { labels, matrix: m }, issues: [] };
};

const Schemas = {
    bar: { type: 'tabular', fields: { x: { type: 'string', required: true, trim: true }, y: { type: 'number', required: true } }, requiredMappings: ['x', 'y'] },
    line: { type: 'tabular', fields: { x: { type: 'string', required: true, trim: true }, y: { type: 'number', required: true } }, requiredMappings: ['x', 'y'] },
    area: { type: 'tabular', fields: { x: { type: 'string', required: true, trim: true }, y: { type: 'number', required: true } }, requiredMappings: ['x', 'y'] },
    pie: { type: 'tabular', fields: { label: { type: 'string', required: true, trim: true }, value: { type: 'number', required: true } }, requiredMappings: ['label', 'value'] },
    donut: { type: 'tabular', fields: { label: { type: 'string', required: true, trim: true }, value: { type: 'number', required: true } }, requiredMappings: ['label', 'value'] },
    scatter: { type: 'tabular', fields: { x: { type: 'number', required: true }, y: { type: 'number', required: true } }, requiredMappings: ['x', 'y'] },
    bubble: { type: 'tabular', fields: { x: { type: 'number', required: true }, y: { type: 'number', required: true }, r: { type: 'number', required: true } }, requiredMappings: ['x', 'y', 'r'] },
    heatmap: { type: 'tabular', fields: { x: { type: 'string', required: true, trim: true }, y: { type: 'string', required: true, trim: true }, value: { type: 'number', required: true } }, requiredMappings: ['x', 'y', 'value'] },
    sankey: { type: 'sankey', requiredMappings: [] },
    chord: { type: 'chord', requiredMappings: [] }
};

const areMappingsComplete = (chartType, config) => {
    const req = Schemas[chartType]?.requiredMappings || [];
    if (!req.length) return true;
    if (!config) return false;
    for (const k of req) {
        const key = `field_${k}`;
        if (!config[key]) return false;
    }
    return true;
};

const runValidation = (raw, chartType, config) => {
    if (!areMappingsComplete(chartType, config)) return { data: null, issues: [] };
    if (!raw) return { data: null, issues: [{ reason: 'noData' }] };
    if (chartType === 'sankey') return validateSankey(raw);
    if (chartType === 'chord') return validateChord(raw);
    if (chartType === 'heatmap') {
        const rowsCandidate = Array.isArray(raw && raw.values) ? raw.values : Array.isArray(raw) ? raw : raw && raw.rows ? raw.rows : [];
        const normalized = Array.isArray(rowsCandidate) ? normalizeHeatmapValues(rowsCandidate) : { values: [] };
        const { rows, issues } = validateRows(normalized.values, Schemas.heatmap.fields);
        if (!rows.length) return { data: null, issues: issues.length ? issues : [{ reason: 'noValidRows' }] };
        return { data: { values: rows }, issues };
    }
    const schema = Schemas[chartType];
    if (!schema || schema.type !== 'tabular') return { data: raw, issues: [] };
    const rowsCandidate = Array.isArray(raw && raw.values) ? raw.values : Array.isArray(raw) ? raw : raw && raw.rows ? raw.rows : [];
    const { rows, issues } = validateRows(rowsCandidate, schema.fields);
    if (!rows.length) return { data: null, issues: issues.length ? issues : [{ reason: 'noValidRows' }] };
    return { data: { values: rows }, issues };
};

const useValidatedData = (rawData, chartType, onIssues, config) => {
    return useMemo(() => {
        const { data, issues } = runValidation(rawData, chartType, config);
        if (issues && issues.length && typeof onIssues === 'function') onIssues(issues);
        return { data, issues };
    }, [rawData, chartType, onIssues, config]);
};

export default useValidatedData;
