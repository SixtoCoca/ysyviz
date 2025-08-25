import { rowsOf, toNumber, norm } from '../utils';

export const mapParallel = (raw, cfg) => {
    const rows = rowsOf(raw);
    if (!rows.length) return null;

    const dimensions = Array.isArray(cfg?.dimensions) ? cfg.dimensions.filter(Boolean) : [];
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
        extentByDim[d] = [Math.min(...xs), Math.max(...xs)];
    }

    return {
        dimensions,
        rows: mappedRows,
        extentByDim,
        groupKey
    };
};

export default mapParallel;
