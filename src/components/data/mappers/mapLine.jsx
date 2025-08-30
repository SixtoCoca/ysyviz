import { rowsOf, norm, toNumber } from '../utils';

export const mapLine = (raw, cfg) => {
    const rows = rowsOf(raw);
    const xKey = cfg?.field_x || '';
    const yKey = cfg?.field_y || '';
    const sKey = cfg?.field_series || '';
    if (!xKey || !yKey || !rows.length) return null;

    if (!sKey) {
        const values = rows
            .map(r => ({ x: norm(r?.[xKey]), y: toNumber(r?.[yKey]) }))
            .filter(d => d.x !== '' && Number.isFinite(d.y));

        if (!values.length) return null;
        return { series: [{ id: 'series', values }], hasSeries: false };
    }

    const grouped = {};
    const seriesSet = new Set();

    rows.forEach(r => {
        const x = norm(r?.[xKey]);
        const y = toNumber(r?.[yKey]);
        const series = norm(r?.[sKey]);
        
        if (x !== '' && Number.isFinite(y) && series) {
            if (!grouped[series]) grouped[series] = [];
            grouped[series].push({ x, y });
            seriesSet.add(series);
        }
    });

    const seriesNames = Array.from(seriesSet);
    const series = seriesNames.map(name => ({
        id: name,
        values: grouped[name].sort((a, b) => a.x.localeCompare(b.x))
    }));

    return { series, seriesNames, hasSeries: true };
};

export default mapLine;
