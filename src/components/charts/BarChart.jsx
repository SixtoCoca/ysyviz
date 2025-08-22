import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';

const BarChart = ({ data, config }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data?.values?.length) return;

    const { width, height, margin } = chartDimensions;
    const { innerWidth, innerHeight } = getInnerSize(chartDimensions);
    const svg = d3.select(svgRef.current);
    clearSvg(svg);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.values.map(d => d.key))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.values, d => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));

    const color = config?.color || '#5563DE';

    g.selectAll('rect.bar')
      .data(data.values)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.key) || 0)
      .attr('y', d => y(d.value))
      .attr('width', () => x.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', color);
  }, [data, config]);

  return <svg ref={svgRef} className='w-100 d-block' width={chartDimensions.width} height={chartDimensions.height} />;
};

export default BarChart;
