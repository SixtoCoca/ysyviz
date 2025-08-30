import { norm, toNumber, rowsOf } from '../utils';

export const mapSankey = (raw, cfg) => {
    const rows = rowsOf(raw);
    const sKey = cfg?.field_source || '';
    const tKey = cfg?.field_target || '';
    const vKey = cfg?.field_value || '';
    if (!sKey || !tKey || !vKey) return null;

    const triples = rows
        .map(r => ({ source: norm(r?.[sKey]), target: norm(r?.[tKey]), value: toNumber(r?.[vKey]) }))
        .filter(d => d.source !== '' && d.target !== '' && d.source !== d.target && Number.isFinite(d.value) && d.value > 0);

    if (!triples.length) return null;

    const pairTotals = new Map();
    for (const d of triples) {
        const k = `${d.source}->${d.target}`;
        pairTotals.set(k, (pairTotals.get(k) || 0) + d.value);
    }

    const kept = new Map();
    const seen = new Set();
    for (const [k, v] of pairTotals.entries()) {
        if (seen.has(k)) continue;
        const [s, t] = k.split('->');
        const revKey = `${t}->${s}`;
        const rev = pairTotals.get(revKey) || 0;
        if (rev > 0) {
            if (v > rev) {
                kept.set(k, v - rev);
            } else if (rev > v) {
                kept.set(revKey, rev - v);
            }
            seen.add(k);
            seen.add(revKey);
        } else {
            kept.set(k, v);
            seen.add(k);
        }
    }

    if (kept.size === 0) return null;

    const names = Array.from(new Set(Array.from(kept.keys()).flatMap(k => k.split('->'))));
    const index = new Map(names.map((n, i) => [n, i]));

    const nodes = names.map(n => ({ name: n }));
    const links = Array.from(kept.entries()).map(([k, v]) => {
        const [s, t] = k.split('->');
        return { source: index.get(s), target: index.get(t), value: v };
    });

    if (!nodes.length || !links.length) return null;

    return { nodes, links };
};

export default mapSankey;
