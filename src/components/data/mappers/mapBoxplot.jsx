import { norm, toNumber, rowsOf } from '../utils';

export const mapBoxplot = (raw, cfg) => {
    const rows = rowsOf(raw);
    const gKey = cfg?.field_group || '';
    const vKey = cfg?.field_value || '';
    if (!gKey || !vKey) return null;

    const values = rows
        .map(r => ({ group: norm(r?.[gKey]), value: toNumber(r?.[vKey]) }))
        .filter(d => d.group !== '' && Number.isFinite(d.value));

    if (!values.length) return null;

    return { values };
};