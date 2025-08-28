import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { getCustomLegendPosition, drawCustomLegend } from './interface/customLegend';
import { toNumber, rowsOf, resolveFieldKey, norm } from '../data/utils';

const TreemapChart = ({ data, config }) => {
    const svgRef = useRef();
    const { containerRef, dimensions } = useResponsiveChart();

    useEffect(() => {
        const rows = rowsOf(data);
        if (!rows.length) return;

        const sample = rows[0] || {};
        const labelKey = resolveFieldKey(sample, config?.field_label, ['label', 'name']);
        const valueKey = resolveFieldKey(sample, config?.field_value, ['value', 'size']);
        if (!valueKey || !labelKey) return;

        const items = rows
            .map(r => ({
                label: norm(r?.[labelKey]),
                value: toNumber(r?.[valueKey])
            }))
            .filter(d => d.label !== '' && Number.isFinite(d.value) && d.value >= 0);
        if (!items.length) return;

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

        const rootData = {
            name: 'root',
            children: items.map(d => ({ name: d.label, value: d.value }))
        };

        const root = d3.hierarchy(rootData).sum(d => d.value || 0).sort((a, b) => (b.value || 0) - (a.value || 0));
        d3.treemap().size([innerWidth, innerHeight]).paddingInner(2).paddingTop(2)(root);

        const palette = Array.isArray(config?.palette) && config.palette.length > 0 ? config.palette : d3.schemeTableau10;
        const color = d3.scaleOrdinal(palette);

        g.append('g')
            .selectAll('g.ncg-treemap-node')
            .data(root.leaves())
            .join('g')
            .attr('class', 'ncg-treemap-node')
            .attr('transform', d => `translate(${d.x0},${d.y0})`)
            .call(sel => {
                sel.append('rect')
                    .attr('width', d => Math.max(0, d.x1 - d.x0))
                    .attr('height', d => Math.max(0, d.y1 - d.y0))
                    .attr('fill', d => color(d.data.name))
                    .attr('opacity', 0.9)
                    .attr('stroke', config?.strokeColor || 'white')
                    .attr('stroke-opacity', 0.6);

                sel.append('text')
                    .attr('x', 6)
                    .attr('y', 16)
                    .attr('pointer-events', 'none')
                    .attr('font-size', 12)
                    .attr('font-weight', 600)
                    .text(d => d.data.name)
                    .each(function (d) {
                        const node = d3.select(this);
                        const w = Math.max(0, d.x1 - d.x0) - 8;
                        const txt = d.data.name || '';
                        let t = txt;
                        if (!this.getComputedTextLength) return;
                        while (t.length > 0 && this.getComputedTextLength() > w) {
                            t = t.slice(0, -1);
                            node.text(t + '…');
                        }
                    });

                sel.append('text')
                    .attr('x', 6)
                    .attr('y', 32)
                    .attr('pointer-events', 'none')
                    .attr('font-size', 11)
                    .text(d => d3.format(',')(d.data.value || 0))
                    .each(function (d) {
                        const node = d3.select(this);
                        const w = Math.max(0, d.x1 - d.x0) - 8;
                        let t = String(d3.format(',')(d.data.value || 0));
                        if (!this.getComputedTextLength) return;
                        while (t.length > 0 && this.getComputedTextLength() > w) {
                            t = t.slice(0, -1);
                            node.text(t + '…');
                        }
                    });
            });
            
        if (config?.customLegend) {
          const customPos = getCustomLegendPosition(config, innerWidth, innerHeight, false, 0);
          drawCustomLegend(g, config.customLegend, customPos.x, customPos.y);
        }
    }, [data, config, dimensions]);

    if (!data) return null;

    return (
        <div ref={containerRef} className='w-100 h-100'>
            <svg ref={svgRef} className='w-100 h-100' />
        </div>
    );
};

export default TreemapChart;
