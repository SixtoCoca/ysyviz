import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { isMappingValid } from '../utils/mappingValidation';
import FieldInfoTooltip from '../FieldInfoTooltip';
import ChordDataInfo from '../ChordDataInfo';
import { useLanguage } from '../../../contexts/LanguageContext';

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
    const { t } = useLanguage();
    if (!columns.length) return null;
    
    const opts = columns.map(col => ({ value: col, label: col }));
    
    const fieldLabel = (field) => {
        const labels = {
            category: t('category'),
            value: t('value'),
            x: t('x_axis'),
            y: t('y_axis'),
            r: t('radius'),
            label: t('label'),
            group: t('group'),
            source: t('source'),
            target: t('target'),
            series: t('series'),
            field_series: t('series'),
            pyramid_left: t('pyramid_left'),
            pyramid_right: t('pyramid_right')
        };
        return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
    };

    const valueFor = (field) => {
        const key = field.startsWith('field_') ? field : `field_${field}`;
        return draft?.[key] || '';
    };

    const isMultiValueField = (field) => {
        const multiValueFields = ['value', 'y'];
        const multiValueXFields = ['x', 'group'];
        const supportsMultiValue = ['bar', 'line', 'area', 'scatter', 'bubble'].includes(chartType);
        const supportsMultiValueX = ['violin', 'boxplot'].includes(chartType);
        
        if (supportsMultiValue && multiValueFields.includes(field)) {
            return true;
        }
        
        if (supportsMultiValueX && multiValueXFields.includes(field)) {
            return true;
        }
        
        return false;
    };

    const getMultiValueField = (field) => {
        const key = field.startsWith('field_') ? field : `field_${field}`;
        return Array.isArray(draft?.[key]) ? draft[key] : [];
    };

    const handleMultiValueChange = (field, selected) => {
        const key = field.startsWith('field_') ? field : `field_${field}`;
        const values = selected ? selected.map(s => s.value) : [];
        onFieldChange(key, values);
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
        <Card className='mb-3' data-testid="data-mapping-panel">
            <Card.Body>
                <h4 className='mb-3 text-center' data-testid="column-mapping-title">{t('column_mapping')}</h4>
                {chartType === 'chord' && <ChordDataInfo />}
                {allFields.length > 0 ? (
                    <Row>
                        {allFields.map((field) => {
                            if (field === 'dimensions') {
                                return (
                                    <Col md={12} key={field} className='mb-3'>
                                        <Form.Label data-testid="dimensions-label">
                                            {t('dimensions')}
                                            <FieldInfoTooltip fieldName='dimensions' chartType={chartType} />
                                            {dimensionsRequired && <span className='text-danger ms-1'>*</span>}
                                        </Form.Label>
                                        <Select
                                            isMulti
                                            isClearable
                                            options={opts}
                                            value={dimensionsValues.map(v => ({ value: v, label: v }))}
                                            onChange={(selected) => onDimensionsChange(selected ? selected.map(s => s.value) : [])}
                                            classNamePrefix='ncg-select'
                                            placeholder={t('select_dimensions')}
                                            data-testid="dimensions-field"
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
                                                                    data-testid={`move-dim-up-${i}`}
                                                                >
                                                                    ↑
                                                                </Button>
                                                                <Button 
                                                                    variant='outline-secondary' 
                                                                    size='sm' 
                                                                    onClick={() => moveDim(i, 1)}
                                                                    disabled={i === dimensionsValues.length - 1}
                                                                    data-testid={`move-dim-down-${i}`}
                                                                >
                                                                    ↓
                                                                </Button>
                                                                <Button 
                                                                    variant='outline-danger' 
                                                                    size='sm' 
                                                                    onClick={() => removeDim(i)}
                                                                    data-testid={`remove-dim-${i}`}
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
                            const isMultiValue = isMultiValueField(field);
                            
                            if (isMultiValue) {
                                const selectedValues = getMultiValueField(field);
                                const selected = selectedValues.map(v => opts.find(o => o.value === v)).filter(Boolean);
                                
                                return (
                                    <Col md={6} key={field} className='mb-3'>
                                        <Form.Label data-testid={`${field}-label`}>
                                            {fieldLabel(field)}
                                            <FieldInfoTooltip fieldName={field} />
                                            {isRequired && <span className='text-danger ms-1'>*</span>}
                                        </Form.Label>
                                        <Select
                                            isMulti
                                            isClearable
                                            options={opts}
                                            value={selected}
                                            onChange={(selected) => handleMultiValueChange(key, selected)}
                                            classNamePrefix='ncg-select'
                                            placeholder={t('select_columns')}
                                            data-testid={`${field}-field`}
                                        />
                                        {selectedValues.length > 1 && (
                                            <div className='mt-2'>
                                                <Form.Text className='text-muted small'>
                                                    {t('multiple_columns_selected')}: {selectedValues.length} {t('series')}
                                                </Form.Text>
                                            </div>
                                        )}
                                    </Col>
                                );
                            }
                            
                            const selected = opts.find(o => o.value === valueFor(field)) || null;
                            
                            return (
                                <Col md={6} key={field} className='mb-3'>
                                    <Form.Label data-testid={`${field}-label`}>
                                        {fieldLabel(field)}
                                        <FieldInfoTooltip fieldName={field} />
                                        {isRequired && <span className='text-danger ms-1'>*</span>}
                                    </Form.Label>
                                    <div data-testid={`${field}-field`}>
                                        <Select
                                            isClearable
                                            options={opts}
                                            value={selected}
                                            onChange={(opt) => onFieldChange(key, opt?.value || '')}
                                            classNamePrefix='ncg-select'
                                            placeholder={t('select_column')}
                                        />
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <p className='text-muted text-center' data-testid="no-mapping-required">{t('no_mapping_required')}</p>
                )}
            </Card.Body>
        </Card>
    </>
};

export default DataMappingPanel;
