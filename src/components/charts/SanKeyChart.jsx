import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { getCustomLegendPosition, drawCustomLegend } from './interface/customLegend';

const SanKeyChart = ({ data, config }) => {
  const svgRef = useRef();
  const { containerRef, dimensions } = useResponsiveChart();

  useEffect(() => {
    if (!data?.links?.length || !data?.nodes?.length) return;

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

    const sankey = d3Sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[0, 0], [innerWidth, innerHeight]]);

    const { nodes: sankeyNodes, links: sankeyLinks } = sankey(data);

    const palette = Array.isArray(config?.palette) && config.palette.length ? config.palette : null;
    const color = palette ? d3.scaleOrdinal(palette) : d3.scaleOrdinal(d3.schemeCategory10);

    const useNodeColors = config?.linkColors !== 'gray';

    g.selectAll('path')
      .data(sankeyLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => useNodeColors ? color(d.source.name) : '#808080')
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('opacity', 0.5);

    g.selectAll('rect')
      .data(sankeyNodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => color(d.name))
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    g.selectAll('text')
      .data(sankeyNodes)
      .join('text')
      .attr('x', d => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < innerWidth / 2 ? 'start' : 'end')
      .style('font-size', '12px')
      .text(d => d.name);
      
    if (config?.customLegend) {
      const customPos = getCustomLegendPosition(config, innerWidth, innerHeight, false, 0);
      drawCustomLegend(g, config.customLegend, customPos.x, customPos.y);
    }
  }, [data, config, dimensions]);

  if (!data?.links?.length || !data?.nodes?.length) return null;

  return (
    <div ref={containerRef} className='w-100 h-100'>
      <svg ref={svgRef} className='w-100 h-100' />
    </div>
  );
};

export default SanKeyChart;
  