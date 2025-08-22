import { useMemo } from 'react';
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

const pickMapper = type => {
    if (type === 'bar') return mapBar;
    if (type === 'line') return mapLine;
    if (type === 'area') return mapLine;
    if (type === 'pie') return mapPie;
    if (type === 'donut') return mapPie;
    if (type === 'scatter') return mapScatter;
    if (type === 'bubble') return mapBubble;
    if (type === 'heatmap') return mapHeat;
    if (type === 'sankey') return mapSankey;
    if (type === 'chord') return mapChord;
    if (type === 'violin') return mapViolin;
    if (type === 'boxplot') return mapBoxplot;
    if (type === 'hexbin') return mapHexbin;
    return () => null;
};

const useChartData = (rawData, chartType, config) => {
    return useMemo(() => {
        if (!rawData || !chartType) return null;
        const mapper = pickMapper(chartType);
        const mapped = mapper(rawData, config);
        return mapped;
    }, [rawData, chartType, config]);
};

export default useChartData;
