import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from 'd3-hexbin';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { applyCustomLegend } from './interface/applyCustomLegend';

const HexbinChart = ({ data, config }) => {
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

    const allX = data.values.map(d => Number(d.x));
    const allY = data.values.map(d => Number(d.y));

    const x = d3.scaleLinear()
      .domain([d3.min(allX), d3.max(allX)])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([d3.min(allY), d3.max(allY)])
      .range([innerHeight, 0]);

    const hexbin = d3Hexbin()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .radius(10)
      .extent([[0, 0], [innerWidth, innerHeight]]);

    const bins = hexbin(data.values);

    const baseColor = config?.color || '#4682b4';
    const color = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)])
      .range(['#ffffff', baseColor]);

    g.selectAll('path')
      .data(bins)
      .join('path')
      .attr('d', hexbin.hexagon())
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('fill', d => color(d.length))
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y));
      
    applyCustomLegend(g, config, innerWidth, innerHeight, false, 0);
  }, [data, config, dimensions]);

  if (!data?.values?.length) return null;

  return (
    <div ref={containerRef} className='w-100 h-100'>
      <svg ref={svgRef} className='w-100 h-100' />
    </div>
  );
};

export default HexbinChart;
