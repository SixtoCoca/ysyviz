const isValidDate = d => d instanceof Date && !isNaN(d);

export const validateCalendarHeatmap = (mapped, cfg) => {
    const issues = [];
    if (!cfg?.field_date || !cfg?.field_value) {
        issues.push({ level: 'error', code: 'missing_fields', message: 'field_date and field_value are required' });
        return { data: null, issues };
    }
    if (!mapped?.values?.length) {
        issues.push({ level: 'error', code: 'empty_data', message: 'No valid rows for calendar heatmap' });
        return { data: null, issues };
    }

    const invalidDates = mapped.values.filter(d => !isValidDate(d.date)).length;
    if (invalidDates > 0) {
        issues.push({ level: 'error', code: 'invalid_date', message: `${invalidDates} rows contain invalid date values` });
        return { data: null, issues };
    }

    return { data: mapped, issues };
};

export default validateCalendarHeatmap;
