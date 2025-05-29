import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, clearSvg } from './interface/chartLayout';

const PieChart = ({ data, isDonut = false }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.values || data.values.length === 0) return;

    const { width, height } = chartDimensions;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current);
    clearSvg(svg);

    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value(d => d.y);
    const sizeCenter = isDonut ? 100 : 0;

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(sizeCenter);

    const arcLabel = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

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

    const arcs = container.selectAll('.arc')
      .data(pie(data.values))
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .on('mouseover', (event, d) => {
        tooltip.style("visibility", "visible")
          .text(`${d.data.x}: ${d.data.y}`);
      })
      .on('mousemove', (event) => {
        tooltip.style("top", `${event.pageY + 5}px`)
          .style("left", `${event.pageX + 5}px`);
      })
      .on('mouseout', () => {
        tooltip.style("visibility", "hidden");
      });

    arcs.append('text')
      .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(d => d.data.x);

    return () => {
      clearSvg(svg);
      tooltip.remove();
    };
  }, [data, isDonut]);

  if (!data || !data.values || data.values.length === 0) return null;

  return <svg ref={svgRef} />;
};

export default PieChart;
