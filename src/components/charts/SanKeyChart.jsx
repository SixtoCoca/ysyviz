import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { chartDimensions, clearSvg } from './interface/chartLayout';

const SankeyChart = ({ data, config }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data?.nodes?.length || !data?.links?.length) return;

        const { width, height } = chartDimensions;
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
        clearSvg(svg);

        const sankey = d3Sankey()
            .nodeWidth(20)
            .nodePadding(15)
            .extent([[1, 1], [width - 1, height - 1]]);

        const layout = sankey({
            nodes: data.nodes.map(d => ({ ...d })),
            links: data.links.map(d => ({ ...d }))
        });

        const palette = Array.isArray(config?.palette) && config.palette.length ? config.palette : null;
        const color = d3.scaleOrdinal(palette || d3.schemeCategory10);

        const g = svg.append('g');

        g.selectAll('rect')
            .data(layout.nodes)
            .join('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', (d, i) => color(i))
            .append('title')
            .text(d => `${d.name}\n${Number(d.value)}`);

        g.append('g')
            .attr('fill', 'none')
            .selectAll('path')
            .data(layout.links)
            .join('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', '#999')
            .attr('stroke-width', d => Math.max(1, d.width))
            .attr('opacity', 0.5)
            .append('title')
            .text(d => `${d.source.name} → ${d.target.name}\n${Number(d.value)}`);

        g.selectAll('text')
            .data(layout.nodes)
            .join('text')
            .attr('x', d => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
            .attr('y', d => (d.y0 + d.y1) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => (d.x0 < width / 2 ? 'start' : 'end'))
            .text(d => d.name)
            .style('font-size', '10px');
    }, [data, config]);

    if (!data?.nodes?.length || !data?.links?.length) return null;

    return <svg ref={svgRef} className='w-100 d-block' width={chartDimensions.width} height={chartDimensions.height} />;
};

export default SankeyChart;
