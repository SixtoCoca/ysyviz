import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function LineChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.values || data.values.length === 0) return;

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleBand()
      .domain(data.values.map(d => d.x))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.values, d => d.y)])
      .range([innerHeight, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const line = d3.line()
      .x(d => x(d.x) + x.bandwidth() / 2)
      .y(d => y(d.y));

    g.append("path")
      .datum(data.values)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    g.selectAll("circle")
      .data(data.values)
      .join("circle")
      .attr("cx", d => x(d.x) + x.bandwidth() / 2)
      .attr("cy", d => y(d.y))
      .attr("r", 4)
      .attr("fill", "steelblue");

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    g.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .style("text-anchor", "middle")
      .text(data.xAxisLabel);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 15)
      .style("text-anchor", "middle")
      .text(data.yAxisLabel);

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  if (!data || !data.values || data.values.length === 0) return null;

  return <svg ref={svgRef} width="600" height="400"></svg>;
}

export default LineChart; 