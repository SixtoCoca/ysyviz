import { rowsOf, norm, toNumber } from '../utils';

export const mapLine = (raw, cfg) => {
    const rows = rowsOf(raw);
    const xKey = cfg?.field_x || '';
    const yKey = cfg?.field_y || '';
    if (!xKey || !yKey || !rows.length) return null;

    const values = rows
        .map(r => ({ x: norm(r?.[xKey]), y: toNumber(r?.[yKey]) }))
        .filter(d => d.x !== '' && Number.isFinite(d.y));

    if (!values.length) return null;

    return { series: [{ id: 'series', values }] };
};

export default mapLine;
