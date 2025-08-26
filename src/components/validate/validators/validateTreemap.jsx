import { rowsOf, resolveFieldKey, toNumber, norm } from '../../data/utils';

export const validateTreemap = (mapped, cfg) => {
    const issues = [];
    if (!cfg?.field_label || !cfg?.field_value) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'field_label and field_value are required' });
        return { data: null, issues };
    }
    const rows = rowsOf(mapped);
    if (!rows.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for treemap chart' });
        return { data: null, issues };
    }
    const sample = rows[0] || {};
    const groupKey = resolveFieldKey(sample, cfg?.field_group, ['group', 'category']);
    const labelKey = resolveFieldKey(sample, cfg?.field_label, ['label', 'name']);
    const valueKey = resolveFieldKey(sample, cfg?.field_value, ['value', 'size']);
    const valid = rows
        .map(r => ({ label: norm(r?.[labelKey]), value: toNumber(r?.[valueKey]) }))
        .filter(d => d.label !== '' && Number.isFinite(d.value) && d.value >= 0);
    if (!valid.length) {
        issues.push({ level: 'error', code: 'no_valid_values', message: 'No positive numeric values for treemap' });
        return { data: null, issues };
    }
    const negatives = rows
        .map(r => toNumber(r?.[valueKey]))
        .filter(v => Number.isFinite(v) && v < 0).length;
    if (negatives > 0) {
        issues.push({ level: 'warn', code: 'negative_values', message: 'Some values are negative and were filtered' });
    }
    return { data: mapped, issues };
};

export default validateTreemap;
