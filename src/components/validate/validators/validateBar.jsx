export const validateBar = (mapped, config) => {
    const issues = [];
    if (!config?.field_category || !config?.field_value) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'Required fields are not set' });
    }
    if (!mapped?.values?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for bar chart' });
        return { data: null, issues };
    }
    return { data: mapped, issues };
};
