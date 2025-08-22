import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from 'd3-hexbin';
import { chartDimensions, getInnerSize, clearSvg } from '../interface/chartLayout';

const HexbinChart = ({ data, config }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data?.values?.length) return;

        const { width, height, margin } = chartDimensions;
        const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xVals = data.values.map(d => d.x).filter(Number.isFinite);
        const yVals = data.values.map(d => d.y).filter(Number.isFinite);

        if (!xVals.length || !yVals.length) return;

        const x = d3.scaleLinear().domain(d3.extent(xVals)).nice().range([0, innerWidth]);
        const y = d3.scaleLinear().domain(d3.extent(yVals)).nice().range([innerHeight, 0]);

        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y));

        const hexbin = d3Hexbin()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .radius(12)
            .extent([[0, 0], [innerWidth, innerHeight]]);

        const bins = hexbin(data.values).map(bin => ({ x: bin.x, y: bin.y, v: bin.length }));

        const vMax = d3.max(bins, d => d.v) || 1;
        const baseColor = config?.color || '#4682b4';
        const color = d3.scaleLinear().domain([0, vMax]).range([0.15, 1]);

        g.append('g')
            .selectAll('path.ncg-hexcell')
            .data(bins)
            .join('path')
            .attr('class', 'ncg-hexcell')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .attr('d', hexbin.hexagon())
            .attr('fill', baseColor)
            .attr('fill-opacity', d => color(d.v))
            .attr('stroke', config?.strokeColor || '#000')
            .attr('stroke-opacity', 0.25)
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

export default HexbinChart;
