import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ScatterChart({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.values || data.values.length === 0) return;

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 60, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const x = d3.scaleBand()
            .domain(data.values.map(d => d.x))
            .range([0, innerWidth])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data.values, d => d.y)])
            .range([innerHeight, 0]);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        g.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .style("text-anchor", "middle")
            .text(data.xAxisLabel);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height / 2))
            .attr("y", 15)
            .style("text-anchor", "middle")
            .text(data.yAxisLabel);


        //Read the data
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv").then(function (data) {
            console.log(data)
            // Add X axis
            const x = d3.scaleLinear()
                .domain([0, 4000])
                .range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, 500000])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .join("circle")
                .attr("cx", function (d) { return x(d.GrLivArea); })
                .attr("cy", function (d) { return y(d.SalePrice); })
                .attr("r", 1.5)
                .style("fill", "#69b3a2")

        })

        return () => {
            svg.selectAll("*").remove();
        };
    }, [data]);

    if (!data || !data.values || data.values.length === 0) return null;

    return <svg ref={svgRef} width="600" height="400"></svg>;
}

export default ScatterChart; 