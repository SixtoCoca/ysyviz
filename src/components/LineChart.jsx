import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, getInnerSize, clearSvg } from './interface/chartLayout';
import { addAxisLabels } from './interface/axisLabels';
import useValidatedData from './config/hooks/useValidatedData';

const LineChart = ({ data, config, filled = false }) => {
  const svgRef = useRef();

  const { data: valid } = useValidatedData(
    data,
    'line',
    issues => {
      console.log('[LineChart] validation issues:', issues);
      if (typeof config?.onValidation === 'function') config.onValidation(issues);
    },
    config
  );

  useEffect(() => {
    if (!valid || !valid.values || valid.values.length === 0) return;

    const { width, height, margin } = chartDimensions;
    const { innerWidth, innerHeight } = getInnerSize(chartDimensions);

    const svg = d3.select(svgRef.current);
    clearSvg(svg);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(valid.values.map(d => d.x))
      .range([0, innerWidth])
      .padding(0.1);

    const yMax = d3.max(valid.values, d => d.y) ?? 0;
    const y = d3.scaleLinear()
      .domain([0, yMax === 0 ? 1 : yMax])
      .nice()
      .range([innerHeight, 0]);

    const line = d3.line()
      .x(d => x(d.x) + x.bandwidth() / 2)
      .y(d => y(d.y));

    const area = d3.area()
      .x(d => x(d.x) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1(d => y(d.y));

    const pointColor = config?.color
      ? () => config.color
      : i => d3.schemeCategory10[i % 10];

    if (filled) {
      const c = d3.color(config?.color || 'steelblue') || d3.color('steelblue');
      c.opacity = 0.5;
      g.append('path')
        .datum(valid.values)
        .attr('fill', c.formatRgb())
        .attr('d', area);
    }

    g.append('path')
      .datum(valid.values)
      .attr('fill', 'none')
      .attr('stroke', config?.color || 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    g.selectAll('circle')
      .data(valid.values)
      .join('circle')
      .attr('cx', d => x(d.x) + x.bandwidth() / 2)
      .attr('cy', d => y(d.y))
      .attr('r', 4)
      .attr('fill', (d, i) => pointColor(i));

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    g.append('g').call(d3.axisLeft(y));

    addAxisLabels(svg, data, { width, height });

    return () => clearSvg(svg);
  }, [valid, config, filled, data]);

  if (!valid || !valid.values || valid.values.length === 0) return null;

  return <svg ref={svgRef} width={chartDimensions.width} height={chartDimensions.height} />;
};

export default LineChart;
