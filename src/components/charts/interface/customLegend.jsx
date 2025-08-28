

export const drawCustomLegend = (g, text, x = 20, y = 20) => {
    if (!text || !text.trim()) return;
    
    const lines = text.split('\n');
    const lineHeight = 16;
    
    lines.forEach((line, index) => {
        if (line.trim()) {
            g.append('text')
                .attr('x', x)
                .attr('y', y + (index * lineHeight))
                .attr('class', 'custom-legend')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text(line.trim());
        }
    });
};

export const getCustomLegendPosition = (config, innerWidth, innerHeight, hasSeriesLegend = false, seriesCount = 0) => {
    const customLegendPos = config?.customLegendPosition;
    const legendPos = config?.legendPosition;
    let x = 20;
    let y = 20;
    
    if (customLegendPos && customLegendPos !== 'disabled') {
        switch (customLegendPos) {
            case 'top-left':
                x = 20;
                y = 20;
                break;
            case 'top-right':
                x = innerWidth - 100;
                y = 20;
                break;
            case 'bottom-left':
                x = 20;
                y = innerHeight - 100;
                break;
            case 'bottom-right':
                x = innerWidth - 100;
                y = innerHeight - 100;
                break;
        }
    } else if (legendPos && legendPos !== 'disabled') {
        switch (legendPos) {
            case 'top-left':
                x = 20;
                y = 20;
                break;
            case 'top-right':
                x = innerWidth - 100;
                y = 20;
                break;
            case 'bottom-left':
                x = 20;
                y = innerHeight - 100;
                break;
            case 'bottom-right':
                x = innerWidth - 100;
                y = innerHeight - 100;
                break;
        }
        
        if (hasSeriesLegend) {
            y += (seriesCount * 20) + 20;
        }
    }
    
    return { x, y };
};
