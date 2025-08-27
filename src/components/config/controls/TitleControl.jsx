import { Form } from 'react-bootstrap';

const TitleControl = ({ value, onChange }) => {
    return <>
        <div className='mb-3'>
            <Form.Label>Title</Form.Label>
            <Form.Control
                type='text'
                value={value || ''}
                placeholder='Enter chart title'
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </>
};

export default TitleControl;
