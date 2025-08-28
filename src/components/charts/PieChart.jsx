import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { drawCustomLegend, getCustomLegendPosition } from './interface/customLegend';

const PieChart = ({ data, config, isDonut = false }) => {
  const svgRef = useRef();
  const { containerRef, dimensions } = useResponsiveChart();

  useEffect(() => {
    if (!data?.values?.length) return;

    const chartDims = getChartDimensions(dimensions.width, dimensions.height);
    const { width, height, margin } = chartDims;
    const { innerWidth, innerHeight } = chartDims;

    const svg = d3.select(svgRef.current);
    clearSvg(svg);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const radius = Math.min(innerWidth, innerHeight) / 2;
    const donutHolePercent = config?.donutHole || 55;
    const donutHole = donutHolePercent / 100;
    const innerRadius = isDonut ? radius * donutHole : 0;

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const palette = Array.isArray(config?.palette) && config.palette.length ? config.palette : null;
    const color = palette ? d3.scaleOrdinal(palette) : d3.scaleOrdinal(d3.schemeCategory10);

    const arcs = g.selectAll('path')
      .data(pie(data.values))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    const labelRadius = innerRadius + (radius - innerRadius) * 0.6;
    const labelArc = d3.arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    g.selectAll('text')
      .data(pie(data.values))
      .join('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .text(d => d.data.label);
      
    if (config?.customLegend) {
      const customPos = getCustomLegendPosition(config, width, height, false, 0);
      drawCustomLegend(g, config.customLegend, customPos.x - width/2, customPos.y - height/2);
    }
  }, [data, config, dimensions, isDonut]);

  if (!data?.values?.length) return null;

  return (
    <div ref={containerRef} className='w-100 h-100'>
      <svg ref={svgRef} className='w-100 h-100' />
    </div>
  );
};

export default PieChart;
