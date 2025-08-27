import { useEffect, useState, useRef } from 'react';

export const useResponsiveChart = () => {
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return { containerRef, dimensions };
};

export const getChartDimensions = (containerWidth, containerHeight) => {
    const width = containerWidth || 1000;
    const height = containerHeight || 700;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    
    return {
        width,
        height,
        margin,
        innerWidth: width - margin.left - margin.right,
        innerHeight: height - margin.top - margin.bottom
    };
};

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