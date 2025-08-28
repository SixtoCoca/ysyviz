import { Form } from 'react-bootstrap';

const CustomLegendControl = ({ value, onChange }) => {
    return <>
        <div className='mt-3'>
            <Form.Label>Custom Legend</Form.Label>
            <Form.Control
                type='text'
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder='Enter custom legend text'
            />
            <div className='text-muted small'>
                Add custom text to display as legend
            </div>
        </div>
    </>
};

export default CustomLegendControl;
