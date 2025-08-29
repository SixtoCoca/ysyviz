import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const ViolinSettings = ({ config, onChange }) => {
    const { t } = useLanguage();
    
    const handleChange = (key, value) => {
        onChange({ ...config, [key]: value });
    };

    return <>
        <div className='mt-3'>
            <h6>{t('violin_settings')}</h6>
            
            <Form.Label>{t('smoothing')}</Form.Label>
            <Form.Control
                type='number'
                min='0'
                max='1'
                step='0.1'
                value={config?.smoothing !== undefined ? config.smoothing : 0.5}
                onChange={(e) => handleChange('smoothing', e.target.value === '' ? 0.5 : parseFloat(e.target.value))}
                placeholder='0.5'
            />
            <div className='text-muted small'>
                {t('smoothing_description')}
            </div>
        </div>
        
        <div className='mt-3'>
            <Form.Label>{t('kernel_type')}</Form.Label>
            <Form.Select
                value={config?.kernelType || 'epanechnikov'}
                onChange={(e) => handleChange('kernelType', e.target.value)}
            >
                <option value='epanechnikov'>{t('epanechnikov')}</option>
                <option value='gaussian'>{t('gaussian')}</option>
                <option value='triangular'>{t('triangular')}</option>
            </Form.Select>
            <div className='text-muted small'>
                {t('kernel_type_description')}
            </div>
        </div>
    </>;
};

export default ViolinSettings;
