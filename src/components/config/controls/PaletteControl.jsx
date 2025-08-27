import { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { ChartPalettes } from '../../../constants/chart-colors';

const PaletteControl = ({ value, onChange }) => {
    const options = useMemo(() => ChartPalettes.map(p => ({ value: p.id, label: p.name, colors: p.colors })), []);
    const current = useMemo(() => {
        const val = Array.isArray(value) ? value : [];
        return options.find(o => JSON.stringify(o.colors) === JSON.stringify(val)) || null;
    }, [value, options]);

    return <>
        <div className='color-selector'>
            <Form.Label>Palette</Form.Label>
            <Select
                options={options}
                value={current}
                onChange={(opt) => onChange(opt?.colors || [])}
                classNamePrefix='ncg-select'
                placeholder='Pick palette'
                formatOptionLabel={(opt) =>
                    <div className='d-flex align-items-center'>
                        <div className='d-flex flex-wrap gap-1 me-2' style={{ width: 72 }}>
                            {opt.colors.slice(0, 8).map((c, i) =>
                                <span key={`${opt.value}-${i}`} className='d-inline-block rounded border' style={{ width: 14, height: 14, background: c }} />
                            )}
                        </div>
                        <span>{opt.label}</span>
                    </div>
                }
            />
        </div>
    </>
};

export default PaletteControl;
