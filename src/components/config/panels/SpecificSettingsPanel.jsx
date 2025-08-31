import { Card } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ChartTypes } from '../../../constants/graph-type';
import WaterfallSettings from './WaterfallSettings';
import SankeySettings from './SankeySettings';
import ChordSettings from './ChordSettings';
import PieSettings from './PieDonutSettings';
import ViolinSettings from './ViolinSettings';
import PyramidSettings from './PyramidSettings';

const SpecificSettingsPanel = ({ config, onChange, chartType }) => {
    const { t } = useLanguage();
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
            case ChartTypes.PYRAMID:
                return <PyramidSettings config={config} onChange={onChange} />;
            default:
                return null;
        }
    };

    const hasSpecificSettings = [ChartTypes.WATERFALL, ChartTypes.SANKEY, ChartTypes.CHORD, ChartTypes.PIE, ChartTypes.DONUT, ChartTypes.SUNBURST, ChartTypes.VIOLIN, ChartTypes.PYRAMID].includes(chartType);

    if (!hasSpecificSettings) return null;

    return <>
            <Card className='mb-4 mt-4'>
                <Card.Body>
                    <h4 className='mb-3 text-center' data-testid="specific-settings-title">{t('specific_settings')}</h4>
                    {renderChartSpecificSettings()}
                </Card.Body>
            </Card>
        </>;
};

export default SpecificSettingsPanel;
