import { useEffect, useMemo, useRef, useState } from 'react';
import { CirclePicker } from 'react-color';
import './ColorSelector.css';

const PaletteCard = ({ palette, selected, onSelect }) => (
    <button
        type="button"
        onClick={() => onSelect(palette)}
        className={`palette-card ${selected ? 'is-selected' : ''}`}
    >
        <div className="palette-card__grid">
            {palette.colors.slice(0, 9).map((c, i) => (
                <div key={`${palette.id}-${i}`} className="palette-dot" style={{ background: c }} />
            ))}
        </div>
        <div className="palette-card__name">{palette.name}</div>
    </button>
);

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
        <div ref={wrapperRef} className="color-selector">
            <label className="color-selector__label">{isMulti ? 'Palette' : label}</label>

            {!isMulti && (
                <>
                    <div
                        onClick={() => setOpen(v => !v)}
                        className="swatch swatch--single"
                        style={{ background: singleValue }}
                        title="Pick color"
                    />
                    {open && (
                        <div className="popover">
                            <div className="popover__content">
                                <CirclePicker
                                    colors={palette}
                                    color={singleValue}
                                    circleSize={28}
                                    circleSpacing={10}
                                    width="180px"
                                    onChange={(c) => onChange(c.hex)}
                                />
                                <div className="controls">
                                    <div className="preview-wrap">
                                        <div className="preview" style={{ background: singleValue }} />
                                        <input
                                            type="color"
                                            value={singleValue || palette?.[0] || '#000000'}
                                            onChange={(e) => onChange(e.target.value)}
                                            className="preview-input"
                                            aria-label="Custom color"
                                        />
                                    </div>
                                    <button type="button" onClick={() => setOpen(false)} className="btn">
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {isMulti && (
                <>
                    <div
                        onClick={() => setOpen(v => !v)}
                        className="swatch swatch--palette"
                        title="Pick palette"
                    >
                        <div className="palette-grid">
                            {(multiValue.length ? multiValue : (palette || [])).slice(0, 9).map((c, i) => (
                                <div key={`preview-${i}`} className="palette-dot" style={{ background: c }} />
                            ))}
                        </div>
                    </div>

                    {open && (
                        <div className="popover">
                            <div className="popover__content popover__content--palettes">
                                <div className="palette-cards">
                                    {palettes.map(p => (
                                        <PaletteCard
                                            key={p.id}
                                            palette={p}
                                            selected={JSON.stringify(p.colors) === JSON.stringify(multiValue)}
                                            onSelect={(pal) => { onChange(pal.colors); setOpen(false); }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ColorSelector;
