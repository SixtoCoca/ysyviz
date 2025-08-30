import { rowsOf, resolveFieldKey, toNumber, norm } from '../utils';

export const mapWaterfall = (raw, cfg) => {
    const rows = rowsOf(raw);
    if (!rows.length) return null;

    const sample = rows[0] || {};
    const catKey = resolveFieldKey(sample, cfg?.field_category, ['category', 'label', 'name']);
    const valKey = resolveFieldKey(sample, cfg?.field_value, ['value', 'delta', 'amount']);

    if (!catKey || !valKey) return null;

    const initialValue = toNumber(cfg?.initialValue);
    const showFinalValue = cfg?.showFinalValue || false;
    const totalLabel = 'Total';

    const deltas = rows
        .map(r => ({ label: norm(r?.[catKey]), delta: toNumber(r?.[valKey]) }))
        .filter(d => d.label !== '' && Number.isFinite(d.delta));

    if (!deltas.length) return null;

    const steps = [];
    let acc = 0;

    if (Number.isFinite(initialValue) && initialValue !== 0) {
        steps.push({ 
            label: 'Initial', 
            delta: initialValue, 
            y0: 0, 
            y1: initialValue, 
            type: 'initial', 
            index: 0 
        });
        acc = initialValue;
    }

    deltas.forEach((d, i) => {
        const y0 = acc;
        acc += d.delta;
        const y1 = acc;
        steps.push({ 
            label: d.label, 
            delta: d.delta, 
            y0, 
            y1, 
            type: 'step', 
            index: steps.length 
        });
    });

    if (showFinalValue) {
        steps.push({ 
            label: totalLabel, 
            delta: acc, 
            y0: 0, 
            y1: acc, 
            type: 'total', 
            index: steps.length 
        });
    }

    return { steps, initial: initialValue, final: acc };
};

export default mapWaterfall;
