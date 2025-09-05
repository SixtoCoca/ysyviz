import React from 'react';
import AdvancedSettings from '../config/AdvancedSettings';
import ValidationPanel from './ValidationPanel';
import { useLanguage } from '../../contexts/LanguageContext';

const ConfigWithValidation = ({ cfg, setCfg, type, setType, setData, data, enableValidation, issues, onClearIssues }) => {
    const { t } = useLanguage();

    return (
        <div className='pane-scroll d-flex flex-column' data-testid="config-with-validation">
            <h5 className='mb-3 text-center'>{t('chart_configuration')}</h5>
            <AdvancedSettings
                cfg={cfg}
                setCfg={setCfg}
                type={type}
                setType={setType}
                setData={setData}
                data={data}
            />
            {enableValidation && (
                <div className='mt-3'>
                    <ValidationPanel issues={issues} onClear={onClearIssues} />
                </div>
            )}
        </div>
    );
};

export default ConfigWithValidation;
