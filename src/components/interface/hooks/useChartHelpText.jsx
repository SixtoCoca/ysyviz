import { useMemo } from 'react';

export const useChartHelpText = (type) =>
    useMemo(() => {
        switch (type) {
            case 'bar':
                return "CSV with 2 columns: x and y";
            case 'line':
                return "CSV with 2 columns: x and y";
            case 'scatter':
                return "CSV with 2 numeric columns: x and y";
            case 'pie':
            case 'donut':
                return "CSV with 2 columns: label and value";
            case 'bubble':
                return "CSV with 3 numeric columns: x, y and size";
            default:
                return "Upload a valid CSV file";
        }
    }, [type]);
