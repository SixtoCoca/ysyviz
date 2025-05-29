import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { addAxisLabels } from './interface/axisLabels';

const ScatterChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.values || data.values.length === 0) return;

        const { width, height, margin } = chartDimensions;
        const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([
                d3.min(data.values, d => +d.x),
                d3.max(data.values, d => +d.x)
            ])
            .nice()
            .range([0, innerWidth]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data.values, d => +d.y)])
            .nice()
            .range([innerHeight, 0]);

        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        g.selectAll("circle")
            .data(data.values)
            .join("circle")
            .attr("cx", d => x(+d.x))
            .attr("cy", d => y(+d.y))
            .attr("r", 3)
            .attr("fill", "steelblue")
            .attr("opacity", 0.7);

        addAxisLabels(svg, data, { width, height });

        return () => {
            clearSvg(svg);
        };
    }, [data]);

    if (!data || !data.values || data.values.length === 0) return null;

    return <svg ref={svgRef} width={chartDimensions.width} height={chartDimensions.height} />;
};

export default ScatterChart;
