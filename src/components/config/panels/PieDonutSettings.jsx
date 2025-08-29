import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const PieSettings = ({ config, onChange, isDonut=false, isSunburst=false }) => {
    const { t } = useLanguage();
    
    const handleChange = (key, value) => {
        onChange({ ...config, [key]: value });
    };

    const getTitle = () => {
        if (isDonut) {
            return config?.type === 'sunburst' ? t('sunburst_settings') : t('donut_settings');
        }
        return t('pie_settings');
    };

    return <>
        <div className='mt-3'>
            <h6>{getTitle()}</h6>
            
            <Form.Label>{t('start_angle')}</Form.Label>
            <Form.Control
                type='number'
                min='0'
                max='360'
                value={config?.startAngle || 0}
                onChange={(e) => handleChange('startAngle', parseInt(e.target.value) || 0)}
                placeholder='0'
            />
            <div className='text-muted small'>
                {t('start_angle_description')}
            </div>
        </div>
        
        {isDonut && (
            <div className='mt-3'>
                <Form.Label>{t('donut_hole_size')}</Form.Label>
                <Form.Control
                    type='number'
                    min='0'
                    max='100'
                    value={config?.donutHoleSize || 50}
                    onChange={(e) => handleChange('donutHoleSize', parseInt(e.target.value) || 50)}
                    placeholder='50'
                />
                <div className='text-muted small'>
                    {t('donut_hole_size_description')}
                </div>
            </div>
        )}
        
        {!isSunburst && <div className='mt-3'>
            <Form.Check
                type='checkbox'
                id='show-percentages-checkbox'
                label={t('show_percentages')}
                checked={config?.showPercentages || false}
                onChange={(e) => handleChange('showPercentages', e.target.checked)}
            />
            <div className='text-muted small'>
                {t('show_percentages_description')}
            </div>
        </div>}
    </>;
};

export default PieSettings;
