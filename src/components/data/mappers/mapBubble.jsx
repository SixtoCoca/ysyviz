import { norm, toNumber } from '../utils';
import { rowsOf } from '../utils';

export const mapBubble = (raw, cfg) => {
    const rows = rowsOf(raw);
    const xKey = cfg?.field_x || '';
    const yKey = cfg?.field_y || '';
    const rKey = cfg?.field_r || '';
    const labelKey = cfg?.field_label || '';
    const sKey = cfg?.field_series || '';
    if (!xKey || !yKey || !rKey || !rows.length) return null;

    if (!sKey) {
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
            labelLabel: labelKey,
            hasSeries: false
        };
    }

    const grouped = {};
    const seriesSet = new Set();

    rows.forEach(r => {
        const x = toNumber(r?.[xKey]);
        const y = toNumber(r?.[yKey]);
        const radius = toNumber(r?.[rKey]);
        const series = norm(r?.[sKey]);
        const label = labelKey ? norm(r?.[labelKey]) : undefined;
        
        if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(radius) && radius >= 0 && series) {
            if (!grouped[series]) grouped[series] = [];
            grouped[series].push({ x, y, r: radius, label });
            seriesSet.add(series);
        }
    });

    const seriesNames = Array.from(seriesSet);
    const series = seriesNames.map(name => ({
        id: name,
        values: grouped[name]
    }));

    return {
        series,
        seriesNames,
        xAxisLabel: xKey,
        yAxisLabel: yKey,
        rLabel: rKey,
        labelLabel: labelKey,
        hasSeries: true
    };
};

export default mapBubble;
