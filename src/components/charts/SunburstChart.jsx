import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { getCustomLegendPosition, drawCustomLegend } from './interface/customLegend';

const SunburstChart = ({ data, config }) => {
    const svgRef = useRef();
    const { containerRef, dimensions } = useResponsiveChart();

    useEffect(() => {
        if (!data || !data.children) return;
        if (!config?.field_path || !config?.field_value) return;

        const chartDims = getChartDimensions(dimensions.width, dimensions.height);
        const { width, height, margin } = chartDims;
        const { innerWidth, innerHeight } = chartDims;
        const radius = Math.min(innerWidth, innerHeight) / 2;

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const root = d3.hierarchy(data).sum(d => d.value || 0).sort((a, b) => (b.value || 0) - (a.value || 0));
        const partition = d3.partition().size([2 * Math.PI, radius]);
        partition(root);

        const nodes = root.descendants().filter(d => d.depth > 0);

        const palette = Array.isArray(config?.palette) && config.palette.length > 0 ? config.palette : d3.quantize(t => d3.interpolateSpectral(1 - t), 12);
        const domain = Array.from(new Set(nodes.map(d => d.ancestors().find(a => a.depth === 1)?.data?.name).filter(Boolean)));
        const color = d3.scaleOrdinal().domain(domain).range(palette);

        const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .padAngle(1 / radius)
            .padRadius(radius / 2)
            .innerRadius(d => d.y0)
            .outerRadius(d => d.y1);

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left + innerWidth / 2},${margin.top + innerHeight / 2})`);

        g.selectAll('path.ncg-sun')
            .data(nodes)
            .join('path')
            .attr('class', 'ncg-sun')
            .attr('d', arc)
            .attr('fill', d => {
                const top = d.ancestors().find(a => a.depth === 1);
                const key = top?.data?.name;
                return key ? color(key) : palette[0];
            })
            .attr('stroke', config?.strokeColor || '#fff')
            .attr('stroke-opacity', 0.6);

        const defs = g.append('defs');
        const rMid = d => (d.y0 + d.y1) / 2;
        const toXY = (a, r) => [Math.cos(a - Math.PI / 2) * r, Math.sin(a - Math.PI / 2) * r];
        const sweep = (a0, a1) => (a1 - a0) % (Math.PI * 2) > Math.PI ? 1 : 0;

        defs.selectAll('path.ncg-label-path')
            .data(nodes)
            .join('path')
            .attr('class', 'ncg-label-path')
            .attr('id', (_, i) => `sunlabel-${i}`)
            .attr('d', d => {
                const a0 = d.x0, a1 = d.x1, r = rMid(d);
                const mid = (a0 + a1) / 2;
                const leftSide = mid > Math.PI / 2 && mid < (Math.PI * 3) / 2;
                const start = leftSide ? a1 : a0;
                const end = leftSide ? a0 : a1;
                const p0 = toXY(start, r);
                const p1 = toXY(end, r);
                const large = sweep(start, end);
                return `M${p0[0]},${p0[1]} A${r},${r} 0 ${large} ${leftSide ? 0 : 1} ${p1[0]},${p1[1]}`;
            });

        const fontSizeBase = typeof config?.fontSize === 'number' ? config.fontSize : 11;
        const format = d3.format(config?.valueFormat || ',');

        const textSel = g.selectAll('text.ncg-sun-text')
            .data(nodes)
            .join('text')
            .attr('class', 'ncg-sun-text');

        const tps = textSel.append('textPath')
            .attr('href', (_, i) => `#sunlabel-${i}`)
            .attr('text-anchor', 'start')
            .attr('startOffset', 0)
            .style('font-size', `${fontSizeBase}px`)
            .text(d => d.data.name || '');

        tps.append('tspan')
            .attr('dx', '0.25em')
            .text(d => d.value ? ` ${format(d.value)}` : '');

        tps.each(function (_, i) {
            const path = g.select(`#sunlabel-${i}`).node();
            if (!path) return;
            const L = path.getTotalLength();
            let textEl = d3.select(this);
            let size = fontSizeBase;
            let textLength = this.getComputedTextLength();
            if (textLength > L) {
                const scale = L / textLength;
                size = Math.max(8, Math.floor(fontSizeBase * scale));
                textEl.style('font-size', `${size}px`);
                textLength = this.getComputedTextLength();
            }
            const pad = 2;
            const offset = Math.max(0, (L - textLength) / 2 - pad);
            textEl.attr('startOffset', offset);
        });
        
        if (config?.customLegend) {
          const customPos = getCustomLegendPosition(config, innerWidth, innerHeight, false, 0);
          drawCustomLegend(g, config.customLegend, customPos.x - innerWidth / 2, customPos.y - innerHeight / 2);
        }
    }, [data, config, dimensions]);

    if (!data || !data.children) return null;
    if (!config?.field_path || !config?.field_value) return null;

    return (
        <div ref={containerRef} className='w-100 h-100'>
            <svg ref={svgRef} className='w-100 h-100' />
        </div>
    );
};

export default SunburstChart;
