export const validatePyramid = (mapped, config) => {
    const issues = [];
    
    if (!config?.field_y) {
        issues.push({ level: 'error', code: 'missing_y_field', message: 'Y axis field is required' });
    }
    
    if (!config?.field_pyramid_left && !config?.field_pyramid_right) {
        issues.push({ level: 'error', code: 'missing_sides', message: 'At least one side (left or right) must be mapped' });
    }
    
    if (!mapped?.values?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for pyramid chart' });
        return { data: null, issues };
    }

    const validRows = mapped.values.filter(row => 
        row.y && (Number.isFinite(row.left) || Number.isFinite(row.right))
    );

    if (validRows.length === 0) {
        issues.push({ level: 'error', code: 'no_valid_rows', message: 'No rows with Y field and at least one side (left or right) data' });
        return { data: null, issues };
    }

    const hasLeftData = validRows.some(d => Number.isFinite(d.left) && d.left !== 0);
    const hasRightData = validRows.some(d => Number.isFinite(d.right) && d.right !== 0);
    
    if (!hasLeftData && !hasRightData) {
        issues.push({ level: 'warning', code: 'no_valid_data', message: 'No valid numeric data found for either side' });
    }
    
    const uniqueYValues = [...new Set(mapped.values.map(d => d.y))];
    if (uniqueYValues.length < 2) {
        issues.push({ level: 'warning', code: 'single_category', message: 'Only one category found in Y axis. Consider adding more categories for better visualization.' });
    }
    
    return { data: mapped, issues };
};
