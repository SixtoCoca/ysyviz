import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { toNumber } from '../data/utils';
import { drawLinearLegend } from './interface/colorLegend';

const HeatmapChart = ({ data, config }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data?.values?.length) return;

        const { width, height, margin } = chartDimensions;
        const { innerWidth, innerHeight } = getInnerSize(chartDimensions);
        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const g = svg
            .attr('width', width)
            .attr('height', height + 60)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xValues = Array.from(new Set(data.values.map(d => d.x)));
        const yValues = Array.from(new Set(data.values.map(d => d.y)));

        const x = d3.scaleBand().domain(xValues).range([0, innerWidth]).padding(0.05);
        const y = d3.scaleBand().domain(yValues).range([0, innerHeight]).padding(0.05);

        const minVal = d3.min(data.values, d => toNumber(d.value)) ?? 0;
        const maxVal = d3.max(data.values, d => toNumber(d.value)) ?? 1;

        const base = config?.color || '#5563DE';
        const color = d3.scaleSequential().domain([minVal, maxVal]).interpolator(t => d3.interpolateRgb('#ffffff', base)(t));

        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y));

        g.selectAll('rect.cell')
            .data(data.values)
            .join('rect')
            .attr('class', 'cell')
            .attr('x', d => x(d.x))
            .attr('y', d => y(d.y))
            .attr('width', x.bandwidth())
            .attr('height', y.bandwidth())
            .attr('fill', d => color(toNumber(d.value)));

        const legendWidth = 200;
        const legendHeight = 10;
        const legendX = (width - legendWidth) / 2;
        const legendY = height + 20;

        drawLinearLegend(svg, {
            x: legendX,
            y: legendY,
            width: legendWidth,
            height: legendHeight,
            scale: v => color(v),
            domain: [minVal, maxVal],
            ticks: 5,
            gradientId: 'heatmap-gradient'
        });
    }, [data, config]);

    return (
        <svg
            ref={svgRef}
            className='w-100 d-block'
            width={chartDimensions.width}
            height={chartDimensions.height + 60}
        />
    );
};

export default HeatmapChart;
