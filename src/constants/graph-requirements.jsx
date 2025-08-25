import { ChartTypes } from './graph-type';

export const ChartFieldRequirements = {
    [ChartTypes.BAR]: {
        required: ['category', 'value'],
        optional: ['title', 'color']
    },
    [ChartTypes.LINE]: {
        required: ['x', 'y'],
        optional: ['title', 'color']
    },
    [ChartTypes.AREA]: {
        required: ['x', 'y'],
        optional: ['title', 'color']
    },
    [ChartTypes.SCATTER]: {
        required: ['x', 'y'],
        optional: ['title', 'color']
    },
    [ChartTypes.BUBBLE]: {
        required: ['x', 'y', 'r'],
        optional: ['title', 'color']
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
        optional: ['title', 'color']
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
    }
};
