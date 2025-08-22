import { norm, toNumber, rowsOf } from '../utils';

export const mapHeat = (raw, cfg) => {
    const rows = rowsOf(raw);
    const xKey = cfg?.field_x || '';
    const yKey = cfg?.field_y || '';
    const valueKey = cfg?.field_value || '';
    if (!xKey || !yKey || !valueKey) return null;

    const values = rows
        .map(r => ({ x: norm(r?.[xKey]), y: norm(r?.[yKey]), value: toNumber(r?.[valueKey]) }))
        .filter(d => d.x !== '' && d.y !== '' && Number.isFinite(d.value));

    if (!values.length) return null;

    return { values };
};
