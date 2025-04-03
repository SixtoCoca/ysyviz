import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function PieChart({ data, isDonut = false }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.values || data.values.length === 0) return;

    const width = 600;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Generar los ángulos para el gráfico de pastel
    const pie = d3.pie()
      .value(d => d.y); // Valor que define el tamaño de cada "porción"
    const sizeCenter = isDonut ? 100 : 0;

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(sizeCenter); // Gráfico de pastel sin agujeros (donut)

    const arcLabel = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    // Crear el tooltip (fuera del SVG, ya que es un div)
    const tooltip = d3.select('body')
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "4px")
      .style("pointer-events", "none");

    // Generar los segmentos (arc) del gráfico de pastel
    const arcs = svg.selectAll('.arc')
      .data(pie(data.values))
      .enter().append('g')
      .attr('class', 'arc');

    // Añadir los segmentos al gráfico
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .on('mouseover', (event, d) => {
        tooltip.style("visibility", "visible")
          .text(`${d.data.x}: ${d.data.y}`);
      })
      .on('mousemove', (event) => {
        tooltip.style("top", `${event.pageY + 5}px`)
          .style("left", `${event.pageX + 5}px`);
      })
      .on('mouseout', () => {
        tooltip.style("visibility", "hidden");
      });

    // Añadir etiquetas a las porciones
    arcs.append('text')
      .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(d => d.data.x);

    // Añadir el título
    svg.append("text")
      .attr("x", 0)
      .attr("y", -radius - 10)
      .style("text-anchor", "middle")
      .text(data.xAxisLabel);

    return () => {
      svg.selectAll("*").remove();
      tooltip.remove(); // Eliminar el tooltip al desmontar el componente
    };
  }, [data]);

  if (!data || !data.values || data.values.length === 0) return null;

  return <svg ref={svgRef}></svg>;
}

export default PieChart;
