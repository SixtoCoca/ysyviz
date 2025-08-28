import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const CustomLegendControl = ({ value, onChange }) => {
    const { t } = useLanguage();
    return <>
        <div className='mt-3'>
            <Form.Label>{t('custom_legend')}</Form.Label>
            <Form.Control
                as='textarea'
                rows={3}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t('enter_custom_legend')}
            />
            <div className='text-muted small'>
                {t('add_custom_text')}
            </div>
        </div>
    </>
};

export default CustomLegendControl;