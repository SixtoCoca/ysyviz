export const validateBubble = (mapped, cfg) => {
    const issues = [];
    if (!cfg?.field_x || !cfg?.field_y || !cfg?.field_r) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'field_x, field_y and field_r are required' });
        return { data: null, issues };
    }
    if (!mapped?.values?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for bubble chart' });
        return { data: null, issues };
    }
    const negatives = mapped.values.filter(d => d.r < 0).length;
    if (negatives > 0) {
        issues.push({ level: 'warn', code: 'negative_radius', message: 'Some radii are negative and were filtered' });
    }
    return { data: mapped, issues };
};

export default validateBubble;
