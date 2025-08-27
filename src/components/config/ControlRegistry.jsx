import './ColorSelector.css';
import TitleControl from './controls/TitleControl';
import SingleColorControl from './controls/SingleColorControl';
import PaletteControl from './controls/PaletteControl';
import DonutHoleControl from './controls/DonutHoleControl';

export const ControlRegistry = {
    title: TitleControl,
    color: SingleColorControl,
    palette: PaletteControl,
    donutHole: DonutHoleControl
};

export const coerceValueForKey = (key, value) => {
    if (key === 'donutHole') return Number(value);
    return value;
};
