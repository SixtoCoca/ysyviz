import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';

const WaterfallChart = ({ data, config }) => {
    const svgRef = useRef();
    const { containerRef, dimensions } = useResponsiveChart();

    useEffect(() => {
        if (!data?.steps?.length) return;

        const chartDims = getChartDimensions(dimensions.width, dimensions.height);
        const { width, height, margin } = chartDims;
        const { innerWidth, innerHeight } = chartDims;

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const labels = data.steps.map(d => d.label);
        const minY = Math.min(0, d3.min(data.steps, d => Math.min(d.y0, d.y1)) ?? 0);
        const maxY = Math.max(0, d3.max(data.steps, d => Math.max(d.y0, d.y1)) ?? 0);

        const x = d3.scaleBand().domain(labels).range([0, innerWidth]).padding(0.2);
        const y = d3.scaleLinear().domain([minY, maxY]).nice().range([innerHeight, 0]);

        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y));

        const colorPos = config?.colorPositive || '#2ca02c';
        const colorNeg = config?.colorNegative || '#d62728';
        const colorTot = config?.colorTotal || '#1f77b4';

        g.selectAll('rect.ncg-waterfall')
            .data(data.steps)
            .join('rect')
            .attr('class', 'ncg-waterfall')
            .attr('x', d => x(d.label))
            .attr('y', d => y(Math.max(d.y0, d.y1)))
            .attr('width', x.bandwidth())
            .attr('height', d => Math.abs(y(d.y0) - y(d.y1)))
            .attr('fill', d => d.type === 'total' ? colorTot : d.delta >= 0 ? colorPos : colorNeg)
            .attr('opacity', 0.9);

        g.selectAll('line.ncg-connector')
            .data(data.steps.slice(1))
            .join('line')
            .attr('class', 'ncg-connector')
            .attr('x1', d => (x(d.label) ?? 0))
            .attr('x2', d => (x(d.label) ?? 0) - x.bandwidth() * 0.2)
            .attr('y1', d => y(d.y0))
            .attr('y2', d => y(d.y0))
            .attr('stroke', '#999')
            .attr('stroke-dasharray', '4 2');

        config.showValues = true
        if (config?.showValues) {
            const fmt = d3.format(config?.valueFormat || ',.2f');

            g.selectAll('text.ncg-waterfall-delta')
                .data(data.steps.filter(d => d.type !== 'total'))
                .join('text')
                .attr('class', 'ncg-waterfall-delta')
                .attr('x', d => (x(d.label) ?? 0) + x.bandwidth() / 2)
                .attr('y', d => y(Math.max(d.y0, d.y1)) - 6)
                .attr('text-anchor', 'middle')
                .attr('font-size', 12)
                .attr('fill', d => d.delta >= 0 ? colorPos : colorNeg)
                .text(d => `${d.delta >= 0 ? '+' : ''}${fmt(d.delta)}`);

            g.selectAll('text.ncg-waterfall-total')
                .data(data.steps.filter(d => d.type === 'total'))
                .join('text')
                .attr('class', 'ncg-waterfall-total')
                .attr('x', d => (x(d.label) ?? 0) + x.bandwidth() / 2)
                .attr('y', d => y(Math.max(d.y0, d.y1)) - 6)
                .attr('text-anchor', 'middle')
                .attr('font-size', 12)
                .attr('fill', colorTot)
                .text(d => fmt(d.y1));
        }
    }, [data, config, dimensions]);

    if (!data?.steps?.length) return null;

    return (
        <div ref={containerRef} className='w-100 h-100'>
            <svg ref={svgRef} className='w-100 h-100' />
        </div>
    );
};

export default WaterfallChart;
