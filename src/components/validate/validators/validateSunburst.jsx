export const validateSunburst = (mapped, cfg) => {
    const issues = [];
    if (!cfg?.field_path || !cfg?.field_value) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'field_path and field_value are required' });
        return { data: null, issues };
    }
    if (!mapped || !mapped.children || mapped.children.length === 0) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid hierarchy for sunburst chart' });
        return { data: null, issues };
    }
    return { data: mapped, issues };
};

export default validateSunburst;
