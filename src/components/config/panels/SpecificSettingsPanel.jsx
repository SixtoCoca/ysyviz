import { Card } from 'react-bootstrap';
import { ChartTypes } from '../../../constants/graph-type';
import WaterfallSettings from './WaterfallSettings';
import SankeySettings from './SankeySettings';
import ChordSettings from './ChordSettings';
import PieSettings from './PieDonutSettings';
import ViolinSettings from './ViolinSettings';

const SpecificSettingsPanel = ({ config, onChange, chartType }) => {
    const renderChartSpecificSettings = () => {
        switch (chartType) {
            case ChartTypes.WATERFALL:
                return <WaterfallSettings config={config} onChange={onChange} />;
            case ChartTypes.SANKEY:
                return <SankeySettings config={config} onChange={onChange} />;
            case ChartTypes.CHORD:
                return <ChordSettings config={config} onChange={onChange} />;
            case ChartTypes.PIE:
                return <PieSettings config={config} onChange={onChange} />;
            case ChartTypes.DONUT:
                return <PieSettings config={config} onChange={onChange} isDonut={true} />;
            case ChartTypes.SUNBURST:
                return <PieSettings config={config} onChange={onChange} isDonut={true} isSunburst={true} />;
            case ChartTypes.VIOLIN:
                return <ViolinSettings config={config} onChange={onChange} />;
            default:
                return null;
        }
    };

    const hasSpecificSettings = [ChartTypes.WATERFALL, ChartTypes.SANKEY, ChartTypes.CHORD, ChartTypes.PIE, ChartTypes.DONUT, ChartTypes.SUNBURST, ChartTypes.VIOLIN].includes(chartType);

    if (!hasSpecificSettings) return null;

    return <>
            <Card className='mb-4 mt-4'>
                <Card.Body>
                    <h6>Specific Settings</h6>
                    {renderChartSpecificSettings()}
                </Card.Body>
            </Card>
        </>;
};

export default SpecificSettingsPanel;
