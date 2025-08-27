import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { rowsOf, resolveFieldKey, toNumber } from '../data/utils';

const ParallelCordinatesCharts = ({ data, config }) => {
  const svgRef = useRef();
  const { containerRef, dimensions } = useResponsiveChart();

  useEffect(() => {
    const dims = Array.isArray(data?.dimensions) ? data.dimensions : [];
    const rows = Array.isArray(data?.rows) ? data.rows : [];
    if (dims.length < 2 || rows.length === 0) return;

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

    const x = d3.scalePoint().domain(dims).range([0, innerWidth]).padding(0.5);

    const y = {};
    for (const d of dims) {
      const [min, max] = data?.extentByDim?.[d] || [0, 1];
      const dom = min === max ? [min - 1, max + 1] : [min, max];
      y[d] = d3.scaleLinear().domain(dom).nice().range([innerHeight, 0]);
    }

    const strokeColor = config?.color || '#4682b4';
    const line = d3.line().defined(([, v]) => Number.isFinite(v));

    g.selectAll('path.ncg-parallel')
      .data(rows)
      .join('path')
      .attr('class', 'ncg-parallel')
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)
      .attr('d', d => line(dims.map(dim => [x(dim), y[dim](d.values[dim])])));

    const axes = g.append('g').attr('class', 'ncg-axes');

    axes
      .selectAll('g.ncg-axis')
      .data(dims)
      .join('g')
      .attr('class', 'ncg-axis')
      .attr('transform', d => `translate(${x(d)},0)`)
      .each(function (dim) {
        d3.select(this).call(d3.axisLeft(y[dim]));
      })
      .append('text')
      .attr('class', 'ncg-axis-label')
      .attr('x', 0)
      .attr('y', -12)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', '600')
      .attr('fill', '#333')
      .attr('pointer-events', 'none')
      .text(d => d);
  }, [data, config, dimensions]);

  if (!data?.rows?.length) return null;

  return (
    <div ref={containerRef} className='w-100 h-100'>
      <svg ref={svgRef} className='w-100 h-100' />
    </div>
  );
};

export default ParallelCordinatesCharts;
