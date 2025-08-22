export const validateChord = (mapped, config) => {
    const issues = [];
    if (!mapped?.matrix?.length || !mapped?.labels?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid matrix or labels for chord chart' });
        return { data: null, issues };
    }
    const n = mapped.labels.length;
    const shapeOk = Array.isArray(mapped.matrix) && mapped.matrix.length === n && mapped.matrix.every(row => Array.isArray(row) && row.length === n);
    if (!shapeOk) {
        issues.push({ level: 'error', code: 'bad_shape', message: 'Matrix shape does not match labels length' });
        return { data: null, issues };
    }
    return { data: mapped, issues };
};
