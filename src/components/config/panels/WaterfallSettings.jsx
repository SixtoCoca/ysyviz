import { Form } from 'react-bootstrap';
import SingleColorControl from '../controls/SingleColorControl';

const WaterfallSettings = ({ config, onChange }) => {
    const handleChange = (key, value) => {
        onChange({ ...config, [key]: value });
    };

    return <>
        <div className='mt-3'>
            <Form.Label>Initial Value</Form.Label>
            <Form.Control
                type='number'
                value={config?.initialValue || ''}
                onChange={(e) => handleChange('initialValue', e.target.value)}
                placeholder='0'
            />
            <div className='text-muted small'>
                Starting value for the waterfall calculation
            </div>
        </div>
        
        <div className='mt-3'>
            <h6>Bar Colors</h6>
            <SingleColorControl
                value={config?.upColor || '#28a745'}
                onChange={(value) => handleChange('upColor', value)}
                label='Up Bar (Positive Values)'
            />
            <div className='text-muted small'>
                Color for bars that increase the total (positive values)
            </div>
            
            <SingleColorControl
                value={config?.downColor || '#dc3545'}
                onChange={(value) => handleChange('downColor', value)}
                label='Down Bar (Negative Values)'
            />
            <div className='text-muted small'>
                Color for bars that decrease the total (negative values)
            </div>
        </div>
        
        <div className='mt-3'>
            <Form.Check
                type='checkbox'
                id='showFinalValue-checkbox'
                label='Show Final Value'
                checked={config?.showFinalValue || false}
                onChange={(e) => handleChange('showFinalValue', e.target.checked)}
            />
            <div className='text-muted small'>
                Display the cumulative total at the end of the waterfall
            </div>
        </div>
    </>;
};

export default WaterfallSettings;
