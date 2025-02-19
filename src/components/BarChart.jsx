import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BarChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.values || data.values.length === 0) return;

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const x = d3.scaleBand()
      .domain(data.values.map(d => d.x))
      .range([margin.left, width - margin.right])
      .padding(0.1);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data.values, d => d.y)])
      .range([height - margin.bottom, margin.top]);
    
    svg.selectAll("rect")
      .data(data.values)
      .join("rect")
      .attr("x", d => x(d.x))
      .attr("y", d => y(d.y))
      .attr("height", d => y(0) - y(d.y))
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue");
    
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
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

  return <svg ref={svgRef} width="500" height="300"></svg>;
}

export default BarChart; 