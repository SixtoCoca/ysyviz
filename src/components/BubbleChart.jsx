import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, clearSvg } from './interface/chartLayout';

const BubbleChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.values || data.values.length === 0) return;

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

        const x = d3.scaleLinear()
            .domain(d3.extent(data.values, d => +d.x))
            .nice()
            .range([0, innerWidth]);

        const y = d3.scaleLinear()
            .domain(d3.extent(data.values, d => +d.y))
            .nice()
            .range([innerHeight, 0]);

        const r = d3.scaleSqrt()
            .domain([0, d3.max(data.values, d => +d.r || 1)])
            .range([4, 30]);

        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y));

        const tooltip = d3.select('body')
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "rgba(0, 0, 0, 0.7)")
            .style("color", "white")
            .style("padding", "5px")
            .style("border-radius", "4px")
            .style("pointer-events", "none");

        g.selectAll("circle")
            .data(data.values)
            .join("circle")
            .attr("cx", d => x(+d.x))
            .attr("cy", d => y(+d.y))
            .attr("r", d => r(+d.r || 1))
            .attr("fill", "steelblue")
            .attr("opacity", 0.7)
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible")
                    .text(`${data.xAxisLabel}: ${d.x}, ${data.yAxisLabel}: ${d.y}, Size: ${d.r}`);
            })
            .on("mousemove", (event) => {
                tooltip.style("top", `${event.pageY + 5}px`)
                    .style("left", `${event.pageX + 5}px`);
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .style("text-anchor", "middle")
            .text(data.xAxisLabel);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 15)
            .style("text-anchor", "middle")
            .text(data.yAxisLabel);

        return () => {
            clearSvg(svg);
            tooltip.remove();
        };
    }, [data]);

    if (!data || !data.values || data.values.length === 0) return null;

    return <svg ref={svgRef} />;
};

export default BubbleChart;
