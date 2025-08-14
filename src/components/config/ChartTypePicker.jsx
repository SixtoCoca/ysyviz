import { Card, Row, Col } from 'react-bootstrap';
import { useMemo } from 'react';
import { ChartThumbnails } from '../../constants/chart-thumbnails';
import { ChartTypes } from '../../constants/graph-type';

const ChartTypePicker = ({ value, onChange }) => {
    const items = useMemo(() => {
        return Object.keys(ChartTypes).map(key => {
            const typeValue = ChartTypes[key];
            const label = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
            const img = ChartThumbnails[key.toLowerCase()] || ChartThumbnails.bar;
            return { key, value: typeValue, label, img };
        });
    }, []);

    return (
        <Row xs={2} sm={3} md={4} lg={5} className="g-3">
            {items.map(item => {
                const selected = value === item.value;
                return (
                    <Col key={item.key}>
                        <Card
                            role="button"
                            onClick={() => onChange(item.value)}
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onChange(item.value); }}
                            className={selected ? 'border-primary shadow-sm' : 'border-200'}
                        >
                            <div className="d-flex align-items-center justify-content-center" style={{ height: 120, padding: 12 }}>
                                <img src={item.img} alt={item.label} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                            </div>
                            <Card.Body className="py-2">
                                <div className="text-center fw-medium">{item.label}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );
};

export default ChartTypePicker;
