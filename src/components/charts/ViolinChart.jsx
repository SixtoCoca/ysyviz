import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResponsiveChart, getChartDimensions, clearSvg } from './interface/chartLayout';
import { getCustomLegendPosition, drawCustomLegend } from './interface/customLegend';
import { toNumber } from '../data/utils';

const ViolinChart = ({ data, config }) => {
    const svgRef = useRef();
    const { containerRef, dimensions } = useResponsiveChart();

    useEffect(() => {
        if (!data?.values?.length) return;

        const rows = data.values
            .map(d => ({ x: d.x, y: toNumber(d.y) }))
            .filter(d => d.x !== undefined && d.x !== null && Number.isFinite(d.y));
        if (!rows.length) return;

        const chartDims = getChartDimensions(dimensions.width, dimensions.height);
        const { width, height, margin } = chartDims;
        const { innerWidth, innerHeight } = chartDims;

        const svg = d3.select(svgRef.current);
        clearSvg(svg);
        svg.attr('width', width).attr('height', height);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const categories = Array.from(new Set(rows.map(d => d.x)));
        const isCategorical = categories.length > 1 || typeof rows[0].x === 'string';

        const extY = d3.extent(rows, d => d.y);
        const pad = v => (v === 0 ? 1 : Math.max(1, Math.abs(v) * 0.05));
        const domainY = extY[0] === extY[1] ? [extY[0] - pad(extY[0]), extY[1] + pad(extY[1])] : extY;

        const isHorizontal = config?.orientation === 'horizontal';

        const y = d3.scaleLinear().domain(domainY).nice().range(isHorizontal ? [0, innerWidth] : [innerHeight, 0]);
        const xBand = d3.scaleBand().domain(isCategorical ? categories : ['_single']).range(isHorizontal ? [0, innerHeight] : [0, innerWidth]).padding(0.08);

        if (isHorizontal) {
            g.append('g').call(d3.axisLeft(xBand));
            g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(y));
        } else {
            g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(xBand));
            g.append('g').call(d3.axisLeft(y));
        }

        const thresholds = y.ticks(config?.thresholds || 40).sort(d3.ascending);
        const dev = d3.deviation(rows, d => d.y) || 1;
        const bwAuto = 1.06 * dev * Math.pow(rows.length, -1 / 5);
        const bandwidth = Number.isFinite(config?.bandwidth) && config.bandwidth > 0 ? config.bandwidth : bwAuto;

        const getKernel = (type) => {
            switch (type || 'epanechnikov') {
                case 'gaussian':
                    return k => v => {
                        const u = v / k;
                        return Math.exp(-0.5 * u * u) / (k * Math.sqrt(2 * Math.PI));
                    };
                case 'triangular':
                    return k => v => {
                        const u = v / k;
                        return Math.abs(u) <= 1 ? (1 - Math.abs(u)) / k : 0;
                    };
                default:
                    return k => v => {
                        const u = v / k;
                        return Math.abs(u) <= 1 ? 0.75 * (1 - u * u) / k : 0;
                    };
            }
        };
        
        const kernel = getKernel(config?.kernelType);
        const kde = (kernel, ts, values) => ts.map(t => [t, d3.mean(values, v => kernel(t - v)) || 0]);
        
        const smoothing = config?.smoothing || 0.5;

        const groups = isCategorical ? categories : ['_single'];
        const series = groups.map(cat => {
            const vals = isCategorical ? rows.filter(r => r.x === cat).map(r => r.y) : rows.map(r => r.y);
            return { cat, density: kde(kernel(bandwidth || 1), thresholds, vals) };
        });

        const usePalette = config?.colorMode === 'palette' && Array.isArray(config?.palette) && config.palette.length > 0;
        const colorScale = usePalette ? d3.scaleOrdinal(config.palette).domain(groups) : null;

        series.forEach(s => {
            const denMax = d3.max(s.density, d => d[1]) || 0;
            if (denMax === 0) return;
            const key = isCategorical ? s.cat : '_single';
            const bandX = xBand(key);
            if (bandX === undefined) return;
            const center = bandX + xBand.bandwidth() / 2;
            const minFrac = Math.max(0, Math.min(0.08, config?.minWidthFraction || 0));
            const w = d3.scaleLinear().domain([0, denMax]).range([xBand.bandwidth() * minFrac, xBand.bandwidth() / 2]);

            const fillColor = usePalette ? colorScale(key) : (config?.color || '#1f77b4');

            if (isHorizontal) {
                g.append('path')
                    .datum(s.density)
                    .attr('fill', fillColor)
                    .attr('stroke', 'none')
                    .attr('data-testid', 'violin-path')
                    .attr('d', d3.area()
                        .y0(d => center - w(d[1]))
                        .y1(d => center + w(d[1]))
                        .x(d => y(d[0]))
                        .curve(smoothing > 0.7 ? d3.curveCatmullRom : smoothing > 0.3 ? d3.curveBasis : d3.curveLinear)
                    );
            } else {
                g.append('path')
                    .datum(s.density)
                    .attr('fill', fillColor)
                    .attr('stroke', 'none')
                    .attr('data-testid', 'violin-path')
                    .attr('d', d3.area()
                        .x0(d => center - w(d[1]))
                        .x1(d => center + w(d[1]))
                        .y(d => y(d[0]))
                        .curve(smoothing > 0.7 ? d3.curveCatmullRom : smoothing > 0.3 ? d3.curveBasis : d3.curveLinear)
                    );
            }
        });
        
        if (config?.customLegend) {
          const customPos = getCustomLegendPosition(config, innerWidth, innerHeight, false, 0);
          drawCustomLegend(g, config.customLegend, customPos.x, customPos.y);
        }
    }, [data, config, dimensions]);

    if (!data?.values?.length) return null;

    return (
        <div ref={containerRef} className='w-100 h-100' data-testid="violin-chart">
            <svg ref={svgRef} className='w-100 h-100' />
        </div>
    );
};

export default ViolinChart;
