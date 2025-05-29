import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { addAxisLabels } from './interface/axisLabels';

const LineChart = ({ data, filled = false }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.values || data.values.length === 0) return;

    const { width, height, margin } = chartDimensions;
    const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

    const svg = d3.select(svgRef.current);
    clearSvg(svg);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.values.map(d => d.x))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.values, d => d.y)])
      .nice()
      .range([innerHeight, 0]);

    const line = d3.line()
      .x(d => x(d.x) + x.bandwidth() / 2)
      .y(d => y(d.y));

    const area = d3.area()
      .x(d => x(d.x) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1(d => y(d.y));

    if (filled) {
      g.append("path")
        .datum(data.values)
        .attr("fill", "lightsteelblue")
        .attr("d", area);
    }

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

    addAxisLabels(svg, data, { width, height });

    return () => {
      clearSvg(svg);
    };
  }, [data, filled]);

  if (!data || !data.values || data.values.length === 0) return null;

  return <svg ref={svgRef} width={chartDimensions.width} height={chartDimensions.height} />;
};

export default LineChart;
