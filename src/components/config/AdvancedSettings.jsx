import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import { ChartFieldRequirements } from '../../constants/graph-requirements';
import { ChartColors, ChartPalettes } from '../../constants/chart-colors';
import ChartTypePicker from '../config/ChartTypePicker';
import ColorSelector from '../config/ColorSelector';

const AdvancedSettings = ({ cfg, setCfg, type, setType, data }) => {
    const [draft, setDraft] = useState(cfg);

    useEffect(() => setDraft(cfg), [cfg]);
    const debouncedCommit = useMemo(() => debounce(setCfg, 400), [setCfg]);
    useEffect(() => () => debouncedCommit.flush(), [debouncedCommit]);

    const requirements = ChartFieldRequirements[type] || { required: [], optional: [] };
    const requiredFieldsRaw = requirements.required || [];
    const optionalFields = requirements.optional || [];

    const requiredFields = type === 'parallel'
        ? requiredFieldsRaw.filter(f => f !== 'dimensions')
        : requiredFieldsRaw;

    const hasPalette = optionalFields.includes('palette');
    const hasColor = optionalFields.includes('color');
    const hasDonutHole = optionalFields.includes('donutHole');
    const hasTitle = optionalFields.includes('title');

    const colorMode = hasPalette ? 'multi' : hasColor ? 'single' : null;

    useEffect(() => {
        if (colorMode === 'single') {
            const updated = { ...draft, color: draft.color || ChartColors[0], palette: undefined };
            setDraft(updated);
            debouncedCommit(updated);
        } else if (colorMode === 'multi') {
            const seed = draft.palette && draft.palette.length ? draft.palette : ChartPalettes[0].colors;
            const updated = { ...draft, palette: seed, color: undefined };
            setDraft(updated);
            debouncedCommit(updated);
        } else {
            const updated = { ...draft, color: undefined, palette: undefined };
            setDraft(updated);
            debouncedCommit(updated);
        }
        if (!hasTitle && draft.title) {
            const updated = { ...draft, title: '' };
            setDraft(updated);
            debouncedCommit(updated);
        }
    }, [type]);

    const handleInput = (name, value) => {
        const next = name === 'donutHole' ? Number(value) : value;
        const updated = { ...draft, [name]: next };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const handleChartTypeChange = (newType) => setType(newType);

    const columns = useMemo(() => {
        if (!data || typeof data !== 'object') return [];
        if (Array.isArray(data.columns)) return data.columns;
        if (Array.isArray(data.values) && data.values.length > 0) {
            const firstRow = data.values.find(r => typeof r === 'object' && r !== null);
            if (firstRow) return Object.keys(firstRow).filter(k => k !== '__rowNum__');
        }
        return [];
    }, [data]);

    const setSingleColor = (hex) => {
        const updated = { ...draft, color: hex, palette: undefined };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const setPalette = (arr) => {
        const updated = { ...draft, palette: arr, color: undefined };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const handleDimensionsSelect = (selected) => {
        const values = Array.isArray(selected) ? selected.map(o => o.value) : [];
        const updated = { ...draft, dimensions: values };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const moveDim = (idx, dir) => {
        const list = [...(draft.dimensions || [])];
        const j = idx + dir;
        if (j < 0 || j >= list.length) return;
        const tmp = list[idx];
        list[idx] = list[j];
        list[j] = tmp;
        const updated = { ...draft, dimensions: list };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const removeDim = (idx) => {
        const list = [...(draft.dimensions || [])];
        list.splice(idx, 1);
        const updated = { ...draft, dimensions: list };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const addMissingSelectedOptions = (opts, selectedValues) => {
        const set = new Set(opts.map(o => o.value));
        const missing = (selectedValues || []).filter(v => !set.has(v)).map(v => ({ value: v, label: v }));
        return opts.concat(missing);
    };

    const selectOptions = useMemo(() => {
        const opts = columns.map(c => ({ value: c, label: c }));
        return addMissingSelectedOptions(opts, draft.dimensions || []);
    }, [columns, draft.dimensions]);

    const selectedOptions = useMemo(() => {
        return (draft.dimensions || []).map(v => ({ value: v, label: v }));
    }, [draft.dimensions]);

    const showAesthetic = hasTitle || !!colorMode || hasDonutHole;

    return (
        <>
            <Card className='mb-3'>
                <Card.Body>
                    <ChartTypePicker value={type} onChange={handleChartTypeChange} />
                </Card.Body>
            </Card>

            {type === 'parallel' && columns.length > 0 && (
                <Card className='mb-3'>
                    <Card.Body>
                        <h4 className='mb-3 text-center'>Dimensions</h4>
                        <Form.Label>Select and order dimensions</Form.Label>
                        <Select
                            isMulti
                            options={selectOptions}
                            value={selectedOptions}
                            onChange={handleDimensionsSelect}
                            className='mb-3'
                            classNamePrefix='ncg-select'
                            placeholder='Pick dimensions'
                        />
                        {(draft.dimensions || []).length > 0 && (
                            <div className='list-group'>
                                {(draft.dimensions || []).map((d, i) => (
                                    <div key={`${d}-${i}`} className='list-group-item d-flex justify-content-between align-items-center'>
                                        <span className='me-2'>{d}</span>
                                        <div className='btn-group'>
                                            <Button variant='outline-secondary' size='sm' onClick={() => moveDim(i, -1)}>↑</Button>
                                            <Button variant='outline-secondary' size='sm' onClick={() => moveDim(i, 1)}>↓</Button>
                                            <Button variant='outline-danger' size='sm' onClick={() => removeDim(i)}>✕</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}

            {requiredFields.length > 0 && columns.length > 0 && (
                <Card className='mb-3'>
                    <Card.Body>
                        <h4 className='mb-3 text-center'>Column Mapping</h4>
                        <Row>
                            {requiredFields.map((field) => {
                                const value = draft[`field_${field}`] ?? '';
                                const options = columns.map(col => ({ value: col, label: col }));
                                const selected = options.find(o => o.value === value) || null;
                                return (
                                    <Col md={6} key={field} className='mb-3'>
                                        <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                                        <Select
                                            options={options}
                                            value={selected}
                                            onChange={(opt) => handleInput(`field_${field}`, opt?.value || '')}
                                            classNamePrefix='ncg-select'
                                            placeholder='Select column'
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {showAesthetic && (
                <Card>
                    <Card.Body>
                        <h4 className='mb-3 text-center'>Aesthetic Changes</h4>

                        {hasTitle && (
                            <>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='title'
                                    value={draft.title || ''}
                                    placeholder='Enter chart title'
                                    onChange={(e) => handleInput('title', e.target.value)}
                                />
                            </>
                        )}

                        {colorMode && (
                            <div className='mt-3'>
                                {colorMode === 'single' ? (
                                    <ColorSelector
                                        value={draft.color || ChartColors[0]}
                                        onChange={setSingleColor}
                                        palette={ChartColors}
                                        mode='single'
                                        label='Color'
                                    />
                                ) : (
                                    <ColorSelector
                                        value={draft.palette || ChartPalettes[0].colors}
                                        onChange={setPalette}
                                        palettes={ChartPalettes}
                                        mode='multi'
                                        label='Palette'
                                    />
                                )}
                            </div>
                        )}
                        {hasDonutHole && (
                            <div className='mt-3'>
                                <Form.Label>Donut Hole Size (%)</Form.Label>
                                <Form.Range
                                    min={0}
                                    max={80}
                                    step={5}
                                    name='donutHole'
                                    value={draft.donutHole ?? 55}
                                    onChange={(e) => handleInput('donutHole', e.target.value)}
                                />
                                <div className='text-muted small'>{draft.donutHole ?? 55}%</div>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}
        </>
    );
};

export default AdvancedSettings;
