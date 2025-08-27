import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { toNumber } from '../data/utils';

const ScatterChart = ({ data, config }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data?.values?.length) return;

        const rows = data.values
            .map(d => ({ x: toNumber(d.x), y: toNumber(d.y), label: d.label }))
            .filter(d => Number.isFinite(d.x) && Number.isFinite(d.y));
        if (!rows.length) return;

        const { width, height, margin } = chartDimensions;
        const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xMax = d3.max(rows, d => d.x) ?? 1;
        const yMax = d3.max(rows, d => d.y) ?? 1;

        const x = d3.scaleLinear().domain([0, xMax > 0 ? xMax : 1]).nice().range([0, innerWidth]);
        const y = d3.scaleLinear().domain([0, yMax > 0 ? yMax : 1]).nice().range([innerHeight, 0]);

        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y));

        const pointColor = config?.color || '#5563DE';
        const pointRadius = Number(config?.pointRadius) > 0 ? Number(config.pointRadius) : 3;

        g.selectAll('circle.ncg-point')
            .data(rows)
            .join('circle')
            .attr('class', 'ncg-point')
            .attr('cx', d => x(d.x))
            .attr('cy', d => y(d.y))
            .attr('r', pointRadius)
            .attr('fill', pointColor)
            .attr('opacity', 0.7)
            .style('pointer-events', 'none');
    }, [data, config]);

    if (!data?.values?.length) return null;

    return (
        <svg
            ref={svgRef}
            className='w-100 d-block'
            width={chartDimensions.width}
            height={chartDimensions.height}
            viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
            preserveAspectRatio='xMidYMid meet'
        />
    );
};

export default ScatterChart;
