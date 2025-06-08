import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { addAxisLabels } from './interface/axisLabels';

const HeatmapChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.values || data.values.length === 0) return;

        const { width, height, margin } = chartDimensions;
        const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const g = svg
            .attr('width', width)
            .attr('height', height + 60) // espacio adicional para la leyenda
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xValues = Array.from(new Set(data.values.map(d => d.x)));
        const yValues = Array.from(new Set(data.values.map(d => d.y)));

        const xScale = d3.scaleBand()
            .domain(xValues)
            .range([0, innerWidth])
            .padding(0.05);

        const yScale = d3.scaleBand()
            .domain(yValues)
            .range([0, innerHeight])
            .padding(0.05);

        const maxVal = d3.max(data.values, d => d.value);
        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateYlGnBu)
            .domain([0, maxVal]);

        g.selectAll()
            .data(data.values)
            .join('rect')
            .attr('x', d => xScale(d.x))
            .attr('y', d => yScale(d.y))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', d => colorScale(d.value));

        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale));

        g.append('g')
            .call(d3.axisLeft(yScale));

        addAxisLabels(svg, data, chartDimensions);

        const legendWidth = 200;
        const legendHeight = 10;
        const legendX = (width - legendWidth) / 2;

        const legend = svg.append("g")
            .attr("transform", `translate(${legendX}, ${height + 20})`);

        const gradientId = "heatmap-gradient";

        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", gradientId)
            .attr("x1", "0%")
            .attr("x2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", colorScale(0));

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", colorScale(maxVal));

        legend.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", `url(#${gradientId})`);

        const legendScale = d3.scaleLinear()
            .domain([0, maxVal])
            .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
            .ticks(5)
            .tickSize(legendHeight);

        legend.append("g")
            .attr("transform", `translate(0, ${legendHeight})`)
            .call(legendAxis)
            .select(".domain").remove();

        return () => {
            clearSvg(svg);
        };
    }, [data]);

    if (!data || !data.values || data.values.length === 0) return null;

    return <svg ref={svgRef} />;
};

export default HeatmapChart;
