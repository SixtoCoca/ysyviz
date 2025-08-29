import { ChartTypes } from './graph-type';

export const ChartFieldRequirements = {
    [ChartTypes.BAR]: {
        required: ['category', 'value'],
        optional: ['title', 'color', 'palette', 'series', 'orientation', 'legendPosition', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.LINE]: {
        required: ['x', 'y'],
        optional: ['title', 'color', 'palette', 'series', 'legendPosition', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.AREA]: {
        required: ['x', 'y'],
        optional: ['title', 'color', 'palette', 'series', 'legendPosition', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.SCATTER]: {
        required: ['x', 'y'],
        optional: ['title', 'color', 'palette', 'series', 'legendPosition', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.BUBBLE]: {
        required: ['x', 'y', 'r'],
        optional: ['title', 'color', 'palette', 'series', 'legendPosition', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.PIE]: {
        required: ['label', 'value'],
        optional: ['title', 'palette', 'startAngle', 'showPercentages', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.DONUT]: {
        required: ['label', 'value'],
        optional: ['title', 'palette', 'startAngle', 'donutHoleSize', 'showPercentages', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.HEATMAP]: {
        required: ['x', 'y', 'value'],
        optional: ['title', 'color', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.SANKEY]: {
        required: ['source', 'target', 'value'],
        optional: ['title', 'palette', 'linkColors', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.CHORD]: {
        required: [],
        optional: ['title', 'palette', 'chordColors', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.VIOLIN]: {
        required: ['x', 'y'],
        optional: ['title', 'color', 'orientation', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.BOXPLOT]: {
        required: ['group', 'value'],
        optional: ['title', 'palette', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.HEXBIN]: {
        required: ['x', 'y'],
        optional: ['title', 'color', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.PARALLEL]: {
        required: ['dimensions'],
        optional: ['title', 'color', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.TREEMAP]: {
        required: ['label', 'value'],
        optional: ['title', 'palette', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.SUNBURST]: {
        required: ['path', 'value'],
        optional: ['title', 'palette', 'donutHoleSize', 'showPercentages', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.WATERFALL]: {
        required: ['category', 'value'],
        optional: ['title', 'color', 'initialValue', 'upColor', 'downColor', 'showFinalValue', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.CALENDAR]: {
        required: ['date', 'value'],
        optional: ['title', 'color', 'customLegend', 'customLegendPosition']
    },
    [ChartTypes.PYRAMID]: {
        required: ['y'],
        optional: ['pyramid_left', 'pyramid_right', 'title', 'leftColor', 'rightColor', 'customLegend', 'customLegendPosition']
    }
};
