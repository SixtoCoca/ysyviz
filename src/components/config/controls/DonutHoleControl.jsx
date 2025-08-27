import { Form } from 'react-bootstrap';

const DonutHoleControl = ({ value, onChange }) => {
    const v = typeof value === 'number' ? value : 55;
    return <>
        <div className='mt-3'>
            <Form.Label>Donut Hole Size (%)</Form.Label>
            <Form.Range
                min={0}
                max={80}
                step={5}
                value={v}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className='text-muted small'>{v}%</div>
        </div>
    </>
};

export default DonutHoleControl;
