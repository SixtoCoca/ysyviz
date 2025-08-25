import { rowsOf, toNumber, norm } from '../utils';

export const mapCalendarHeatmap = (raw, cfg) => {
    const rows = rowsOf(raw);
    const dKey = cfg?.field_date || '';
    const vKey = cfg?.field_value || '';
    if (!dKey || !vKey) return null;

    const values = rows
        .map(r => ({
            date: new Date(r?.[dKey]),
            value: toNumber(r?.[vKey])
        }))
        .filter(d => d.date instanceof Date && !isNaN(d.date) && Number.isFinite(d.value));

    if (!values.length) return null;
    return { values };
};
