import './ColorSelector.css';
import TitleControl from './controls/TitleControl';
import SingleColorControl from './controls/SingleColorControl';
import PaletteControl from './controls/PaletteControl';
import DonutHoleControl from './controls/DonutHoleControl';
import OrientationControl from './controls/OrientationControl';
import LegendPositionControl from './controls/LegendPositionControl';
import CustomLegendControl from './controls/CustomLegendControl';
import CustomLegendPositionControl from './controls/CustomLegendPositionControl';

export const ControlRegistry = {
    title: TitleControl,
    color: SingleColorControl,
    palette: PaletteControl,
    donutHole: DonutHoleControl,
    orientation: OrientationControl,
    legendPosition: LegendPositionControl,
    customLegend: CustomLegendControl,
    customLegendPosition: CustomLegendPositionControl
};

export const coerceValueForKey = (key, value) => {
    if (key === 'donutHole') return Number(value);
    return value;
};
