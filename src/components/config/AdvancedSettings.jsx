import { Card, Form } from 'react-bootstrap';
import { useChartConfig } from './hooks/useChartConfig';

const AdvancedSettings = ({ onChange }) => {
    const [cfg, setCfg] = useChartConfig();

    const updateTitle = (value) => {
        const next = { ...cfg, title: value };
        setCfg(next);
        onChange(next);
    };

    return (
        <Card className="h-100">
            <Card.Body>
                <h4 className="mb-3 text-center">Chart Settings</h4>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={cfg.title}
                    placeholder="Enter chart title"
                    onChange={(e) => updateTitle(e.target.value)}
                />
            </Card.Body>
        </Card>
    );
};

export default AdvancedSettings;
