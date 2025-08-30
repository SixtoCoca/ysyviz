import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { getCustomLegendPosition, drawCustomLegend } from './interface/customLegend';

const PyramidChart = ({ data, config }) => {
    const svgRef = useRef();
    const { containerRef, dimensions } = useResponsiveChart();

    useEffect(() => {
        if (!data?.values?.length) return;

        const rows = data.values;
        
        if (!rows.length) return;

        const chartDims = getChartDimensions(dimensions.width, dimensions.height);
        const { width, height, margin } = chartDims;
        const { innerWidth, innerHeight } = chartDims;

        const svg = d3.select(svgRef.current);
        clearSvg(svg);
        svg.attr('width', width).attr('height', height);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const categories = Array.from(new Set(rows.map(d => d.y))).sort();
        const hasLeftData = rows.some(d => Number.isFinite(d.left) && d.left !== 0);
        const hasRightData = rows.some(d => Number.isFinite(d.right) && d.right !== 0);

        if (!hasLeftData && !hasRightData) return;

        const maxLeft = hasLeftData ? d3.max(rows, d => Math.abs(d.left || 0)) : 0;
        const maxRight = hasRightData ? d3.max(rows, d => Math.abs(d.right || 0)) : 0;
        const maxValue = Math.max(maxLeft, maxRight);

        const yScale = d3.scaleBand()
            .domain(categories)
            .range([0, innerHeight])
            .padding(0.1);

        const xScale = d3.scaleLinear()
            .domain([-maxValue, maxValue])
            .range([0, innerWidth]);

        const centerX = innerWidth / 2;

        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).tickFormat(d => Math.abs(d)));

        g.append('g')
            .call(d3.axisLeft(yScale));

        g.append('line')
            .attr('x1', centerX)
            .attr('y1', 0)
            .attr('x2', centerX)
            .attr('y2', innerHeight)
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3');

        const barWidth = yScale.bandwidth() * 0.8;

        if (hasLeftData) {
            g.selectAll('.left-bar')
                .data(rows.filter(d => Number.isFinite(d.left) && d.left !== 0))
                .enter()
                .append('rect')
                .attr('class', 'left-bar')
                .attr('x', d => xScale(-Math.abs(d.left)))
                .attr('y', d => yScale(d.y) + (yScale.bandwidth() - barWidth) / 2)
                .attr('width', d => centerX - xScale(-Math.abs(d.left)))
                .attr('height', barWidth)
                .attr('fill', config?.leftColor || '#ff6b6b')
                .attr('opacity', 0.8);
        }

        if (hasRightData) {
            g.selectAll('.right-bar')
                .data(rows.filter(d => Number.isFinite(d.right) && d.right !== 0))
                .enter()
                .append('rect')
                .attr('class', 'right-bar')
                .attr('x', centerX)
                .attr('y', d => yScale(d.y) + (yScale.bandwidth() - barWidth) / 2)
                .attr('width', d => xScale(Math.abs(d.right)) - centerX)
                .attr('height', barWidth)
                .attr('fill', config?.rightColor || '#4ecdc4')
                .attr('opacity', 0.8);
        }

        if (config?.customLegend) {
            const customPos = getCustomLegendPosition(config, innerWidth, innerHeight, false, 0);
            drawCustomLegend(g, config.customLegend, customPos.x, customPos.y);
        }
    }, [data, config, dimensions]);

    if (!data?.values?.length) return null;

    return (
        <div ref={containerRef} className='w-100 h-100'>
            <svg ref={svgRef} className='w-100 h-100' />
        </div>
    );
};

export default PyramidChart;
