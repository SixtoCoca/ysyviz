export const getLegendPosition = (position, innerWidth, innerHeight) => {
    switch (position) {
        case 'top-left':
            return { x: 20, y: 20 };
        case 'top-right':
            return { x: innerWidth - 100, y: 20 };
        case 'bottom-left':
            return { x: 20, y: innerHeight - 100 };
        case 'bottom-right':
            return { x: innerWidth - 100, y: innerHeight - 100 };
        case 'disabled':
            return null;
        default:
            return { x: 20, y: 20 };
    }
};
