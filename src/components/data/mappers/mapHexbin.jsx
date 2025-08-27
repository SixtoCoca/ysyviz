import { toNumber } from '../utils';
import { rowsOf } from '../utils';

export const mapHexbin = (raw, cfg) => {
    const rows = rowsOf(raw);
    const xKey = cfg?.field_x || '';
    const yKey = cfg?.field_y || '';
    if (!xKey || !yKey || !rows.length) return null;

    const values = rows
        .map(r => ({
            x: toNumber(r?.[xKey]),
            y: toNumber(r?.[yKey])
        }))
        .filter(d => Number.isFinite(d.x) && Number.isFinite(d.y));

    if (!values.length) return null;

    return {
        values,
        xAxisLabel: xKey,
        yAxisLabel: yKey
    };
};

export default mapHexbin;
