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

    const isHorizontal = config?.orientation === 'horizontal';

    if (data.hasGrouped && data.series?.length) {
      const x0 = d3
        .scaleBand()
        .domain(data.categories || data.values.map(d => d.key))
        .range(isHorizontal ? [0, innerHeight] : [0, innerWidth])
        .padding(0.1);

      const x1 = d3
        .scaleBand()
        .domain(data.series)
        .range([0, x0.bandwidth()])
        .padding(0.05);

      const maxValue = d3.max(data.values, d => 
        d3.max(d.values || [], v => v.value)
      ) || 0;

      const y = d3
        .scaleLinear()
        .domain([0, maxValue])
        .nice()
        .range(isHorizontal ? [0, innerWidth] : [innerHeight, 0]);

      let colorRange;
      if (config?.palette && Array.isArray(config.palette) && config.palette.length > 0) {
        colorRange = config.palette;
      } else {
        colorRange = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
      }
        
      const color = d3.scaleOrdinal()
        .domain(data.series)
        .range(colorRange);

      if (isHorizontal) {
        g.append('g').call(d3.axisLeft(x0));
        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(y));
      } else {
        g.append('g')
          .attr('transform', `translate(0,${innerHeight})`)
          .call(d3.axisBottom(x0));
        g.append('g').call(d3.axisLeft(y));
      }

      const categoryGroups = g.selectAll('.category-group')
        .data(data.values)
        .join('g')
        .attr('class', 'category-group')
        .attr('transform', d => isHorizontal ? `translate(0,${x0(d.key)})` : `translate(${x0(d.key)},0)`);

      categoryGroups.selectAll('rect')
        .data(d => d.values || [])
        .join('rect')
        .attr('x', d => isHorizontal ? 0 : (x1(d.series) || 0))
        .attr('y', d => isHorizontal ? (x1(d.series) || 0) : y(d.value))
        .attr('width', d => isHorizontal ? y(d.value) : x1.bandwidth())
        .attr('height', d => isHorizontal ? x1.bandwidth() : innerHeight - y(d.value))
        .attr('fill', d => color(d.series));

      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', isHorizontal ? `translate(${innerWidth - 100}, 20)` : `translate(${innerWidth - 100}, 20)`);

      const legendItems = legend.selectAll('.legend-item')
        .data(data.series)
        .join('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

      legendItems.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', d => color(d));

      legendItems.append('text')
        .attr('x', 18)
        .attr('y', 9)
        .style('font-size', '12px')
        .style('alignment-baseline', 'middle')
        .text(d => d);

    } else {
      const x = d3
        .scaleBand()
        .domain(data.values.map(d => d.key))
        .range(isHorizontal ? [0, innerHeight] : [0, innerWidth])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data.values, d => d.value) || 0])
        .nice()
        .range(isHorizontal ? [0, innerWidth] : [innerHeight, 0]);

      if (isHorizontal) {
        g.append('g').call(d3.axisLeft(x));
        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(y));
      } else {
        g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append('g').call(d3.axisLeft(y));
      }

      const color = config?.color || '#5563DE';

      g.selectAll('rect.bar')
        .data(data.values)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => isHorizontal ? 0 : (x(d.key) || 0))
        .attr('y', d => isHorizontal ? (x(d.key) || 0) : y(d.value))
        .attr('width', d => isHorizontal ? y(d.value) : x.bandwidth())
        .attr('height', d => isHorizontal ? x.bandwidth() : innerHeight - y(d.value))
        .attr('fill', color);
    }
  }, [data, config]);

  return <svg ref={svgRef} className='w-100 d-block' width={chartDimensions.width} height={chartDimensions.height} />;
};

export default BarChart;
