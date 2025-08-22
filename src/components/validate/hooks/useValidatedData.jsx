import { useMemo, useEffect } from 'react';
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
import { validateHexbin } from '../validators/validateHexbin';
import useChartData from '../../data/hooks/useChartData';

const pickValidator = type => {
    if (type === 'bar') return validateBar;
    if (type === 'line') return validateLine;
    if (type === 'area') return validateLine;
    if (type === 'pie') return validatePie;
    if (type === 'donut') return validatePie;
    if (type === 'scatter') return validateScatter;
    if (type === 'bubble') return validateBubble;
    if (type === 'heatmap') return validateHeat;
    if (type === 'sankey') return validateSankey;
    if (type === 'chord') return validateChord;
    if (type === 'violin') return validateViolin;
    if (type === 'boxplot') return validateBoxplot;
    if (type === 'hexbin') return validateHexbin;
    return d => ({ data: d, issues: [] });
};

const useValidatedData = (rawData, chartType, onIssues, config) => {
    const mapped = useChartData(rawData, chartType, config);
    const { data, issues } = useMemo(() => {
        const validator = pickValidator(chartType);
        const res = validator(mapped, config);
        return res;
    }, [mapped, chartType, config]);

    useEffect(() => {
        if (typeof onIssues === 'function') onIssues(issues);
    }, [issues, onIssues]);

    return { data, issues };
};

export default useValidatedData;
