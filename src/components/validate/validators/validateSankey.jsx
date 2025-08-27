export const validateSankey = (mapped, config) => {
    const issues = [];
    if (!config?.field_source || !config?.field_target || !config?.field_value) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'Required fields are not set' });
    }
    if (!mapped?.nodes?.length || !mapped?.links?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid nodes or links for sankey chart' });
        return { data: null, issues };
    }
    return { data: mapped, issues };
};
