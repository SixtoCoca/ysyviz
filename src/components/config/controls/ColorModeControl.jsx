import React from 'react';
import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const ColorModeControl = ({ value, onChange, disabled = false }) => {
    const { t } = useLanguage();

    return (
        <Form.Group>
            <Form.Label>{t('color_mode')}</Form.Label>
            <Form.Check
                type='switch'
                id='color-mode-switch'
                label={value === 'palette' ? t('palette_mode') : t('single_color_mode')}
                checked={value === 'palette'}
                onChange={(e) => onChange(e.target.checked ? 'palette' : 'color')}
                disabled={disabled}
            />
            <Form.Text className='text-muted'>
                {value === 'palette' ? t('palette_mode_description') : t('single_color_mode_description')}
            </Form.Text>
        </Form.Group>
    );
};

export default ColorModeControl;
