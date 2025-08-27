import { norm, toNumber } from '../utils';
import { rowsOf } from '../utils';

export const mapBubble = (raw, cfg) => {
    const rows = rowsOf(raw);
    const xKey = cfg?.field_x || '';
    const yKey = cfg?.field_y || '';
    const rKey = cfg?.field_r || '';
    const labelKey = cfg?.field_label || '';
    if (!xKey || !yKey || !rKey || !rows.length) return null;

    const values = rows
        .map(r => ({
            x: toNumber(r?.[xKey]),
            y: toNumber(r?.[yKey]),
            r: toNumber(r?.[rKey]),
            label: labelKey ? norm(r?.[labelKey]) : undefined
        }))
        .filter(d => Number.isFinite(d.x) && Number.isFinite(d.y) && Number.isFinite(d.r) && d.r >= 0);

    if (!values.length) return null;

    return {
        values,
        xAxisLabel: xKey,
        yAxisLabel: yKey,
        rLabel: rKey,
        labelLabel: labelKey
    };
};

export default mapBubble;
