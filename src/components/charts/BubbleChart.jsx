import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { toNumber, rowsOf, resolveFieldKey, norm } from '../data/utils';

const BubbleChart = ({ data, config }) => {
    const svgRef = useRef();

    useEffect(() => {
        const rows = rowsOf(data);
        if (!rows.length) return;

        const sample = rows[0] || {};
        const xKey = resolveFieldKey(sample, config?.field_x, ['x']);
        const yKey = resolveFieldKey(sample, config?.field_y, ['y']);
        const rKey = resolveFieldKey(sample, config?.field_r, ['r', 'size', 'value']);
        const labelKey = resolveFieldKey(sample, config?.field_label, ['label']);

        const values = rows
            .map(r => ({
                x: toNumber(r?.[xKey]),
                y: toNumber(r?.[yKey]),
                r: toNumber(r?.[rKey]),
                label: labelKey ? norm(r?.[labelKey]) : undefined
            }))
            .filter(d => Number.isFinite(d.x) && Number.isFinite(d.y) && Number.isFinite(d.r) && d.r >= 0);

        if (!values.length) return;

        const { width, height, margin } = chartDimensions;
        const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xMax = d3.max(values, d => d.x) || 1;
        const yMax = d3.max(values, d => d.y) || 1;
        const rMax = d3.max(values, d => d.r) || 1;

        const x = d3.scaleLinear().domain([0, xMax]).nice().range([0, innerWidth]);
        const y = d3.scaleLinear().domain([0, yMax]).nice().range([innerHeight, 0]);
        const r = d3.scaleSqrt().domain([0, rMax]).range([4, 30]);

        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y));

        const baseColor = config?.color || '#4682b4';

        g.selectAll('circle.ncg-bubble')
            .data(values)
            .join('circle')
            .attr('class', 'ncg-bubble')
            .attr('cx', d => x(d.x))
            .attr('cy', d => y(d.y))
            .attr('r', d => r(d.r))
            .attr('fill', baseColor)
            .attr('opacity', 0.7)
            .attr('stroke', config?.strokeColor || 'black')
            .attr('stroke-opacity', 0.4)
            .attr('pointer-events', 'none');
    }, [data, config]);

    if (!data?.values?.length && !Array.isArray(data)) return null;

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

export default BubbleChart;
