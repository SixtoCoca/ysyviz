export const validateLine = (mapped, cfg) => {
    const issues = [];
    if (!cfg?.field_x || !cfg?.field_y) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'field_x and field_y are required' });
        return { data: null, issues };
    }
    if (!mapped?.series?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for line chart' });
        return { data: null, issues };
    }
    return { data: mapped, issues };
};

export default validateLine;
