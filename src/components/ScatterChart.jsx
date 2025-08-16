import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { addAxisLabels } from './interface/axisLabels';
import useValidatedData from './config/hooks/useValidatedData';

const ScatterChart = ({ data, config }) => {
    const svgRef = useRef();
    const { data: valid } = useValidatedData(
        data,
        'scatter',
        issues => {
            console.log('[ScatterChart] validation issues:', issues);
            if (typeof config?.onValidation === 'function') config.onValidation(issues);
        },
        config
    );

    useEffect(() => {
        if (!valid || !valid.values || valid.values.length === 0) return;

        const { width, height, margin } = chartDimensions;
        const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().domain(d3.extent(valid.values, d => +d.x)).nice().range([0, innerWidth]);
        const yMax = d3.max(valid.values, d => +d.y) ?? 0;
        const y = d3.scaleLinear().domain([0, yMax === 0 ? 1 : yMax]).nice().range([innerHeight, 0]);

        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y));

        const pointColor = config?.color || 'steelblue';

        g.selectAll('circle')
            .data(valid.values)
            .join('circle')
            .attr('cx', d => x(+d.x))
            .attr('cy', d => y(+d.y))
            .attr('r', 3)
            .attr('fill', pointColor)
            .attr('opacity', 0.7);

        addAxisLabels(svg, data, { width, height });

        return () => {
            clearSvg(svg);
        };
    }, [valid, data, config]);

    if (!valid || !valid.values || valid.values.length === 0) return null;

    return <svg ref={svgRef} width={chartDimensions.width} height={chartDimensions.height} />;
};

export default ScatterChart;
