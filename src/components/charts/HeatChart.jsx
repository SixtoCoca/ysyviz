import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { drawLinearLegend } from './interface/colorLegend';

const HeatChart = ({ data, config }) => {
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
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xCategories = Array.from(new Set(data.values.map(d => d.x)));
    const yCategories = Array.from(new Set(data.values.map(d => d.y)));

    const x = d3.scaleBand()
      .domain(xCategories)
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleBand()
      .domain(yCategories)
      .range([0, innerHeight])
      .padding(0.1);

    const values = data.values.map(d => d.value);
    const minVal = d3.min(values);
    const maxVal = d3.max(values);
    const baseColor = config?.color || '#5563DE';
    const color = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(t => d3.interpolateRgb('#ffffff', baseColor)(t));

    g.selectAll('rect')
      .data(data.values)
      .join('rect')
      .attr('x', d => x(d.x))
      .attr('y', d => y(d.y))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => color(d.value))
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y));

    const legendWidth = 200;
    const legendHeight = 10;
    const legendX = (innerWidth - legendWidth) / 2;
    const legendY = innerHeight + 20;

    drawLinearLegend(svg, {
      x: margin.left + legendX,
      y: margin.top + legendY,
      width: legendWidth,
      height: legendHeight,
      scale: v => color(v),
      domain: [minVal, maxVal],
      ticks: 5,
      gradientId: 'heatmap-gradient'
    });
  }, [data, config, dimensions]);

  if (!data?.values?.length) return null;

  return (
    <div ref={containerRef} className='w-100 h-100'>
      <svg ref={svgRef} className='w-100 h-100' />
    </div>
  );
};

export default HeatChart;
