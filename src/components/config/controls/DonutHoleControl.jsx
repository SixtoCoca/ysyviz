import { Form } from 'react-bootstrap';

const DonutHoleControl = ({ value, onChange }) => {
    const v = typeof value === 'number' ? value : 55;
    return <>
        <div className='mt-3' data-testid="donut-hole-control">
            <Form.Label>Donut Hole Size (%)</Form.Label>
            <Form.Range
                min={0}
                max={80}
                step={5}
                value={v}
                onChange={(e) => onChange(e.target.value)}
                data-testid="donut-hole-field"
            />
            <div className='text-muted small' data-testid="donut-hole-value">{v}%</div>
        </div>
    </>
};

export default DonutHoleControl;
