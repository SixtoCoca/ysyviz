import { Card, Row, Col, Button } from 'react-bootstrap';
import { useMemo, useState } from 'react';
import { ChartThumbnails } from '../../constants/chart-thumbnails';
import { ChartTypes } from '../../constants/graph-type';

const PAGE_SIZE = 10;

const ChartTypePicker = ({ value, onChange }) => {
    const items = useMemo(() => {
        return Object.keys(ChartTypes).map(key => {
            const typeValue = ChartTypes[key];
            const label = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
            const img = ChartThumbnails[key.toLowerCase()] || ChartThumbnails.bar;
            return { key, value: typeValue, label, img };
        });
    }, []);

    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(items.length / PAGE_SIZE);
    const needsPagination = items.length > PAGE_SIZE;

    const start = page * PAGE_SIZE;
    const pageItems = needsPagination ? items.slice(start, start + PAGE_SIZE) : items;

    const goPrev = () => setPage(p => Math.max(0, p - 1));
    const goNext = () => setPage(p => Math.min(totalPages - 1, p + 1));

    return (
        <div>
            <div className='d-flex align-items-center justify-content-center mb-3'>
                {needsPagination && (
                    <Button
                        variant='light'
                        className='me-2 shadow-sm'
                        onClick={goPrev}
                        disabled={page === 0}
                        aria-label='Previous'
                    >
                        ‹
                    </Button>
                )}
                <h5 className='mb-0'>Chart Type</h5>
                {needsPagination && (
                    <Button
                        variant='light'
                        className='ms-2 shadow-sm'
                        onClick={goNext}
                        disabled={page >= totalPages - 1}
                        aria-label='Next'
                    >
                        ›
                    </Button>
                )}
            </div>

            <Row xs={2} sm={3} md={4} lg={5} className='g-3'>
                {pageItems.map(item => {
                    const selected = value === item.value;
                    return (
                        <Col key={item.key}>
                            <Card
                                role='button'
                                onClick={() => onChange(item.value)}
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onChange(item.value); }}
                                className={selected ? 'border-primary shadow-sm' : 'border-200'}
                            >
                                <div className='d-flex align-items-center justify-content-center p-3'>
                                    <img src={item.img} alt={item.label} className='img-fluid' />
                                </div>
                                <Card.Body className='py-2'>
                                    <div className='text-center fw-medium'>{item.label}</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {needsPagination && (
                <div className='d-flex justify-content-center mt-2'>
                    <span className='text-muted small'>{page + 1} / {totalPages}</span>
                </div>
            )}
        </div>
    );
};

export default ChartTypePicker;
