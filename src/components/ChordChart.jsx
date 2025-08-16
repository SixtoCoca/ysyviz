import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chord, ribbon } from 'd3-chord';
import { arc } from 'd3-shape';
import { chartDimensions, clearSvg } from './interface/chartLayout';
import useValidatedData from './config/hooks/useValidatedData';

const ChordChart = ({ data, config }) => {
    const svgRef = useRef();
    const { data: valid } = useValidatedData(
        data,
        'chord',
        issues => {
            console.log('[ChordChart] validation issues:', issues);
            if (typeof config?.onValidation === 'function') config.onValidation(issues);
        },
        config
    );

    useEffect(() => {
        if (!valid || !valid.matrix || !valid.labels || valid.matrix.length === 0 || valid.labels.length === 0) return;

        const { width, height } = chartDimensions;
        const margin = 20;
        const innerRadius = Math.min(width, height) * 0.5 - 100;
        const outerRadius = innerRadius + 10;

        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
        clearSvg(svg);

        const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

        const chords = chord().padAngle(0.05).sortSubgroups(d3.descending)(valid.matrix);

        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const arcGenerator = arc().innerRadius(innerRadius).outerRadius(outerRadius);
        const ribbonGenerator = ribbon().radius(innerRadius);

        g.append('g')
            .selectAll('path')
            .data(chords.groups)
            .join('path')
            .attr('fill', d => color(d.index))
            .attr('stroke', d => d3.rgb(color(d.index)).darker())
            .attr('d', arcGenerator);

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
            .text(d => valid.labels[d.index])
            .style('font-size', '10px');

        g.append('g')
            .selectAll('path')
            .data(chords)
            .join('path')
            .attr('d', ribbonGenerator)
            .attr('fill', d => color(d.target.index))
            .attr('stroke', d => d3.rgb(color(d.target.index)).darker());
    }, [valid, config]);

    if (!valid || !valid.matrix || !valid.labels || valid.matrix.length === 0 || valid.labels.length === 0) return null;

    return <svg ref={svgRef} width={chartDimensions.width} height={chartDimensions.height} />;
};

export default ChordChart;
