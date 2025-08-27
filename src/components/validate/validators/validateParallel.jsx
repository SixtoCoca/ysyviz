export const validateParallel = (mapped, cfg) => {
    const issues = [];
    const dims = Array.isArray(mapped?.dimensions) ? mapped.dimensions : [];
    const rows = Array.isArray(mapped?.rows) ? mapped.rows : [];

    if (dims.length < 2) {
        issues.push({ level: 'error', code: 'missing_dimensions', message: 'At least two dimensions are required' });
        return { data: null, issues };
    }
    if (rows.length === 0) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for parallel coordinates chart' });
        return { data: null, issues };
    }
    return { data: mapped, issues };
};

export default validateParallel;
