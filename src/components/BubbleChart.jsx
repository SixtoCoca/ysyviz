import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, clearSvg } from './interface/chartLayout';
import useValidatedData from './config/hooks/useValidatedData';

const BubbleChart = ({ data, config }) => {
    const svgRef = useRef();

    const { data: valid } = useValidatedData(
        data,
        'bubble',
        issues => {
            console.log('[BubbleChart] validation issues:', issues);
            if (typeof config?.onValidation === 'function') config.onValidation(issues);
        },
        config
    );

    useEffect(() => {
        if (!valid || !valid.values || valid.values.length === 0) return;

        const { width, height, margin } = chartDimensions;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const extX = d3.extent(valid.values, d => d.x);
        const extY = d3.extent(valid.values, d => d.y);
        const pad = v => (v === 0 ? 1 : Math.max(1, Math.abs(v) * 0.05));
        const domainX = extX[0] === extX[1] ? [extX[0] - pad(extX[0]), extX[1] + pad(extX[1])] : extX;
        const domainY = extY[0] === extY[1] ? [extY[0] - pad(extY[0]), extY[1] + pad(extY[1])] : extY;

        const x = d3.scaleLinear().domain(domainX).nice().range([0, innerWidth]);
        const y = d3.scaleLinear().domain(domainY).nice().range([innerHeight, 0]);

        const maxR = d3.max(valid.values, d => d.r || 1) || 1;
        const r = d3.scaleSqrt().domain([0, maxR]).range([4, 30]);

        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y));

        const sizeLabel = data?.rLabel || config?.rLabel || 'Size';

        const fill = config?.color ? () => config.color : i => d3.schemeCategory10[i % 10];

        const nodes = g.selectAll('circle')
            .data(valid.values)
            .join('circle')
            .attr('cx', d => x(d.x))
            .attr('cy', d => y(d.y))
            .attr('r', d => r(d.r || 1))
            .style('r', d => `${r(d.r || 1)}`)
            .attr('fill', (d, i) => fill(i))
            .attr('opacity', 0.7)
            .style('transform', 'none');

        nodes.append('title').text(d => `${sizeLabel}: ${d.r ?? 0}`);
    }, [valid, data, config]);

    if (!valid || !valid.values || valid.values.length === 0) return null;

    return <svg ref={svgRef} width={chartDimensions.width} height={chartDimensions.height} />;
};

export default BubbleChart;
