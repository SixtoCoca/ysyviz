import { Card, Form, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useMemo } from 'react';
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
    const requiredFields = requirements.required || [];
    const optionalFields = requirements.optional || [];

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

    const handleInput = (e) => {
        const { name, value } = e.target;
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

    const showAesthetic = hasTitle || !!colorMode || hasDonutHole;

    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <h4 className="mb-3 text-center">Chart Type</h4>
                    <ChartTypePicker value={type} onChange={handleChartTypeChange} />
                </Card.Body>
            </Card>

            {requiredFields.length > 0 && columns.length > 0 && (
                <Card className="mb-3">
                    <Card.Body>
                        <h4 className="mb-3 text-center">Column Mapping</h4>
                        <Row>
                            {requiredFields.map((field) => (
                                <Col md={6} key={field} className="mb-3">
                                    <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                                    <Form.Select
                                        name={`field_${field}`}
                                        value={draft[`field_${field}`] ?? ''}
                                        onChange={handleInput}
                                    >
                                        <option value="">Select column</option>
                                        {columns.map(col => (
                                            <option key={col} value={col}>{col}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {showAesthetic && (
                <Card>
                    <Card.Body>
                        <h4 className="mb-3 text-center">Aesthetic Changes</h4>

                        {hasTitle && (
                            <>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={draft.title || ''}
                                    placeholder="Enter chart title"
                                    onChange={handleInput}
                                />
                            </>
                        )}

                        {colorMode && (
                            <div className="mt-3">
                                {colorMode === 'single' ? (
                                    <ColorSelector
                                        value={draft.color || ChartColors[0]}
                                        onChange={setSingleColor}
                                        palette={ChartColors}
                                        mode="single"
                                        label="Color"
                                    />
                                ) : (
                                    <ColorSelector
                                        value={draft.palette || ChartPalettes[0].colors}
                                        onChange={setPalette}
                                        palettes={ChartPalettes}
                                        mode="multi"
                                        label="Palette"
                                    />
                                )}
                            </div>
                        )}
                        {hasDonutHole && (
                            <div className="mt-3">
                                <Form.Label>Donut Hole Size (%)</Form.Label>
                                <Form.Range
                                    min={0}
                                    max={80}
                                    step={5}
                                    name="donutHole"
                                    value={draft.donutHole ?? 55}
                                    onChange={handleInput}
                                />
                                <div className="text-muted small">{draft.donutHole ?? 55}%</div>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}
        </>
    );
};

export default AdvancedSettings;
