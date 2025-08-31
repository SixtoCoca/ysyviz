import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const TitleControl = ({ value, onChange, ...props }) => {
    const { t } = useLanguage();
    return <>
        <div className='mb-3' data-testid="title-control">
            <Form.Label data-testid="title-label">{t('title')}</Form.Label>
            <Form.Control
                type='text'
                value={value || ''}
                placeholder={`${t('enter')} ${t('title').toLowerCase()}`}
                onChange={(e) => onChange(e.target.value)}
                data-testid="title-field"
                {...props}
            />
        </div>
    </>
};

export default TitleControl;
