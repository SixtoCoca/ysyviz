import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const ChartPreviewMessage = ({ type, hasRequiredFields, hasErrors, chartData }) => {
    const { t } = useLanguage();
    if (!type) {
        return (
            <p className='text-muted text-center'>
                {t('select_chart_type')}
            </p>
        );
    }
    if (!hasRequiredFields) {
        return (
            <p className='text-muted text-center'>
                {t('complete_required_fields')}
            </p>
        );
    }
    if (hasErrors) {
        return (
            <p className='text-muted text-center'>
                {t('fix_validation_errors')}
            </p>
        );
    }
    if (!chartData) {
        return (
            <p className='text-muted text-center'>
                {t('upload_data_and_select_type')}
            </p>
        );
    }
    return null;
};

export default ChartPreviewMessage;
