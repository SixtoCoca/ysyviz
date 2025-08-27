export const chartDimensions = {
    width: 1000,
    height: 700,
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
};

export const getInnerSize = dims => {
    const { width, height, margin } = dims;
    return {
        innerWidth: width - margin.left - margin.right,
        innerHeight: height - margin.top - margin.bottom
    };
};

export const clearSvg = svg => {
    svg.selectAll('*').remove();
};