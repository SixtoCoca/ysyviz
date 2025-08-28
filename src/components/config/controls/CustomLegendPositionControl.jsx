import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';
import Select from 'react-select';

const CustomLegendPositionControl = ({ value, onChange }) => {
    const { t } = useLanguage();
    const options = [
        { value: 'top-left', label: t('top_left') },
        { value: 'top-right', label: t('top_right') },
        { value: 'bottom-left', label: t('bottom_left') },
        { value: 'bottom-right', label: t('bottom_right') },
        { value: 'disabled', label: t('disabled') }
    ];

    const current = options.find(opt => opt.value === (value || 'top-left')) || options[0];

    return <>
        <div className='mt-3'>
            <Form.Label>{t('custom_legend_position')}</Form.Label>
            <Select
                options={options}
                value={current}
                onChange={(opt) => onChange(opt.value)}
                classNamePrefix='ncg-select'
                placeholder={t('select_custom_legend_position')}
            />
            <div className='text-muted small'>
                {t('choose_custom_legend_position')}
            </div>
        </div>
    </>
};

export default CustomLegendPositionControl;
