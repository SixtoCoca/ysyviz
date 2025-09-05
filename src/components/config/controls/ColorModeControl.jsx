import React from 'react';
import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const ColorModeControl = ({ value, onChange, disabled = false, ...props }) => {
    const { t } = useLanguage();

    return (
        <Form.Group data-testid="color-mode-control">
            <Form.Label data-testid="color-mode-label">{t('color_mode')}</Form.Label>
            <Form.Check
                type='switch'
                id='color-mode-switch'
                label={value === 'palette' ? t('palette_mode') : t('single_color_mode')}
                checked={value === 'palette'}
                onChange={(e) => onChange(e.target.checked ? 'palette' : 'color')}
                disabled={disabled}
                data-testid="color-mode-switch"
                {...props}
            />
            <Form.Text className='text-muted' data-testid="color-mode-description">
                {value === 'palette' ? t('palette_mode_description') : t('single_color_mode_description')}
            </Form.Text>
        </Form.Group>
    );
};

export default ColorModeControl;
