export const validatePie = (mapped, config) => {
    const issues = [];
    if (!config?.field_label || !config?.field_value) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'Required fields are not set' });
    }
    if (!mapped?.values?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for pie chart' });
        return { data: null, issues };
    }
    const nonPositive = mapped.values.filter(d => !Number.isFinite(d.value) || d.value < 0).length;
    if (nonPositive > 0) {
        issues.push({ level: 'warn', code: 'non_positive_values', message: 'Some values are negative or invalid' });
    }
    return { data: mapped, issues };
};
