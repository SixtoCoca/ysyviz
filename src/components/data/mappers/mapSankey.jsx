import { norm, toNumber, rowsOf } from '../utils';

export const mapSankey = (raw, cfg) => {
    const rows = rowsOf(raw);
    const sKey = cfg?.field_source || '';
    const tKey = cfg?.field_target || '';
    const vKey = cfg?.field_value || '';
    if (!sKey || !tKey || !vKey) return null;

    const triples = rows
        .map(r => ({ source: norm(r?.[sKey]), target: norm(r?.[tKey]), value: toNumber(r?.[vKey]) }))
        .filter(d => d.source !== '' && d.target !== '' && Number.isFinite(d.value) && d.value > 0);

    if (!triples.length) return null;

    const names = Array.from(new Set(triples.flatMap(d => [d.source, d.target])));
    const index = new Map(names.map((n, i) => [n, i]));

    const pairMap = new Map();
    for (const d of triples) {
        const k = `${d.source}→${d.target}`;
        pairMap.set(k, (pairMap.get(k) || 0) + d.value);
    }

    const nodes = names.map(n => ({ name: n }));
    const links = Array.from(pairMap.entries()).map(([k, v]) => {
        const [s, t] = k.split('→');
        return { source: index.get(s), target: index.get(t), value: v };
    });

    if (!nodes.length || !links.length) return null;

    return { nodes, links };
};
