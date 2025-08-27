import { Card, Row, Col, Form } from 'react-bootstrap';
import Select from 'react-select';

const DataMappingPanel = ({ columns, requiredFields, draft, onFieldChange }) => {
    if (!requiredFields.length || !columns.length) return null;
    const opts = columns.map(col => ({ value: col, label: col }));

    return <>
        <Card className='mb-3'>
            <Card.Body>
                <h4 className='mb-3 text-center'>Column Mapping</h4>
                <Row>
                    {requiredFields.map((field) => {
                        const key = `field_${field}`;
                        const selected = opts.find(o => o.value === draft[key]) || null;
                        return <>
                            <Col md={6} key={field} className='mb-3'>
                                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                                <Select
                                    options={opts}
                                    value={selected}
                                    onChange={(opt) => onFieldChange(key, opt?.value || '')}
                                    classNamePrefix='ncg-select'
                                    placeholder='Select column'
                                />
                            </Col>
                        </>
                    })}
                </Row>
            </Card.Body>
        </Card>
    </>
};

export default DataMappingPanel;
