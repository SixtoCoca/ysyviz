import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';

const ChordDataInfo = () => {
    const { t } = useLanguage();
    return (
        <Alert variant='info' className='mb-3'>
            <div className='d-flex align-items-start'>
                <FontAwesomeIcon 
                    icon={faInfoCircle} 
                    className='text-info me-2 mt-1' 
                    style={{ fontSize: '16px' }}
                />
                <div>
                    <h6 className='mb-2 fw-bold'>{t('chord_data_format')}</h6>
                    <p className='mb-2 small'>
                        {t('chord_description')}
                    </p>
                    <ul className='mb-2 small'>
                        <li>{t('chord_entity_row')}</li>
                        <li>{t('chord_entity_column')}</li>
                        <li>{t('chord_values')}</li>
                    </ul>
                    <div className='small'>
                        <strong>{t('example_csv_format')}</strong>
                        <div className='bg-light p-2 rounded mt-1 font-monospace' style={{ fontSize: '11px' }}>
                            Entity,Apple,Google,Microsoft<br/>
                            Apple,0,50,30<br/>
                            Google,50,0,25<br/>
                            Microsoft,30,25,0
                        </div>
                    </div>
                </div>
            </div>
        </Alert>
    );
};

export default ChordDataInfo;
