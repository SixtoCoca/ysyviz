import { rowsOf, resolveFieldKey, toNumber, norm } from '../utils';

export const mapWaterfall = (raw, cfg) => {
    const rows = rowsOf(raw);
    if (!rows.length) return null;

    const sample = rows[0] || {};
    const catKey = resolveFieldKey(sample, cfg?.field_category, ['category', 'label', 'name']);
    const valKey = resolveFieldKey(sample, cfg?.field_value, ['value', 'delta', 'amount']);

    if (!catKey || !valKey) return null;

    const initial = toNumber(cfg?.initialValue) || 0;
    const includeTotal = !!cfg?.includeTotal;
    const totalLabel = String(cfg?.totalLabel ?? 'Total');

    const deltas = rows
        .map(r => ({ label: norm(r?.[catKey]), delta: toNumber(r?.[valKey]) }))
        .filter(d => d.label !== '' && Number.isFinite(d.delta));

    if (!deltas.length) return null;

    let acc = initial;
    const steps = deltas.map((d, i) => {
        const y0 = acc;
        acc += d.delta;
        const y1 = acc;
        return { label: d.label, delta: d.delta, y0, y1, type: 'step', index: i };
    });

    if (includeTotal) {
        steps.push({ label: totalLabel, delta: acc, y0: 0, y1: acc, type: 'total', index: steps.length });
    }

    return { steps, initial, final: acc };
};

export default mapWaterfall;
