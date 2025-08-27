import { Card } from 'react-bootstrap';
import WaterfallSettings from './WaterfallSettings';

const SpecificSettingsPanel = ({ config, onChange, chartType }) => {
    const renderChartSpecificSettings = () => {
        switch (chartType) {
            case 'waterfall':
                return <WaterfallSettings config={config} onChange={onChange} />;
            default:
                return null;
        }
    };

    const hasSpecificSettings = chartType === 'waterfall';

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
