import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const OrientationControl = ({ value, onChange }) => {
    const { t } = useLanguage();
    const isHorizontal = value === 'horizontal';
    return <>
        <div className='mt-3' data-testid="orientation-control">
            <Form.Check
                type='checkbox'
                id='orientation-checkbox'
                label={t('horizontal_orientation')}
                checked={isHorizontal}
                onChange={(e) => onChange(e.target.checked ? 'horizontal' : 'vertical')}
                data-testid="orientation-field"
            />
            <div className='text-muted small'>
                {isHorizontal ? t('horizontal_description') : t('vertical_description')}
            </div>
        </div>
    </>
};

export default OrientationControl;
