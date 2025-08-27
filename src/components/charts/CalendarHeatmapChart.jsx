import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartDimensions, clearSvg } from './interface/chartLayout';
import { rowsOf, resolveFieldKey, toNumber } from '../data/utils';
import { drawLinearLegend } from './interface/colorLegend';

const makeColorScale = (cfg, maxVal) => {
    const vMax = Number.isFinite(maxVal) && maxVal > 0 ? maxVal : 1;
    if (Array.isArray(cfg?.palette) && cfg.palette.length >= 2) {
        const stops = cfg.palette;
        const domain = d3.range(stops.length).map(i => (i / (stops.length - 1)) * vMax);
        return d3.scaleLinear().domain(domain).range(stops).clamp(true);
    }
    const base = cfg?.color || '#196127';
    const interp = d3.interpolateRgb('#ebedf0', base);
    return d3.scaleLinear().domain([0, vMax]).range([interp(0), interp(1)]).clamp(true);
};

const keyYYYYMMDD = d3.timeFormat('%Y-%m-%d');

const CalendarHeatmapChart = ({ data, config }) => {
    const svgRef = useRef();

    useEffect(() => {
        const rows = rowsOf(data);
        if (!rows.length) return;

        const sample = rows[0] || {};
        const dateKey = resolveFieldKey(sample, config?.field_date, ['date', 'day']);
        const valueKey = resolveFieldKey(sample, config?.field_value, ['value']);
        if (!dateKey || !valueKey) return;

        const parsed = rows
            .map(r => ({ date: new Date(r?.[dateKey]), value: toNumber(r?.[valueKey]) }))
            .filter(d => d.date instanceof Date && !isNaN(d.date) && Number.isFinite(d.value));

        if (!parsed.length) return;

        const { width, height } = chartDimensions;

        const svg = d3.select(svgRef.current);
        clearSvg(svg);

        const minDate = d3.timeDay.floor(d3.min(parsed, d => d.date));
        const maxDate = d3.timeDay.floor(d3.max(parsed, d => d.date));
        if (!minDate || !maxDate) return;

        const start = d3.timeSunday.floor(minDate);
        const end = d3.timeSunday.ceil(d3.timeDay.offset(maxDate, 1));

        const allDays = d3.timeDays(start, end);
        const valueByDay = new Map(parsed.map(d => [keyYYYYMMDD(d.date), d.value]));
        const daysData = allDays.map(d => ({ date: d, value: valueByDay.get(keyYYYYMMDD(d)) || 0 }));

        const weekIndex = d => d3.timeSunday.count(start, d);
        const dayOfWeek = d => d.getDay();

        const minValue = d3.min(parsed, d => d.value) || 0;
        const maxValue = d3.max(parsed, d => d.value) || 1;
        const color = makeColorScale(config, maxValue);

        const totalWeeks = weekIndex(end);
        const cellSize = Math.min(width / (totalWeeks + 6), height / 9);

        const calWidth = totalWeeks * cellSize;
        const calHeight = 7 * cellSize;

        const offsetX = (width - calWidth) / 2;
        const offsetY = (height - calHeight) / 2 - 20;

        const g = svg
            .attr('width', width)
            .attr('height', height + 40)
            .append('g')
            .attr('transform', `translate(${offsetX},${offsetY})`);

        const axisG = g.append('g');

        const dayLabels = [
            { d: 1, text: 'Mon' },
            { d: 3, text: 'Wed' },
            { d: 5, text: 'Fri' }
        ];

        axisG.selectAll('text.ncg-cal-day')
            .data(dayLabels)
            .join('text')
            .attr('class', 'ncg-cal-day')
            .attr('x', -6)
            .attr('y', d => d.d * cellSize + cellSize * 0.7)
            .attr('text-anchor', 'end')
            .attr('font-size', 10)
            .attr('fill', '#6a737d')
            .text(d => d.text);

        const months = d3.timeMonths(d3.timeMonth.floor(start), end);
        const filteredMonths = months.filter(m => m < end && m > start);

        let lastX = -Infinity;

        axisG.selectAll('text.ncg-cal-month')
            .data(filteredMonths)
            .join('text')
            .attr('class', 'ncg-cal-month')
            .attr('x', m => weekIndex(d3.timeSunday.floor(m)) * cellSize)
            .attr('y', -6)
            .attr('text-anchor', 'start')
            .attr('font-size', 10)
            .attr('fill', '#6a737d')
            .text(m => {
                const x = weekIndex(d3.timeSunday.floor(m)) * cellSize;
                if (x - lastX < cellSize * 3) return '';
                lastX = x;
                return d3.timeFormat('%b')(m);
            });

        g.selectAll('rect.ncg-cal-cell')
            .data(daysData)
            .join('rect')
            .attr('class', 'ncg-cal-cell')
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('x', d => weekIndex(d.date) * cellSize)
            .attr('y', d => dayOfWeek(d.date) * cellSize)
            .attr('width', Math.max(1, cellSize - 2))
            .attr('height', Math.max(1, cellSize - 2))
            .attr('fill', d => color(d.value))
            .append('title')
            .text(d => `${keyYYYYMMDD(d.date)}: ${d.value}`);

        const legendWidth = 150;
        const legendHeight = 10;
        const legendX = (calWidth - legendWidth) / 2;
        const legendY = calHeight + 20;

        drawLinearLegend(svg, {
            x: offsetX + legendX,
            y: offsetY + legendY,
            width: legendWidth,
            height: legendHeight,
            scale: v => color(v),
            domain: [minValue, maxValue],
            ticks: 4,
            gradientId: 'calendar-gradient'
        });
    }, [data, config]);

    if (!data?.values?.length && !Array.isArray(data)) return null;

    return (
        <svg
            ref={svgRef}
            className='w-100 d-block'
            width={chartDimensions.width}
            height={chartDimensions.height + 40}
            viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height + 40}`}
            preserveAspectRatio='xMidYMid meet'
        />
    );
};

export default CalendarHeatmapChart;
