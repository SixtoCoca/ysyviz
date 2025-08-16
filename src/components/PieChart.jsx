import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, clearSvg } from './interface/chartLayout';
import useValidatedData from './config/hooks/useValidatedData';

const PieChart = ({ data, isDonut = false, config }) => {
  const svgRef = useRef();

  const { data: valid } = useValidatedData(
    data,
    'pie',
    issues => {
      console.log('[PieChart] validation issues:', issues);
      if (typeof config?.onValidation === 'function') config.onValidation(issues);
    },
    config
  );

  useEffect(() => {
    if (!valid || !valid.values || valid.values.length === 0) return;

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
    const pie = d3.pie().value(d => d.value);
    const inner = isDonut ? Math.max(0, radius * 0.55) : 0;

    const arcGen = d3.arc().outerRadius(radius - 10).innerRadius(inner);
    const arcLabel = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    const arcs = container
      .selectAll('.arc')
      .data(pie(valid.values))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arcGen)
      .attr('fill', (d, i) => color(i))
      .on('mouseover', (event, d) => {
        tooltip.style('visibility', 'visible').text(`${d.data.label}: ${d.data.value}`);
      })
      .on('mousemove', event => {
        tooltip.style('top', `${event.pageY + 5}px`).style('left', `${event.pageX + 5}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    arcs
      .append('text')
      .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(d => d.data.label);

    return () => {
      clearSvg(svg);
      tooltip.remove();
    };
  }, [valid, isDonut, config]);

  if (!valid || !valid.values || valid.values.length === 0) return null;

  return <svg ref={svgRef} />;
};

export default PieChart;
