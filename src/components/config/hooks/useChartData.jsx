import { useMemo } from 'react';

export const useChartData = (rawData, chartType, config) => {
    return useMemo(() => {
        if (!rawData) return null;

        // Sankey
        if (rawData.nodes && rawData.links) {
            return {
                nodes: rawData.nodes,
                links: rawData.links
            };
        }

        // Chord
        if (rawData.matrix && rawData.labels) {
            return {
                matrix: rawData.matrix,
                labels: rawData.labels
            };
        }

        if (!Array.isArray(rawData.values)) return null;

        const { color, title, ...mappings } = config || {};
        const mappedFields = Object.entries(mappings)
            .filter(([k, v]) => k.startsWith('field_') && v)
            .map(([k, v]) => [k.replace('field_', ''), v]);

        const values = rawData.values.map(row => {
            const newRow = {};
            mappedFields.forEach(([key, col]) => {
                newRow[key] = row[col];
            });
            return newRow;
        });

        const xAxisLabel = mappings.field_x || '';
        const yAxisLabel = mappings.field_y || '';
        const rLabel = mappings.field_r || '';
        const labelLabel = mappings.field_label || '';

        return {
            values,
            xAxisLabel,
            yAxisLabel,
            rLabel,
            labelLabel
        };
    }, [rawData, chartType, config]);
};
