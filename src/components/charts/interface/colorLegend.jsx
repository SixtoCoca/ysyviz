import * as d3 from 'd3';

export const drawLinearLegend = (svg, opts) => {
    const { x = 0, y = 0, width = 200, height = 10, scale, domain, ticks = 5, gradientId = 'ncg-linear-legend' } = opts || {};
    if (!scale || !domain || domain.length < 2) return null;

    const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
    const grad = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%')
        .attr('x2', '100%');

    const [d0, d1] = domain;
    const n = 8;
    for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const v = d0 + t * (d1 - d0);
        grad.append('stop')
            .attr('offset', `${t * 100}%`)
            .attr('stop-color', scale(v));
    }

    const g = svg.append('g').attr('transform', `translate(${x},${y})`);

    g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', `url(#${gradientId})`);

    const axisScale = d3.scaleLinear().domain([d0, d1]).range([0, width]);
    const axis = d3.axisBottom(axisScale).ticks(ticks).tickSize(height);

    g.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(axis)
        .select('.domain')
        .remove();

    return g;
};
