import { useMemo, useEffect } from 'react';
import { ChartTypes } from '../../../constants/graph-type';
import { validateBar } from '../validators/validateBar';
import { validateLine } from '../validators/validateLine';
import { validatePie } from '../validators/validatePie';
import { validateScatter } from '../validators/validateScatter';
import { validateBubble } from '../validators/validateBubble';
import { validateHeat } from '../validators/validateHeat';
import { validateSankey } from '../validators/validateSankey';
import { validateChord } from '../validators/validateChord';
import { validateViolin } from '../validators/validateViolin';
import { validateBoxplot } from '../validators/validateBoxplot';
import { validateTreemap } from '../validators/validateTreemap';
import { validateSunburst } from '../validators/validateSunburst';
import { validateWaterfall } from '../validators/validateWaterfall';
import { validateCalendarHeatmap } from '../validators/validateCalendarHeatmap';
import { validatePyramid } from '../validators/pyramidValidator';
import useChartData from '../../data/hooks/useChartData';

const NullValidator = d => ({ data: d, issues: [] });

const Validators = {
    [ChartTypes.BAR]: validateBar,
    [ChartTypes.LINE]: validateLine,
    [ChartTypes.AREA]: validateLine,
    [ChartTypes.SCATTER]: validateScatter,
    [ChartTypes.BUBBLE]: validateBubble,
    [ChartTypes.PIE]: validatePie,
    [ChartTypes.DONUT]: validatePie,
    [ChartTypes.HEATMAP]: validateHeat,
    [ChartTypes.SANKEY]: validateSankey,
    [ChartTypes.CHORD]: validateChord,
    [ChartTypes.VIOLIN]: validateViolin,
    [ChartTypes.BOXPLOT]: validateBoxplot,
    [ChartTypes.TREEMAP]: validateTreemap,
    [ChartTypes.SUNBURST]: validateSunburst,
    [ChartTypes.WATERFALL]: validateWaterfall,
    [ChartTypes.CALENDAR]: validateCalendarHeatmap,
    [ChartTypes.PYRAMID]: validatePyramid
};

const useValidatedData = (rawData, chartType, onIssues, config) => {
    const mapped = useChartData(rawData, chartType, config);

    const { data, issues } = useMemo(() => {
        const validate = Validators[chartType] || NullValidator;
        return validate(mapped, config);
    }, [mapped, chartType, config]);

    useEffect(() => {
        if (typeof onIssues === 'function') onIssues(issues);
    }, [issues, onIssues]);

    return { data, issues };
};

export default useValidatedData;
