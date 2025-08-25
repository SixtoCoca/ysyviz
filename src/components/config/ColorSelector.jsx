import { useEffect, useMemo, useRef, useState } from 'react';
import { CirclePicker } from 'react-color';
import Select from 'react-select';
import './ColorSelector.css';

const ColorSelector = ({ value, onChange, palette, mode = 'single', label = 'Color', palettes = [] }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const isMulti = useMemo(() => mode === 'multi', [mode]);
    const singleValue = Array.isArray(value) ? palette?.[0] : value || palette?.[0];
    const multiValue = Array.isArray(value) ? value : [];

    useEffect(() => {
        const handler = (e) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={wrapperRef} className='color-selector'>
            <label className='color-selector__label'>{isMulti ? 'Palette' : label}</label>

            {!isMulti && (
                <>
                    <div
                        onClick={() => setOpen(v => !v)}
                        className='swatch swatch--single'
                        style={{ background: singleValue }}
                        title='Pick color'
                    />
                    {open && (
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
                                <div className='controls'>
                                    <div className='preview-wrap'>
                                        <div className='preview' style={{ background: singleValue }} />
                                        <input
                                            type='color'
                                            value={singleValue || palette?.[0] || '#000000'}
                                            onChange={(e) => onChange(e.target.value)}
                                            className='preview-input'
                                            aria-label='Custom color'
                                        />
                                    </div>
                                    <button type='button' onClick={() => setOpen(false)} className='btn'>
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {isMulti && (
                <Select
                    options={palettes.map(p => ({ value: p.id, label: p.name, colors: p.colors }))}
                    value={
                        palettes
                            .map(p => ({ value: p.id, label: p.name, colors: p.colors }))
                            .find(o => JSON.stringify(o.colors) === JSON.stringify(multiValue)) || null
                    }
                    onChange={(opt) => onChange(opt?.colors || [])}
                    classNamePrefix='ncg-select'
                    placeholder='Pick palette'
                    formatOptionLabel={(opt) => (
                        <div className='d-flex align-items-center'>
                            <div className='d-flex flex-wrap gap-1 me-2' style={{ width: 72 }}>
                                {opt.colors.slice(0, 8).map((c, i) => (
                                    <span
                                        key={`${opt.value}-${i}`}
                                        className='d-inline-block rounded border'
                                        style={{ width: 14, height: 14, background: c }}
                                    />
                                ))}
                            </div>
                            <span>{opt.label}</span>
                        </div>
                    )}
                />
            )}
        </div>
    );
};

export default ColorSelector;
