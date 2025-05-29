import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { addAxisLabels } from './interface/axisLabels';

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.values || data.values.length === 0) return;

    const { width, height, margin } = chartDimensions;
    const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

    const svg = d3.select(svgRef.current);
    clearSvg(svg);

    const x = d3.scaleBand()
      .domain(data.values.map(d => d.x))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.values, d => d.y)])
      .nice()
      .range([innerHeight, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("rect")
      .data(data.values)
      .join("rect")
      .attr("x", d => x(d.x))
      .attr("y", d => y(d.y))
      .attr("height", d => innerHeight - y(d.y))
      .attr("width", x.bandwidth())
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

    addAxisLabels(svg, data, { width, height });

    return () => {
      clearSvg(svg);
    };
  }, [data]);

  if (!data || !data.values || data.values.length === 0) return null;

  return <svg ref={svgRef} width={chartDimensions.width} height={chartDimensions.height}></svg>;
};

export default BarChart;
