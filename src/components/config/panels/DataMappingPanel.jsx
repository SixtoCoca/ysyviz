import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { isMappingValid } from '../utils/mappingValidation';
import FieldInfoTooltip from '../FieldInfoTooltip';
import ChordDataInfo from '../ChordDataInfo';

const DataMappingPanel = ({ 
    columns, 
    requiredFields, 
    optionalMappingKeys = [], 
    draft, 
    onFieldChange,
    dimensionsEnabled,
    dimensionsRequired,
    dimensionsValues,
    onDimensionsChange,
    moveDim,
    removeDim,
    chartType,
    requirements,
    onValidityChange
}) => {
    if (!columns.length) return null;
    
    const opts = columns.map(col => ({ value: col, label: col }));
    
    const fieldLabel = (field) => {
        const labels = {
            category: 'Category',
            value: 'Value',
            x: 'X Axis',
            y: 'Y Axis',
            r: 'Radius',
            label: 'Label',
            group: 'Group',
            source: 'Source',
            target: 'Target',
            series: 'Series',
            field_series: 'Series'
        };
        return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
    };

    const valueFor = (field) => {
        const key = field.startsWith('field_') ? field : `field_${field}`;
        return draft?.[key] || '';
    };

    const allFields = [...requiredFields, ...optionalMappingKeys];
    
    if (dimensionsEnabled && !allFields.includes('dimensions')) {
        allFields.push('dimensions');
    }

    if (onValidityChange && chartType && draft && requirements) {
        try {
            const isValid = isMappingValid(chartType, draft, requirements);
            onValidityChange(isValid);
        } catch (error) {
            console.warn('Validation error:', error);
            onValidityChange(false);
        }
    }

    return <>
        <Card className='mb-3'>
            <Card.Body>
                <h4 className='mb-3 text-center'>Column Mapping</h4>
                {chartType === 'chord' && <ChordDataInfo />}
                {allFields.length > 0 ? (
                    <Row>
                        {allFields.map((field) => {
                            if (field === 'dimensions') {
                                return (
                                    <Col md={12} key={field} className='mb-3'>
                                        <Form.Label>
                                            Dimensions
                                            <FieldInfoTooltip fieldName='dimensions' />
                                            {dimensionsRequired && <span className='text-danger ms-1'>*</span>}
                                        </Form.Label>
                                        <Select
                                            isMulti
                                            isClearable
                                            options={opts}
                                            value={dimensionsValues.map(v => ({ value: v, label: v }))}
                                            onChange={(selected) => onDimensionsChange(selected ? selected.map(s => s.value) : [])}
                                            classNamePrefix='ncg-select'
                                            placeholder='Select dimensions'
                                        />
                                        {dimensionsValues.length > 0 && (
                                            <div className='mt-3'>
                                                <Form.Text className='text-muted d-block mb-2'>
                                                    Order dimensions (drag or use buttons):
                                                </Form.Text>
                                                <div className='list-group'>
                                                    {dimensionsValues.map((d, i) => (
                                                        <div key={`${d}-${i}`} className='list-group-item d-flex justify-content-between align-items-center py-2'>
                                                            <span className='me-2'>{d}</span>
                                                            <div className='btn-group'>
                                                                <Button 
                                                                    variant='outline-secondary' 
                                                                    size='sm' 
                                                                    onClick={() => moveDim(i, -1)}
                                                                    disabled={i === 0}
                                                                >
                                                                    ↑
                                                                </Button>
                                                                <Button 
                                                                    variant='outline-secondary' 
                                                                    size='sm' 
                                                                    onClick={() => moveDim(i, 1)}
                                                                    disabled={i === dimensionsValues.length - 1}
                                                                >
                                                                    ↓
                                                                </Button>
                                                                <Button 
                                                                    variant='outline-danger' 
                                                                    size='sm' 
                                                                    onClick={() => removeDim(i)}
                                                                >
                                                                    ✕
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Col>
                                );
                            }

                            const key = field.startsWith('field_') ? field : `field_${field}`;
                            const isRequired = requiredFields.includes(field);
                            const selected = opts.find(o => o.value === valueFor(field)) || null;
                            
                            return (
                                <Col md={6} key={field} className='mb-3'>
                                    <Form.Label>
                                        {fieldLabel(field)}
                                        <FieldInfoTooltip fieldName={field} />
                                        {isRequired && <span className='text-danger ms-1'>*</span>}
                                    </Form.Label>
                                    <Select
                                        isClearable
                                        options={opts}
                                        value={selected}
                                        onChange={(opt) => onFieldChange(key, opt?.value || '')}
                                        classNamePrefix='ncg-select'
                                        placeholder='Select column'
                                    />
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <p className='text-muted text-center'>No mapping required</p>
                )}
            </Card.Body>
        </Card>
    </>
};

export default DataMappingPanel;
