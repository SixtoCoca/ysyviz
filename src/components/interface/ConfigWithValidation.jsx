import React from 'react';
import AdvancedSettings from '../config/AdvancedSettings';
import ValidationPanel from './ValidationPanel';

const ConfigWithValidation = ({ cfg, setCfg, type, setType, setData, data, enableValidation, issues, onClearIssues }) => {
    return (
        <div className='pane-scroll d-flex flex-column' data-testid="config-with-validation">
            <h5 className='mb-3 text-center'>Chart Configuration</h5>
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
