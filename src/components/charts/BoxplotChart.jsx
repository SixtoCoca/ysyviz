import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { applyCustomLegend } from './interface/applyCustomLegend';

const BoxplotChart = ({ data, config }) => {
    const svgRef = useRef();
    const { containerRef, dimensions } = useResponsiveChart();

    useEffect(() => {
        const rows = Array.isArray(data?.values) ? data.values : [];
        if (!rows.length) return;

        const parsed = rows
            .map(d => ({ g: String(d.group ?? 'Series').trim(), v: Number(d.value) }))
            .filter(d => d.g !== '' && Number.isFinite(d.v));
        if (!parsed.length) return;

        const grouped = d3.groups(parsed, d => d.g);

        const stats = grouped.map(([key, arr]) => {
            const values = arr.map(d => d.v).sort((a, b) => a - b);
            const q1 = d3.quantileSorted(values, 0.25) ?? 0;
            const q2 = d3.quantileSorted(values, 0.5) ?? 0;
            const q3 = d3.quantileSorted(values, 0.75) ?? 0;
            const iqr = q3 - q1;
            const m = Number.isFinite(Number(config?.iqr_multiplier)) ? Number(config.iqr_multiplier) : 1.5;
            const lowFence = q1 - m * iqr;
            const highFence = q3 + m * iqr;
            let lo = values[0];
            let hi = values[values.length - 1];
            for (let i = 0; i < values.length; i++) {
                if (values[i] >= lowFence) { lo = values[i]; break; }
            }
            for (let i = values.length - 1; i >= 0; i--) {
                if (values[i] <= highFence) { hi = values[i]; break; }
            }
            return { key, values, q1, q2, q3, lo, hi, lowFence, highFence };
        });

        const chartDims = getChartDimensions(dimensions.width, dimensions.height);
        const { width, height, margin } = chartDims;
        const { innerWidth, innerHeight } = chartDims;

        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
        clearSvg(svg);

        const palette = Array.isArray(config?.palette) && config.palette.length ? config.palette : null;
        const color = d3.scaleOrdinal(palette || d3.schemeCategory10).domain(stats.map(s => s.key));

        const x = d3.scaleBand().domain(stats.map(s => s.key)).range([0, innerWidth]).padding(0.3);

        const yMinData = d3.min(stats, s => s.lo) ?? 0;
        const yMaxData = d3.max(stats, s => s.hi) ?? 1;

        const yMin = Number.isFinite(Number(config?.y_min)) ? Number(config.y_min) : yMinData;
        const yMax = Number.isFinite(Number(config?.y_max)) ? Number(config.y_max) : yMaxData;

        const y = d3.scaleLinear().domain([yMin, yMax]).nice().range([innerHeight, 0]);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y).ticks(6));

        const boxes = g.append('g').selectAll('g.box').data(stats).join('g').attr('class', 'box');

        boxes.append('line')
            .attr('x1', d => (x(d.key) ?? 0) + x.bandwidth() / 2)
            .attr('x2', d => (x(d.key) ?? 0) + x.bandwidth() / 2)
            .attr('y1', d => y(d.lo))
            .attr('y2', d => y(d.hi))
            .attr('stroke', '#555')
            .append('title')
            .text(d => ['Whiskers', 'Low: ' + d.lo, 'High: ' + d.hi, 'Low fence: ' + d.lowFence, 'High fence: ' + d.highFence].join('\n'));

        boxes.append('rect')
            .attr('x', d => x(d.key) ?? 0)
            .attr('y', d => y(d.q3))
            .attr('width', x.bandwidth())
            .attr('height', d => Math.max(1, y(d.q1) - y(d.q3)))
            .attr('fill', d => color(d.key))
            .attr('fill-opacity', 0.6)
            .attr('stroke', '#333')
            .append('title')
            .text(d => [d.key, 'Q1: ' + d.q1, 'Median: ' + d.q2, 'Q3: ' + d.q3, 'Low fence: ' + d.lowFence, 'High fence: ' + d.highFence].join('\n'));

        const capW = Math.max(10, x.bandwidth() * 0.5);

        boxes.append('line')
            .attr('x1', d => (x(d.key) ?? 0) + x.bandwidth() / 2 - capW / 2)
            .attr('x2', d => (x(d.key) ?? 0) + x.bandwidth() / 2 + capW / 2)
            .attr('y1', d => y(d.lo))
            .attr('y2', d => y(d.lo))
            .attr('stroke', '#555');

        boxes.append('line')
            .attr('x1', d => (x(d.key) ?? 0) + x.bandwidth() / 2 - capW / 2)
            .attr('x2', d => (x(d.key) ?? 0) + x.bandwidth() / 2 + capW / 2)
            .attr('y1', d => y(d.hi))
            .attr('y2', d => y(d.hi))
            .attr('stroke', '#555');

        boxes.append('line')
            .attr('x1', d => x(d.key) ?? 0)
            .attr('x2', d => (x(d.key) ?? 0) + x.bandwidth())
            .attr('y1', d => y(d.q2))
            .attr('y2', d => y(d.q2))
            .attr('stroke', '#111');
            
        applyCustomLegend(g, config, innerWidth, innerHeight, false, 0);
    }, [data, config, dimensions]);

    const rows = Array.isArray(data?.values) ? data.values : [];
    if (!rows.length) return null;

    return (
        <div ref={containerRef} className='w-100 h-100'>
            <svg ref={svgRef} className='w-100 h-100' />
        </div>
    );
};

export default BoxplotChart;
