import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';
import SingleColorControl from '../controls/SingleColorControl';

const PyramidSettings = ({ config, onChange }) => {
    const { t } = useLanguage();
    
    const handleChange = (key, value) => {
        onChange({ ...config, [key]: value });
    };

    return <>
        <div className='mt-3'>
            <h6>{t('pyramid_settings')}</h6>
            
            <div className='mt-3'>
                <h6>{t('bar_colors')}</h6>
                <SingleColorControl
                    value={config?.leftColor || '#ff6b6b'}
                    onChange={(value) => handleChange('leftColor', value)}
                    label={t('left_color')}
                />
                <div className='text-muted small'>
                    {t('left_color_description')}
                </div>
                
                <SingleColorControl
                    value={config?.rightColor || '#4ecdc4'}
                    onChange={(value) => handleChange('rightColor', value)}
                    label={t('right_color')}
                />
                <div className='text-muted small'>
                    {t('right_color_description')}
                </div>
            </div>
        </div>
    </>;
};

export default PyramidSettings;
