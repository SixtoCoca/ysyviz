import { Card } from 'react-bootstrap';
import WaterfallSettings from './WaterfallSettings';
import SankeySettings from './SankeySettings';
import ChordSettings from './ChordSettings';

const SpecificSettingsPanel = ({ config, onChange, chartType }) => {
    const renderChartSpecificSettings = () => {
        switch (chartType) {
            case 'waterfall':
                return <WaterfallSettings config={config} onChange={onChange} />;
            case 'sankey':
                return <SankeySettings config={config} onChange={onChange} />;
            case 'chord':
                return <ChordSettings config={config} onChange={onChange} />;
            default:
                return null;
        }
    };

    const hasSpecificSettings = ['waterfall', 'sankey', 'chord'].includes(chartType);

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
