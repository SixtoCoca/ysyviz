import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { chartDimensions, clearSvg } from './interface/chartLayout';
import useValidatedData from './config/hooks/useValidatedData';

const SankeyChart = ({ data, config }) => {
    const svgRef = useRef();

    const { data: valid } = useValidatedData(
        data,
        'sankey',
        issues => {
            console.log('[SankeyChart] validation issues:', issues);
            if (typeof config?.onValidation === 'function') config.onValidation(issues);
        },
        config
    );

    useEffect(() => {
        if (!valid || !valid.nodes || !valid.links || valid.nodes.length === 0 || valid.links.length === 0) return;

        const { width, height } = chartDimensions;
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
        clearSvg(svg);

        const sankeyGenerator = sankey().nodeWidth(20).nodePadding(15).extent([[1, 1], [width - 1, height - 1]]);
        const sankeyData = sankeyGenerator({
            nodes: valid.nodes.map(d => ({ ...d })),
            links: valid.links.map(d => ({ ...d }))
        });

        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const container = svg.append('g');

        container
            .selectAll('rect')
            .data(sankeyData.nodes)
            .join('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', (d, i) => color(i))
            .append('title')
            .text(d => `${d.name}\n${Number(d.value)}`);

        container
            .append('g')
            .attr('fill', 'none')
            .selectAll('path')
            .data(sankeyData.links)
            .join('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', '#999')
            .attr('stroke-width', d => Math.max(1, d.width))
            .attr('opacity', 0.5)
            .append('title')
            .text(d => `${d.source.name} → ${d.target.name}\n${Number(d.value)}`);

        container
            .selectAll('text')
            .data(sankeyData.nodes)
            .join('text')
            .attr('x', d => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
            .attr('y', d => (d.y0 + d.y1) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => (d.x0 < width / 2 ? 'start' : 'end'))
            .text(d => d.name)
            .style('font-size', '10px');
    }, [valid, config]);

    if (!valid || !valid.nodes || !valid.links || valid.nodes.length === 0 || valid.links.length === 0) return null;

    return <svg ref={svgRef} width={chartDimensions.width} height={chartDimensions.height} />;
};

export default SankeyChart;
