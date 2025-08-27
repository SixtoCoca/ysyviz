import { Card, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { useMemo } from 'react';

const DimensionsPanel = ({ columns, values, onChange, moveDim, removeDim }) => {
    const options = useMemo(() => columns.map(c => ({ value: c, label: c })), [columns]);
    const selected = useMemo(() => (values || []).map(v => ({ value: v, label: v })), [values]);

    return <>
        <Card className='mb-3'>
            <Card.Body>
                <h4 className='mb-3 text-center'>Dimensions</h4>
                <Form.Label>Select and order dimensions</Form.Label>
                <Select
                    isMulti
                    options={options}
                    value={selected}
                    onChange={(sel) => onChange(Array.isArray(sel) ? sel.map(o => o.value) : [])}
                    className='mb-3'
                    classNamePrefix='ncg-select'
                    placeholder='Pick dimensions'
                />
                {(values || []).length > 0 &&
                    <div className='list-group'>
                        {(values || []).map((d, i) =>
                            <div key={`${d}-${i}`} className='list-group-item d-flex justify-content-between align-items-center'>
                                <span className='me-2'>{d}</span>
                                <div className='btn-group'>
                                    <Button variant='outline-secondary' size='sm' onClick={() => moveDim(i, -1)}>↑</Button>
                                    <Button variant='outline-secondary' size='sm' onClick={() => moveDim(i, 1)}>↓</Button>
                                    <Button variant='outline-danger' size='sm' onClick={() => removeDim(i)}>✕</Button>
                                </div>
                            </div>
                        )}
                    </div>
                }
            </Card.Body>
        </Card>
    </>
};

export default DimensionsPanel;
