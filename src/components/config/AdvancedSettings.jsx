import { Card, Form, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { ChartFieldRequirements } from '../../constants/graph-requirements';
import ChartTypePicker from '../config/ChartTypePicker';

const AdvancedSettings = ({ cfg, setCfg, type, setType, data, setData }) => {
    const [draft, setDraft] = useState(cfg);

    useEffect(() => setDraft(cfg), [cfg]);

    const debouncedCommit = useMemo(() => debounce(setCfg, 400), [setCfg]);

    useEffect(() => {
        return () => debouncedCommit.flush();
    }, [debouncedCommit]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...draft, [name]: value };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const handleChartTypeChange = (newType) => {
        setType(newType);
    };

    const requiredFields = ChartFieldRequirements[type]?.required || [];

    const columns = useMemo(() => {
        if (!data || typeof data !== 'object') return [];
        if (Array.isArray(data.columns)) {
            return data.columns;
        }
        if (Array.isArray(data.values) && data.values.length > 0) {
            const firstRow = data.values.find(row => typeof row === 'object' && row !== null);
            if (firstRow) {
                return Object.keys(firstRow).filter(k => k !== '__rowNum__');
            }
        }
        return [];
    }, [data]);

    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <h4 className="mb-3 text-center">Chart Type</h4>
                    <ChartTypePicker value={type} onChange={handleChartTypeChange} />
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <h4 className="mb-3 text-center">Chart Settings</h4>

                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={draft.title || ''}
                        placeholder="Enter chart title"
                        onChange={handleInput}
                    />

                    <Form.Label className="mt-3">Color</Form.Label>
                    <Form.Control
                        type="color"
                        name="color"
                        value={draft.color || '#000000'}
                        onChange={handleInput}
                    />

                    {requiredFields.length > 0 && columns.length > 0 && (
                        <div className="mt-4">
                            <h5 className="text-center">Column Mapping</h5>
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
                        </div>
                    )}
                </Card.Body>
            </Card>
        </>
    );
};

export default AdvancedSettings;
