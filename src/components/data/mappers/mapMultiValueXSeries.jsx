import { toNumber, norm } from '../utils';

export const mapMultiValueXSeries = (raw, cfg, chartType) => {
    const rows = Array.isArray(raw?.values) ? raw.values : [];
    
    const getXColumns = () => {
        if (Array.isArray(cfg?.field_x) && cfg.field_x.length > 0) {
            return cfg.field_x;
        }
        if (Array.isArray(cfg?.field_group) && cfg.field_group.length > 0) {
            return cfg.field_group;
        }
        return [];
    };
    
    const xColumns = getXColumns();
    if (xColumns.length === 0) return null;

    const baseFields = getBaseFields(chartType, cfg);
    if (!baseFields) return null;

    if (chartType === 'violin') {
        return mapViolinMultiValueX(rows, xColumns, baseFields);
    } else if (chartType === 'boxplot') {
        return mapBoxplotMultiValueX(rows, xColumns, baseFields);
    }

    return null;
};

const mapViolinMultiValueX = (rows, xColumns, baseFields) => {
    const allValues = [];

    rows.forEach(row => {
        const y = toNumber(row[baseFields.y]);
        if (!Number.isFinite(y)) return;

        xColumns.forEach(column => {
            const x = norm(row[column]);
            if (!x) return;

            allValues.push({ x: `${column}: ${x}`, y });
        });
    });

    if (allValues.length === 0) return null;

    return {
        values: allValues
    };
};

const mapBoxplotMultiValueX = (rows, xColumns, baseFields) => {
    const allValues = [];

    rows.forEach(row => {
        const value = toNumber(row[baseFields.value]);
        if (!Number.isFinite(value)) return;

        xColumns.forEach(column => {
            const group = norm(row[column]);
            if (!group) return;

            allValues.push({ group: `${column}: ${group}`, value });
        });
    });

    if (allValues.length === 0) return null;

    return {
        values: allValues
    };
};

const getBaseFields = (chartType, cfg) => {
    switch (chartType) {
        case 'violin':
            return {
                y: cfg?.field_y
            };
        case 'boxplot':
            return {
                value: cfg?.field_value
            };
        default:
            return null;
    }
};
