import { drawCustomLegend, getCustomLegendPosition } from './customLegend';

export const applyCustomLegend = (g, config, innerWidth, innerHeight, hasSeriesLegend = false, seriesCount = 0) => {
    if (config?.customLegend) {
        const customPos = getCustomLegendPosition(config, innerWidth, innerHeight, hasSeriesLegend, seriesCount);
        drawCustomLegend(g, config.customLegend, customPos.x, customPos.y);
    }
};
