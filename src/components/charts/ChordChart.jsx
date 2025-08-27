import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chord as d3Chord, ribbon as d3Ribbon } from 'd3-chord';
import { arc as d3Arc } from 'd3-shape';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';

const ChordChart = ({ data, config }) => {
  const svgRef = useRef();
  const { containerRef, dimensions } = useResponsiveChart();

  useEffect(() => {
    if (!data?.matrix?.length) return;

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

    const radius = Math.min(innerWidth, innerHeight) / 2 - 40;

    const chord = d3Chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    const arc = d3Arc()
      .innerRadius(radius)
      .outerRadius(radius + 20);

    const ribbon = d3Ribbon()
      .radius(radius);

    const chords = chord(data.matrix);

    const palette = Array.isArray(config?.palette) && config.palette.length ? config.palette : null;
    const color = palette ? d3.scaleOrdinal(palette) : d3.scaleOrdinal(d3.schemeCategory10);

    g.selectAll('path')
      .data(chords)
      .join('path')
      .attr('d', ribbon)
      .attr('fill', d => color(d.source.index))
      .attr('opacity', 0.7)
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    g.selectAll('g')
      .data(chords.groups)
      .join('g')
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    if (data.labels) {
      g.selectAll('text')
        .data(chords.groups)
        .join('text')
        .each(function(d) {
          const centroid = arc.centroid(d);
          d3.select(this)
            .attr('x', centroid[0])
            .attr('y', centroid[1])
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(data.labels[d.index]);
        });
    }
  }, [data, config, dimensions]);

  if (!data?.matrix?.length) return null;

  return (
    <div ref={containerRef} className='w-100 h-100'>
      <svg ref={svgRef} className='w-100 h-100' />
    </div>
  );
};

export default ChordChart;
