import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chord as d3Chord, ribbon as d3Ribbon } from 'd3-chord';
import { arc as d3Arc } from 'd3-shape';
import { chartDimensions, clearSvg } from './interface/chartLayout';

const ChordChart = ({ data, config }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data?.matrix?.length || !data?.labels?.length) return;

        const { width, height } = chartDimensions;
        const margin = 20;
        const innerRadius = Math.min(width, height) * 0.5 - 100;
        const outerRadius = innerRadius + 10;

        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
        clearSvg(svg);

        const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

        const chords = d3Chord().padAngle(0.05).sortSubgroups(d3.descending)(data.matrix);

        const palette = Array.isArray(config?.palette) && config.palette.length ? config.palette : null;
        const color = d3.scaleOrdinal(palette || d3.schemeCategory10);

        const arc = d3Arc().innerRadius(innerRadius).outerRadius(outerRadius);
        const ribbon = d3Ribbon().radius(innerRadius);

        g.append('g')
            .selectAll('path')
            .data(chords.groups)
            .join('path')
            .attr('fill', d => color(d.index))
            .attr('stroke', d => d3.rgb(color(d.index)).darker())
            .attr('d', arc);

        g.append('g')
            .selectAll('text')
            .data(chords.groups)
            .join('text')
            .attr('dy', '.35em')
            .attr('transform', d => {
                const angle = (d.startAngle + d.endAngle) / 2;
                const rotate = (angle * 180) / Math.PI - 90;
                const translate = `translate(${outerRadius + 5})`;
                return `rotate(${rotate}) ${translate} ${angle > Math.PI ? 'rotate(180)' : ''}`;
            })
            .attr('text-anchor', d => (d.startAngle + d.endAngle) / 2 > Math.PI ? 'end' : 'start')
            .text(d => data.labels[d.index])
            .style('font-size', '10px');

        g.append('g')
            .selectAll('path')
            .data(chords)
            .join('path')
            .attr('d', ribbon)
            .attr('fill', d => color(d.target.index))
            .attr('stroke', d => d3.rgb(color(d.target.index)).darker());
    }, [data, config]);

    if (!data?.matrix?.length || !data?.labels?.length) return null;

    return <svg ref={svgRef} className='w-100 d-block' width={chartDimensions.width} height={chartDimensions.height} />;
};

export default ChordChart;
