import { rowsOf, toNumber, norm } from '../utils';

export const mapParallel = (raw, cfg) => {
    const rows = rowsOf(raw);
    if (!rows.length) return null;

    const dimensions = Array.isArray(cfg?.dimensions) ? cfg.dimensions.filter(Boolean) : [];
    if (!dimensions.length) {
        const sample = rows[0] || {};
        const numeric = Object.keys(sample).filter(k => Number.isFinite(toNumber(sample[k])));
        if (numeric.length < 2) return null;
        return mapParallel(raw, { ...cfg, dimensions: numeric.slice(0, 5) });
    }

    if (dimensions.length < 2) return null;

    const groupKey = cfg?.field_group || '';

    const mappedRows = rows
        .map((r, i) => {
            const values = {};
            for (const d of dimensions) values[d] = toNumber(r?.[d]);
            const ok = dimensions.every(d => Number.isFinite(values[d]));
            if (!ok) return null;
            const group = groupKey ? norm(r?.[groupKey]) : undefined;
            return { id: i, values, group };
        })
        .filter(Boolean);

    if (!mappedRows.length) return null;

    const extentByDim = {};
    for (const d of dimensions) {
        const xs = mappedRows.map(r => r.values[d]);
        const min = Math.min(...xs);
        const max = Math.max(...xs);
        extentByDim[d] = [min, max];
    }

    return {
        dimensions,
        rows: mappedRows,
        extentByDim,
        groupKey
    };
};

export default mapParallel;
