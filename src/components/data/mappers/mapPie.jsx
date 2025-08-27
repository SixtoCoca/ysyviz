import { norm, toNumber, rowsOf } from '../utils';

export const mapPie = (raw, cfg) => {
    const rows = rowsOf(raw);
    const labelKey = cfg?.field_label || '';
    const valueKey = cfg?.field_value || '';
    if (!labelKey || !valueKey) return null;


    const values = rows
        .map(r => ({ label: norm(r?.[labelKey]), value: toNumber(r?.[valueKey]) }))
        .filter(d => d.label !== '' && Number.isFinite(d.value));


    if (!values.length) return null;


    return { values };
};