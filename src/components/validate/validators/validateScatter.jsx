export const validateScatter = (mapped, cfg) => {
    const issues = [];
    if (!cfg?.field_x || !cfg?.field_y) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'field_x and field_y are required' });
        return { data: null, issues };
    }
    const hasData = mapped?.hasSeries 
        ? mapped?.series?.length > 0 && mapped.series.some(s => s.values?.length > 0)
        : mapped?.values?.length > 0;
        
    if (!hasData) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for scatter chart' });
        return { data: null, issues };
    }
    return { data: mapped, issues };
};

export default validateScatter;
