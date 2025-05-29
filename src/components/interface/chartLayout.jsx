export const chartDimensions = {
    width: 600,
    height: 400,
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
};

export const getInnerSize = ({ width, height, margin }) => ({
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
});

export function clearSvg(svg) {
    svg.selectAll("*").remove();
}
