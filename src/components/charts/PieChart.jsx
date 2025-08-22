import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, clearSvg } from './interface/chartLayout';

const PieChart = ({ data, isDonut = false, config }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data?.values?.length) {
      return;
    }

    const { width, height } = chartDimensions;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current);
    clearSvg(svg);

    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const palette = Array.isArray(config?.palette) && config.palette.length ? config.palette : null;
    const color = d3.scaleOrdinal(palette || d3.schemeCategory10);

    const pie = d3.pie().value(d => d.value);
    const holePct = typeof config?.donutHole === 'number' ? Math.max(0, Math.min(80, config.donutHole)) : 55;
    const inner = isDonut ? radius * (holePct / 100) : 0;

    const arcGen = d3.arc().outerRadius(radius - 10).innerRadius(inner);
    const arcLabel = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);

    let tooltip = d3.select('body').select('#chart-tooltip');
    if (tooltip.empty()) {
      tooltip = d3.select('body').append('div').attr('id', 'chart-tooltip').attr('class', 'chart-tooltip');
    }

    const pieData = pie(data.values);

    const arcs = container
      .selectAll('.arc')
      .data(pieData)
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
        tooltip.style('top', `${event.pageY + 6}px`).style('left', `${event.pageX + 8}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    arcs
      .append('text')
      .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.label);

    return () => {
      clearSvg(svg);
    };
  }, [data, isDonut, config]);

  if (!data?.values?.length) return null;

  return <svg ref={svgRef} className='w-100 d-block' width={chartDimensions.width} height={chartDimensions.height} />;
};

export default PieChart;
