import { Form } from 'react-bootstrap';
import { ChartTypes } from "../../constants/graph-type";

const ChartSelector = ({ type, setType, setData }) => {
    const handleChartTypeChange = (e) => {
        const newType = e.target.value;
        setType(newType);
        setData(null);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label><strong>Select Chart Type</strong></Form.Label>
            <Form.Select value={type} onChange={handleChartTypeChange} className="mb-3">
                <option value="">Select a chart type</option>
                {Object.keys(ChartTypes).map((key) => (
                    <option key={key} value={ChartTypes[key]}>
                        {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default ChartSelector;
