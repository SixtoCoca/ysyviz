import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const ChordDataInfo = () => {
    return (
        <Alert variant='info' className='mb-3'>
            <div className='d-flex align-items-start'>
                <FontAwesomeIcon 
                    icon={faInfoCircle} 
                    className='text-info me-2 mt-1' 
                    style={{ fontSize: '16px' }}
                />
                <div>
                    <h6 className='mb-2 fw-bold'>Chord Chart Data Format</h6>
                    <p className='mb-2 small'>
                        The Chord chart requires a <strong>relationship matrix</strong> where:
                    </p>
                    <ul className='mb-2 small'>
                        <li>Each row represents an entity (company, country, department, etc.)</li>
                        <li>Each column represents the same entities</li>
                        <li>Values in the matrix represent the strength of relationships between entities</li>
                    </ul>
                    <div className='small'>
                        <strong>Example CSV format:</strong>
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
