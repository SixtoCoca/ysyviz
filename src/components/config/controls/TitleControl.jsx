import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const TitleControl = ({ value, onChange }) => {
    const { t } = useLanguage();
    return <>
        <div className='mb-3'>
            <Form.Label>{t('title')}</Form.Label>
            <Form.Control
                type='text'
                value={value || ''}
                placeholder={`${t('enter')} ${t('title').toLowerCase()}`}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </>
};

export default TitleControl;
