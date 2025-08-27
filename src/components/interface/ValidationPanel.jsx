import { Alert, ListGroup, Badge, Button } from 'react-bootstrap';

const levelVariant = level => {
    if (level === 'error') return 'danger';
    if (level === 'warning') return 'warning';
    return 'info';
};

const titleFor = level => {
    if (level === 'error') return 'Errors';
    if (level === 'warning') return 'Warnings';
    return 'Info';
};

const order = { error: 0, warning: 1, info: 2 };

const ValidationPanel = ({ issues = [], onClear }) => {
    const sorted = [...issues].sort((a, b) => (order[a.level] ?? 3) - (order[b.level] ?? 3));
    if (!sorted.length) return null;

    const counts = sorted.reduce((acc, i) => {
        acc[i.level] = (acc[i.level] || 0) + 1;
        return acc;
    }, {});

    const header = (
        <div className='d-flex justify-content-between align-items-center mb-2'>
            <div className='d-flex align-items-center gap-2'>
                <span className='fw-semibold'>Validation</span>
                <Badge bg='danger'>{counts.error || 0} errors</Badge>
                <Badge bg='warning' text='dark'>{counts.warning || 0} warnings</Badge>
                <Badge bg='info' text='dark'>{counts.info || 0} info</Badge>
            </div>
            {typeof onClear === 'function' && (
                <Button size='sm' variant='outline-secondary' onClick={onClear}>
                    Clear
                </Button>
            )}
        </div>
    );

    return (
        <Alert variant='light' className='border'>
            {header}
            <ListGroup variant='flush'>
                {sorted.map((it, idx) => (
                    <ListGroup.Item key={`${it.code || 'issue'}-${idx}`} className='d-flex justify-content-between align-items-start'>
                        <div>
                            <div className='fw-semibold'>{titleFor(it.level)}{it.code ? ` · ${it.code}` : ''}</div>
                            <div>{it.message || 'Unknown issue'}</div>
                        </div>
                        <Badge bg={levelVariant(it.level)} pill>
                            {it.level}
                        </Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Alert>
    );
};

export default ValidationPanel;
