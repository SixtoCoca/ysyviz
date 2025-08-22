export const validateViolin = (mapped, config) => {
    const issues = [];
    if (!config?.field_x || !config?.field_y) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'Required fields are not set' });
    }
    if (!mapped?.values?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for violin chart' });
        return { data: null, issues };
    }
    return { data: mapped, issues };
};
