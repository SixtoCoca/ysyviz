import { toNumber } from '../utils';

export const mapPyramid = (raw, cfg) => {
    const rows = Array.isArray(raw?.values) ? raw.values : [];
    const yKey = cfg?.field_y || '';
    const leftKey = cfg?.field_pyramid_left || '';
    const rightKey = cfg?.field_pyramid_right || '';
    
    if (!yKey) return null;

    const values = rows
        .map(row => {
            const mappedRow = {
                y: row[yKey]
            };

            if (leftKey && row[leftKey] !== undefined && row[leftKey] !== null) {
                mappedRow.left = toNumber(row[leftKey]);
            }

            if (rightKey && row[rightKey] !== undefined && row[rightKey] !== null) {
                mappedRow.right = toNumber(row[rightKey]);
            }

            return mappedRow;
        })
        .filter(row => row.y !== undefined && row.y !== null);

    return { values };
};
