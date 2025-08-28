import { Form } from 'react-bootstrap';
import Select from 'react-select';

const LegendPositionControl = ({ value, onChange }) => {
    const options = [
        { value: 'top-left', label: 'Top Left' },
        { value: 'top-right', label: 'Top Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'bottom-right', label: 'Bottom Right' },
        { value: 'disabled', label: 'Disabled' }
    ];

    const current = options.find(opt => opt.value === (value || 'top-left')) || options[0];

    return <>
        <div className='mt-3'>
            <Form.Label>Legend Position</Form.Label>
            <Select
                options={options}
                value={current}
                onChange={(opt) => onChange(opt.value)}
                classNamePrefix='ncg-select'
                placeholder='Select legend position'
            />
            <div className='text-muted small'>
                Choose where to display the legend or disable it
            </div>
        </div>
    </>
};

export default LegendPositionControl;
