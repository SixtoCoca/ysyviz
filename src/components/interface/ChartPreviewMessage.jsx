import React from 'react';

const ChartPreviewMessage = ({ type, hasRequiredFields, hasErrors, chartData }) => {
    if (!type) {
        return (
            <p className='text-muted text-center'>
                Please select a chart type to start configuring your visualization.
            </p>
        );
    }
    if (!hasRequiredFields) {
        return (
            <p className='text-muted text-center'>
                Complete the required fields to render the chart.
            </p>
        );
    }
    if (hasErrors) {
        return (
            <p className='text-muted text-center'>
                Fix the validation errors to render the chart.
            </p>
        );
    }
    if (!chartData) {
        return (
            <p className='text-muted text-center'>
                Please upload a data file and select a chart type to see the visualization.
            </p>
        );
    }
    return null;
};

export default ChartPreviewMessage;
