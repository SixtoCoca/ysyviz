import { rowsOf, resolveFieldKey, norm, toNumber } from '../utils';

const addPath = (root, parts, value) => {
    let node = root;
    for (const part of parts) {
        let child = node.childrenMap.get(part);
        if (!child) {
            child = { name: part, children: [], childrenMap: new Map(), value: 0 };
            node.children.push(child);
            node.childrenMap.set(part, child);
        }
        node = child;
    }
    node.value += value;
};

export const mapSunburst = (raw, cfg) => {
    const rows = rowsOf(raw);
    if (!rows.length) return null;

    const sample = rows[0] || {};
    const pathKey = resolveFieldKey(sample, cfg?.field_path, ['path', 'hierarchy']);
    const valueKey = resolveFieldKey(sample, cfg?.field_value, ['value', 'size']);
    const delimiter = typeof cfg?.delimiter === 'string' && cfg.delimiter.length ? cfg.delimiter : '/';

    if (!pathKey || !valueKey) return null;

    const root = { name: 'root', children: [], childrenMap: new Map(), value: 0 };

    for (const r of rows) {
        const pathRaw = norm(r?.[pathKey]);
        const v = toNumber(r?.[valueKey]);
        if (!pathRaw || !Number.isFinite(v) || v <= 0) continue;
        const parts = pathRaw.split(delimiter).map(s => norm(s)).filter(s => s.length);
        if (!parts.length) continue;
        addPath(root, parts, v);
    }

    const stripMaps = node => {
        if (node.children && node.children.length) {
            node.children.forEach(stripMaps);
        }
        delete node.childrenMap;
    };

    stripMaps(root);
    return root.children.length ? root : null;
};

export default mapSunburst;
