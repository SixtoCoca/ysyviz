import { norm, toNumber } from '../utils';
import { rowsOf } from '../utils';

export const mapScatter = (raw, cfg) => {
    const rows = rowsOf(raw);
    const xKey = cfg?.field_x || '';
    const yKey = cfg?.field_y || '';
    const labelKey = cfg?.field_label || '';
    if (!xKey || !yKey || !rows.length) return null;

    const values = rows
        .map(r => ({
            x: toNumber(r?.[xKey]),
            y: toNumber(r?.[yKey]),
            label: labelKey ? norm(r?.[labelKey]) : undefined
        }))
        .filter(d => Number.isFinite(d.x) && Number.isFinite(d.y));

    if (!values.length) return null;

    return {
        values,
        xAxisLabel: xKey,
        yAxisLabel: yKey,
        labelLabel: labelKey
    };
};

export default mapScatter;
