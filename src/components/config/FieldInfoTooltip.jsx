import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { getFieldDescription } from '../../constants/field-descriptions';
import { useLanguage } from '../../contexts/LanguageContext';

const FieldInfoTooltip = ({ fieldName, chartType }) => {
    const { t } = useLanguage();
    const fieldInfo = getFieldDescription(fieldName, chartType);
    
    const tooltip = (
        <Tooltip id={`tooltip-${fieldName}`} className='field-info-tooltip'>
            <div className='p-2'>
                <div className='fw-bold mb-2'>{fieldInfo.title}</div>
                <div className='mb-2'>{fieldInfo.description}</div>
                <div className='mb-2'>
                    <strong>{t('format')}:</strong> {fieldInfo.format}
                </div>
                {fieldInfo.examples.length > 0 && (
                    <div>
                        <strong>{t('examples')}:</strong>
                        <ul className='mb-0 mt-1 ps-3'>
                            {fieldInfo.examples.map((example, index) => (
                                <li key={index} className='small'>{example}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Tooltip>
    );
    
    return (
        <OverlayTrigger
            placement='top'
            overlay={tooltip}
            trigger={['hover', 'focus']}
        >
            <FontAwesomeIcon 
                icon={faInfoCircle} 
                className='text-info ms-1' 
                style={{ cursor: 'help', fontSize: '14px' }}
            />
        </OverlayTrigger>
    );
};

export default FieldInfoTooltip;
