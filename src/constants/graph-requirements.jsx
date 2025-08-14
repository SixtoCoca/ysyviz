import { ChartTypes } from './graph-type'

export const ChartFieldRequirements = {
    [ChartTypes.BAR]: {
        required: ['x', 'y'],
        optional: ['color']
    },
    [ChartTypes.LINE]: {
        required: ['x', 'y'],
        optional: ['group']
    },
    [ChartTypes.AREA]: {
        required: ['x', 'y'],
        optional: ['group']
    },
    [ChartTypes.SCATTER]: {
        required: ['x', 'y'],
        optional: ['group']
    },
    [ChartTypes.BUBBLE]: {
        required: ['x', 'y', 'r'],
        optional: ['label', 'color']
    },
    [ChartTypes.PIE]: {
        required: ['label', 'value'],
        optional: []
    },
    [ChartTypes.DONUT]: {
        required: ['label', 'value'],
        optional: []
    },
    [ChartTypes.HEATMAP]: {
        required: ['x', 'y', 'value'],
        optional: ['tooltip', 'size']
    },
    [ChartTypes.SANKEY]: {
        required: ['source', 'target', 'value'],
        optional: []
    },
    [ChartTypes.CHORD]: {
        required: [],
        optional: []
    }
};