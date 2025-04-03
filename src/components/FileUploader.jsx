import { Form, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import * as d3 from 'd3';
import { ChartTypes } from "../constants/graph-type";

function
  FileUploader({ setData, type, setType }) {
  const [error, setError] = useState('');
  const [csvData, setCsvData] = useState(null);

  const processCSV = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvData = d3.csvParse(event.target.result);
        if (csvData.length === 0) {
          setError('The CSV file is empty');
          return;
        }
        const columns = Object.keys(csvData[0]);

        if (columns.length < 2) {
          setError('CSV must have at least two columns');
          return;
        }

        const formattedData = {
          xAxisLabel: columns[0],
          yAxisLabel: columns[1],
          values: csvData.map((d) => ({
            x: d[columns[0]],
            y: +d[columns[1]]
          }))
        };
        setData(formattedData);

        setError('');
      } catch (err) {
        setError('Error processing CSV file');
        console.error(err);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setCsvData(e.target.files[0]);
      processCSV(e.target.files[0], type);
    }
  };

  const handleChartTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);

    setData(null);

    if (newType && csvData) {
      processCSV(csvData, newType);
    }
  };
  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label><strong>Select Chart Type</strong></Form.Label>
            <Form.Select
              value={type}
              onChange={handleChartTypeChange}
              className="mb-3"
            >
              <option value="">Select a chart type</option>
              {Object.keys(ChartTypes).map((key) => (
                <option key={key} value={ChartTypes[key]}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {type && (
            <Form.Group>
              <Form.Label>
                <strong>Upload Data</strong>
              </Form.Label>
              <Form.Control
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">
                Upload a CSV file with two columns: first column for labels, second column for numeric values
              </Form.Text>
            </Form.Group>
          )}
        </Form>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default FileUploader; 