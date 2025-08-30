import { toNumber, norm } from '../utils';

export const mapMultiValueSeries = (raw, cfg, chartType) => {
    const rows = Array.isArray(raw?.values) ? raw.values : [];
    
    const getValueColumns = () => {
        if (Array.isArray(cfg?.field_value) && cfg.field_value.length > 0) {
            return cfg.field_value;
        }
        if (Array.isArray(cfg?.field_y) && cfg.field_y.length > 0) {
            return cfg.field_y;
        }
        return [];
    };
    
    const valueColumns = getValueColumns();
    if (valueColumns.length === 0) return null;

    const baseFields = getBaseFields(chartType, cfg);
    if (!baseFields) return null;

    if (chartType === 'bar') {
        return mapBarMultiValue(rows, valueColumns, baseFields);
    } else if (['line', 'area'].includes(chartType)) {
        return mapLineMultiValue(rows, valueColumns, baseFields);
    } else if (chartType === 'scatter') {
        return mapScatterMultiValue(rows, valueColumns, baseFields);
    } else if (chartType === 'bubble') {
        return mapBubbleMultiValue(rows, valueColumns, baseFields, cfg);
    }

    return null;
};

const mapBarMultiValue = (rows, valueColumns, baseFields) => {
    const grouped = {};
    const categorySet = new Set();

    rows.forEach(row => {
        const category = norm(row[baseFields.category]);
        if (!category) return;

        categorySet.add(category);
        if (!grouped[category]) grouped[category] = {};

        valueColumns.forEach(column => {
            const value = toNumber(row[column]);
            if (Number.isFinite(value)) {
                grouped[category][column] = value;
            }
        });
    });

    const categories = Array.from(categorySet);
    const values = categories.map(category => ({
        key: category,
        values: valueColumns.map(series => ({
            series: series,
            value: grouped[category]?.[series] || 0
        }))
    }));

    return {
        values,
        series: valueColumns,
        categories,
        hasGrouped: true
    };
};

const mapLineMultiValue = (rows, valueColumns, baseFields) => {
    const grouped = {};
    const xSet = new Set();

    rows.forEach(row => {
        const x = norm(row[baseFields.x]);
        if (!x) return;

        xSet.add(x);
        valueColumns.forEach(column => {
            const value = toNumber(row[column]);
            if (Number.isFinite(value)) {
                if (!grouped[column]) grouped[column] = [];
                grouped[column].push({ x, y: value });
            }
        });
    });

    const series = valueColumns.map(column => ({
        id: column,
        values: grouped[column] || []
    })).filter(s => s.values.length > 0);

    return {
        series,
        seriesNames: series.map(s => s.id),
        hasSeries: true
    };
};

const mapScatterMultiValue = (rows, valueColumns, baseFields) => {
    const grouped = {};

    rows.forEach(row => {
        const x = toNumber(row[baseFields.x]);
        if (!Number.isFinite(x)) return;

        valueColumns.forEach(column => {
            const value = toNumber(row[column]);
            if (Number.isFinite(value)) {
                if (!grouped[column]) grouped[column] = [];
                grouped[column].push({ x, y: value });
            }
        });
    });

    const series = valueColumns.map(column => ({
        id: column,
        values: grouped[column] || []
    })).filter(s => s.values.length > 0);

    return {
        series,
        seriesNames: series.map(s => s.id),
        hasSeries: true
    };
};

const mapBubbleMultiValue = (rows, valueColumns, baseFields, cfg) => {
    const grouped = {};

    rows.forEach(row => {
        const x = toNumber(row[baseFields.x]);
        if (!Number.isFinite(x)) return;

        valueColumns.forEach(column => {
            const value = toNumber(row[column]);
            const radius = toNumber(row[baseFields.r]);
            
            if (Number.isFinite(value) && Number.isFinite(radius) && radius >= 0) {
                if (!grouped[column]) grouped[column] = [];
                grouped[column].push({ x, y: value, r: radius });
            }
        });
    });

    const series = valueColumns.map(column => ({
        id: column,
        values: grouped[column] || []
    })).filter(s => s.values.length > 0);

    return {
        series,
        seriesNames: series.map(s => s.id),
        hasSeries: true
    };
};

const getBaseFields = (chartType, cfg) => {
    switch (chartType) {
        case 'bar':
            return {
                category: cfg?.field_category
            };
        case 'line':
        case 'area':
            return {
                x: cfg?.field_x
            };
        case 'scatter':
            return {
                x: cfg?.field_x
            };
        case 'bubble':
            return {
                x: cfg?.field_x,
                r: cfg?.field_r
            };
        default:
            return null;
    }
};
