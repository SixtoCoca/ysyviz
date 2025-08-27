import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { toNumber } from '../data/utils';

const ScatterChart = ({ data, config }) => {
    const svgRef = useRef();

    useEffect(() => {
        let allPoints = [];
        
        if (data?.hasSeries && data?.series?.length) {
            allPoints = data.series.flatMap(s => s.values || []);
        } else if (data?.values?.length) {
            allPoints = data.values;
        }
        
        const rows = allPoints
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

        const hasMultipleSeries = data?.hasSeries && data?.seriesNames?.length > 1;
        const pointRadius = Number(config?.pointRadius) > 0 ? Number(config.pointRadius) : 3;
        
        let color;
        if (hasMultipleSeries) {
            const colorRange = config?.palette && Array.isArray(config.palette) && config.palette.length > 0 
                ? config.palette 
                : ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
            color = d3.scaleOrdinal().domain(data.seriesNames).range(colorRange);
        } else {
            color = () => config?.color || '#5563DE';
        }

        if (hasMultipleSeries) {
            data.series.forEach(series => {
                const seriesPoints = series.values
                    .map(d => ({ x: toNumber(d.x), y: toNumber(d.y), label: d.label }))
                    .filter(d => Number.isFinite(d.x) && Number.isFinite(d.y));
                
                g.selectAll(`circle.ncg-point-${series.id}`)
                    .data(seriesPoints)
                    .join('circle')
                    .attr('class', `ncg-point-${series.id}`)
                    .attr('cx', d => x(d.x))
                    .attr('cy', d => y(d.y))
                    .attr('r', pointRadius)
                    .attr('fill', color(series.id))
                    .attr('opacity', 0.7)
                    .style('pointer-events', 'none');
            });

            const legend = g.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(${innerWidth - 120}, 20)`);

            const legendItems = legend.selectAll('.legend-item')
                .data(data.seriesNames)
                .join('g')
                .attr('class', 'legend-item')
                .attr('transform', (d, i) => `translate(0, ${i * 20})`);

            legendItems.append('circle')
                .attr('cx', 6)
                .attr('cy', 6)
                .attr('r', 6)
                .attr('fill', d => color(d));

            legendItems.append('text')
                .attr('x', 18)
                .attr('y', 9)
                .style('font-size', '12px')
                .style('alignment-baseline', 'middle')
                .text(d => d);
        } else {
            g.selectAll('circle.ncg-point')
                .data(rows)
                .join('circle')
                .attr('class', 'ncg-point')
                .attr('cx', d => x(d.x))
                .attr('cy', d => y(d.y))
                .attr('r', pointRadius)
                .attr('fill', color())
                .attr('opacity', 0.7)
                .style('pointer-events', 'none');
        }
    }, [data, config]);

    if (!data?.values?.length && !data?.series?.length) return null;

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
