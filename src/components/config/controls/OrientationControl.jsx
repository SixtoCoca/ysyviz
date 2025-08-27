import { Form } from 'react-bootstrap';

const OrientationControl = ({ value, onChange }) => {
    const isHorizontal = value === 'horizontal';
    return <>
        <div className='mt-3'>
            <Form.Check
                type='checkbox'
                id='orientation-checkbox'
                label='Horizontal Orientation'
                checked={isHorizontal}
                onChange={(e) => onChange(e.target.checked ? 'horizontal' : 'vertical')}
            />
            <div className='text-muted small'>
                {isHorizontal ? 'Categories on Y-axis, values on X-axis' : 'Categories on X-axis, values on Y-axis'}
            </div>
        </div>
    </>
};

export default OrientationControl;
