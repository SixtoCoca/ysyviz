import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { getLegendPosition } from './interface/legendPosition';

const BubbleChart = ({ data, config }) => {
  const svgRef = useRef();
  const { containerRef, dimensions } = useResponsiveChart();

  useEffect(() => {
    const series = Array.isArray(data?.series) && data.series.length
      ? data.series
      : Array.isArray(data?.values) && data.values.length
        ? [{ id: 'series', values: data.values }]
        : [];

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

    const allX = series.flatMap(s => s.values.map(v => Number(v?.x)));
    const allY = series.flatMap(s => s.values.map(v => Number(v?.y)));
    const allR = series.flatMap(s => s.values.map(v => Number(v?.r)));

    const xExtent = d3.extent(allX);
    const yExtent = d3.extent(allY);
    const rExtent = d3.extent(allR);

    const x = d3.scaleLinear()
      .domain([xExtent[0] ?? 0, xExtent[1] ?? 0])
      .nice()
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([yExtent[0] ?? 0, yExtent[1] ?? 0])
      .nice()
      .range([innerHeight, 0]);

    const r = d3.scaleLinear()
      .domain([rExtent[0] ?? 0, rExtent[1] ?? 0])
      .range([3, 20]);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6));

    g.append('g')
      .call(d3.axisLeft(y).ticks(6));

    const palette = Array.isArray(config?.palette) && config.palette.length ? config.palette : null;
    const baseColor = config?.color || '#222';
    const color = palette ? d3.scaleOrdinal(palette) : () => baseColor;

    const hasMultipleSeries = data?.hasSeries && data?.seriesNames?.length > 1;

    series.forEach((s, i) => {
      const col = palette ? color(i) : baseColor;

      g.selectAll(`circle.bubble-${s.id ?? i}`)
        .data(s.values)
        .join('circle')
        .attr('cx', d => x(Number(d.x)))
        .attr('cy', d => y(Number(d.y)))
        .attr('r', d => r(Number(d.r)))
        .attr('fill', col)
        .attr('opacity', config?.opacity || 0.7)
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
    });

    if (hasMultipleSeries && data.seriesNames) {
      const legendPos = getLegendPosition(config?.legendPosition, innerWidth, innerHeight);
      if (legendPos) {
        const legend = g.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${legendPos.x}, ${legendPos.y})`);

        const legendItems = legend.selectAll('.legend-item')
          .data(data.seriesNames)
          .join('g')
          .attr('class', 'legend-item')
          .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legendItems.append('circle')
          .attr('cx', 8)
          .attr('cy', 0)
          .attr('r', 6)
          .attr('fill', (d, i) => palette ? color(i) : baseColor)
          .attr('opacity', config?.opacity || 0.7)
          .attr('stroke', 'white')
          .attr('stroke-width', 1);

        legendItems.append('text')
          .attr('x', 20)
          .attr('y', 0)
          .attr('dy', '0.35em')
          .style('font-size', '12px')
          .text(d => d);
      }
    }
  }, [data, config, dimensions]);

  return (
    <div ref={containerRef} className='w-100 h-100'>
      <svg ref={svgRef} className='w-100 h-100' />
    </div>
  );
};

export default BubbleChart;
