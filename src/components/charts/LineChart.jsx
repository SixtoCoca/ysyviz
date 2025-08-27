import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';

const LineChart = ({ data, config, filled = false }) => {
  const svgRef = useRef();

  useEffect(() => {
    const series = Array.isArray(data?.series) && data.series.length
      ? data.series
      : Array.isArray(data?.values) && data.values.length
        ? [{ id: 'series', values: data.values }]
        : [];

    const { width, height, margin } = chartDimensions;
    const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

    const svg = d3.select(svgRef.current);
    clearSvg(svg);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const allX = series.flatMap(s => s.values.map(v => v?.x));
    const allY = series.flatMap(s => s.values.map(v => Number(v?.y)));

    const xIsNumeric = allX.every(v => v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v)));

    const yExtent = d3.extent(allY);
    const yMin = Math.min(0, yExtent[0] ?? 0);
    const yMax = yExtent[1] ?? 0;

    let x;
    if (xIsNumeric) {
      const xNum = allX.map(v => Number(v));
      const xMax = d3.max(xNum) ?? 0;
      x = d3.scaleLinear().domain([0, xMax]).nice().range([0, innerWidth]);
    } else {
      const xDomain = Array.from(new Set(allX.map(String)));
      x = d3.scalePoint().domain(xDomain).range([0, innerWidth]).padding(0.5);
    }

    const y = d3.scaleLinear().domain([yMin, yMax]).nice().range([innerHeight, 0]);

    const xAxis = xIsNumeric ? d3.axisBottom(x).ticks(6) : d3.axisBottom(x);
    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(xAxis);
    g.append('g').call(d3.axisLeft(y));

    const palette = Array.isArray(config?.palette) && config.palette.length ? config.palette : null;
    const baseColor = config?.color || '#222';
    const color = palette ? d3.scaleOrdinal(palette) : () => baseColor;

    const xPos = d => {
      if (xIsNumeric) return x(Number(d.x));
      const v = x(String(d.x));
      return v == null ? 0 : v;
    };

    const line = d3
      .line()
      .defined(d => d.x !== undefined && d.x !== null && d.x !== '' && Number.isFinite(Number(d.y)))
      .x(d => xPos(d))
      .y(d => y(Number(d.y)));

    const area = d3
      .area()
      .defined(d => d.x !== undefined && d.x !== null && d.x !== '' && Number.isFinite(Number(d.y)))
      .x(d => xPos(d))
      .y0(() => y(0))
      .y1(d => y(Number(d.y)));

    series.forEach((s, i) => {
      const col = palette ? color(i) : baseColor;

      if (filled) {
        g.append('path')
          .datum(s.values)
          .attr('d', area)
          .attr('fill', col)
          .attr('opacity', 0.2);
      }

      g.append('path')
        .datum(s.values)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', col)
        .attr('stroke-width', 2);

      g.selectAll(`circle.dot-${s.id ?? i}`)
        .data(s.values)
        .join('circle')
        .attr('cx', d => xPos(d))
        .attr('cy', d => y(Number(d.y)))
        .attr('r', 3)
        .attr('fill', col);
    });
  }, [data, config, filled]);

  return <svg ref={svgRef} className='w-100 d-block' width={chartDimensions.width} height={chartDimensions.height} />;
};

export default LineChart;
