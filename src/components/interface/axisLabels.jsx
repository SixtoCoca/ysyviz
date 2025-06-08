export function addAxisLabels(svg, data, dimensions) {
    const { width, height } = dimensions;

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .style("text-anchor", "middle")
        .text(data.xAxisLabel);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .style("text-anchor", "middle")
        .text(data.yAxisLabel);
}
