import { useMemo } from 'react';
import { ChartTypes } from '../../../constants/graph-type';
import { mapBar } from '../mappers/mapBar';
import { mapLine } from '../mappers/mapLine';
import { mapPie } from '../mappers/mapPie';
import { mapScatter } from '../mappers/mapScatter';
import { mapBubble } from '../mappers/mapBubble';
import { mapHeat } from '../mappers/mapHeat';
import { mapSankey } from '../mappers/mapSankey';
import { mapChord } from '../mappers/mapChord';
import { mapViolin } from '../mappers/mapViolin';
import { mapBoxplot } from '../mappers/mapBoxplot';
import { mapHexbin } from '../mappers/mapHexbin';
import { mapParallel } from '../mappers/mapParallel';
import { mapTreemap } from '../mappers/mapTreemap';
import { mapSunburst } from '../mappers/mapSunburst';
import { mapWaterfall } from '../mappers/mapWaterfall';
import { mapCalendarHeatmap } from '../mappers/mapCalendarHeatmap';
import { mapPyramid } from '../mappers/mapPyramid';
import { mapMultiValueSeries } from '../mappers/mapMultiValueSeries';
import { mapMultiValueXSeries } from '../mappers/mapMultiValueXSeries';

const NullMapper = () => null;

const Mappers = {
    [ChartTypes.BAR]: mapBar,
    [ChartTypes.LINE]: mapLine,
    [ChartTypes.AREA]: mapLine,
    [ChartTypes.SCATTER]: mapScatter,
    [ChartTypes.BUBBLE]: mapBubble,
    [ChartTypes.PIE]: mapPie,
    [ChartTypes.DONUT]: mapPie,
    [ChartTypes.HEATMAP]: mapHeat,
    [ChartTypes.SANKEY]: mapSankey,
    [ChartTypes.CHORD]: mapChord,
    [ChartTypes.VIOLIN]: mapViolin,
    [ChartTypes.BOXPLOT]: mapBoxplot,
    [ChartTypes.HEXBIN]: mapHexbin,
    [ChartTypes.PARALLEL]: mapParallel,
    [ChartTypes.TREEMAP]: mapTreemap,
    [ChartTypes.SUNBURST]: mapSunburst,
    [ChartTypes.WATERFALL]: mapWaterfall,
    [ChartTypes.CALENDAR]: mapCalendarHeatmap,
    [ChartTypes.PYRAMID]: mapPyramid
};

const useChartData = (rawData, chartType, config) => {
    return useMemo(() => {
        if (!rawData || !chartType) return null;
        
        const hasMultipleValues = Array.isArray(config?.field_value) && config.field_value.length > 1;
        const hasMultipleYValues = Array.isArray(config?.field_y) && config.field_y.length > 1;
        const hasMultipleXValues = Array.isArray(config?.field_x) && config.field_x.length > 1;
        const hasMultipleGroupValues = Array.isArray(config?.field_group) && config.field_group.length > 1;
        const supportsMultiValue = ['bar', 'line', 'area', 'scatter', 'bubble'].includes(chartType);
        const supportsMultiValueX = ['violin', 'boxplot'].includes(chartType);
        
        if ((hasMultipleValues || hasMultipleYValues) && supportsMultiValue) {
            return mapMultiValueSeries(rawData, config, chartType);
        }
        
        if (supportsMultiValueX && ((hasMultipleXValues && config.field_x.length > 1) || (hasMultipleGroupValues && config.field_group.length > 1))) {
            return mapMultiValueXSeries(rawData, config, chartType);
        }
        
        const mapper = Mappers[chartType] || NullMapper;
        return mapper(rawData, config);
    }, [rawData, chartType, config]);
};

export default useChartData;
