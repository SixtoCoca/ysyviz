import { Form } from 'react-bootstrap';
import Select from 'react-select';

const CustomLegendPositionControl = ({ value, onChange }) => {
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
            <Form.Label>Custom Legend Position</Form.Label>
            <Select
                options={options}
                value={current}
                onChange={(opt) => onChange(opt.value)}
                classNamePrefix='ncg-select'
                placeholder='Select custom legend position'
            />
            <div className='text-muted small'>
                Choose where to display the custom legend text
            </div>
        </div>
    </>
};

export default CustomLegendPositionControl;
