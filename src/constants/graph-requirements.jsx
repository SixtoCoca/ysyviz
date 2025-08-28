import { ChartTypes } from './graph-type';

export const ChartFieldRequirements = {
    [ChartTypes.BAR]: {
        required: ['category', 'value'],
        optional: ['title', 'color', 'palette', 'series', 'orientation', 'legendPosition']
    },
    [ChartTypes.LINE]: {
        required: ['x', 'y'],
        optional: ['title', 'color', 'palette', 'series', 'legendPosition']
    },
    [ChartTypes.AREA]: {
        required: ['x', 'y'],
        optional: ['title', 'color', 'palette', 'series', 'legendPosition']
    },
    [ChartTypes.SCATTER]: {
        required: ['x', 'y'],
        optional: ['title', 'color', 'palette', 'series', 'legendPosition']
    },
    [ChartTypes.BUBBLE]: {
        required: ['x', 'y', 'r'],
        optional: ['title', 'color', 'palette', 'series', 'legendPosition']
    },
    [ChartTypes.PIE]: {
        required: ['label', 'value'],
        optional: ['title', 'palette']
    },
    [ChartTypes.DONUT]: {
        required: ['label', 'value'],
        optional: ['title', 'palette', 'donutHole']
    },
    [ChartTypes.HEATMAP]: {
        required: ['x', 'y', 'value'],
        optional: ['title', 'color']
    },
    [ChartTypes.SANKEY]: {
        required: ['source', 'target', 'value'],
        optional: ['title', 'palette']
    },
    [ChartTypes.CHORD]: {
        required: [],
        optional: ['title', 'palette']
    },
    [ChartTypes.VIOLIN]: {
        required: ['x', 'y'],
        optional: ['title', 'color', 'orientation']
    },
    [ChartTypes.BOXPLOT]: {
        required: ['group', 'value'],
        optional: ['title', 'palette']
    },
    [ChartTypes.HEXBIN]: {
        required: ['x', 'y'],
        optional: ['title', 'color']
    },
    [ChartTypes.PARALLEL]: {
        required: ['dimensions'],
        optional: ['title', 'color']
    },
    [ChartTypes.TREEMAP]: {
        required: ['label', 'value'],
        optional: ['group', 'title', 'palette']
    },
    [ChartTypes.SUNBURST]: {
        required: ['path', 'value'],
        optional: ['title', 'palette']
    },
    [ChartTypes.WATERFALL]: {
        required: ['category', 'value'],
        optional: ['title', 'color', 'initialValue', 'upColor', 'downColor', 'showFinalValue']
    },
    [ChartTypes.CALENDAR]: {
        required: ['date', 'value'],
        optional: ['title', 'color']
    }
};
