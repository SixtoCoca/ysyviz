import { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { CirclePicker } from 'react-color';
import { ChartColors } from '../../../constants/chart-colors';

const SingleColorControl = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const palette = useMemo(() => ChartColors, []);
    const singleValue = useMemo(() => value || palette[0], [value, palette]);

    useEffect(() => {
        const handler = (e) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return <>
        <div ref={wrapperRef} className='color-selector'>
            <Form.Label>Color</Form.Label>
            <div
                className='swatch swatch--single'
                onClick={() => setOpen(v => !v)}
                title='Pick color'
                style={{ background: singleValue }}
            />
            {open &&
                <div className='popover'>
                    <div className='popover__content'>
                        <CirclePicker
                            colors={palette}
                            color={singleValue}
                            circleSize={28}
                            circleSpacing={10}
                            width='180px'
                            onChange={(c) => onChange(c.hex)}
                        />
                        <div className='controls d-flex align-items-center justify-content-between mt-2'>
                            <div className='preview-wrap d-flex align-items-center gap-2'>
                                <div className='preview border rounded' style={{ width: 24, height: 24, background: singleValue }} />
                                <Form.Control
                                    type='color'
                                    value={singleValue}
                                    onChange={(e) => onChange(e.target.value)}
                                    className='preview-input'
                                    aria-label='Custom color'
                                />
                            </div>
                            <Button variant='secondary' size='sm' onClick={() => setOpen(false)}>Done</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    </>
};

export default SingleColorControl;
