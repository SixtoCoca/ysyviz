export const validateWaterfall = (mapped, cfg) => {
    const issues = [];
    if (!cfg?.field_category || !cfg?.field_value) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'field_category and field_value are required' });
        return { data: null, issues };
    }
    if (!mapped?.steps?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for waterfall chart' });
        return { data: null, issues };
    }
    const hasNaN = mapped.steps.some(d => !Number.isFinite(d.y0) || !Number.isFinite(d.y1) || !Number.isFinite(d.delta));
    if (hasNaN) {
        issues.push({ level: 'error', code: 'invalid_numbers', message: 'Found non-finite numbers after mapping' });
        return { data: null, issues };
    }
    return { data: mapped, issues };
};

export default validateWaterfall;
