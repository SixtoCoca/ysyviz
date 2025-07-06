import { Form, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import * as d3 from 'd3';
import * as XLSX from 'xlsx';
import { ChartTypes } from "../constants/graph-type";
import { useChartHelpText } from './interface/hooks/useChartHelpText';

const FileUploader = ({ setData, type, setType }) => {
  const [error, setError] = useState('');
  const [fileData, setFileData] = useState(null);
  const helpText = useChartHelpText(type);

  const processRawData = (raw, chartType) => {
    if (raw.length === 0) {
      setError('The file is empty');
      return;
    }

    const columns = Object.keys(raw[0]);

    if (chartType === 'bubble') {
      if (columns.length < 3) {
        setError('Bubble chart requires at least three columns: x, y, r');
        return;
      }

      setData({
        xAxisLabel: columns[0],
        yAxisLabel: columns[1],
        values: raw.map(d => ({
          x: +d[columns[0]],
          y: +d[columns[1]],
          r: +d[columns[2]],
        })),
      });
      setError('');
      return;
    }

    if (chartType === 'heatmap') {
      if (columns.length < 3) {
        setError('Heatmap requires three columns: x, y, value');
        return;
      }

      setData({
        xAxisLabel: columns[0],
        yAxisLabel: columns[1],
        values: raw.map(d => ({
          x: d[columns[0]],
          y: d[columns[1]],
          value: +d[columns[2]],
        })),
      });
      setError('');
      return;
    }

    if (chartType === 'sankey') {
      if (!raw[0].source || !raw[0].target || !raw[0].value) {
        setError('Sankey chart requires columns: source, target, value');
        return;
      }

      const cleanedLinks = raw.map(d => ({
        source: d.source.trim(),
        target: d.target.trim(),
        value: +d.value
      }));

      const nodeNames = Array.from(
        new Set(cleanedLinks.flatMap(d => [d.source, d.target]))
      );

      const nodes = nodeNames.map(name => ({ name }));

      setData({
        nodes,
        links: cleanedLinks
      });

      setError('');
      return;
    }

    if (chartType === 'chord') {
      if (columns.length < 2) {
        setError('Chord chart requires a square matrix with labels');
        return;
      }

      const labels = columns.slice(1);
      const matrix = raw.map(row =>
        labels.map(label => +row[label])
      );

      setData({ matrix, labels });
      setError('');
      return;
    }

    if (columns.length < 2) {
      setError('File must have at least two columns');
      return;
    }

    setData({
      xAxisLabel: columns[0],
      yAxisLabel: columns[1],
      values: raw.map(d => ({
        x: d[columns[0]],
        y: +d[columns[1]],
      })),
    });

    setError('');
  };

  const processCSV = (file, chartType) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const raw = d3.csvParse(event.target.result);
        processRawData(raw, chartType);
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

  const processXLSX = (file, chartType) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        processRawData(jsonData, chartType);
      } catch (err) {
        setError('Error processing Excel file');
        console.error(err);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileData(file);
    if (file.name.endsWith('.csv')) {
      processCSV(file, type);
    } else if (file.name.endsWith('.xlsx')) {
      processXLSX(file, type);
    } else {
      setError('Unsupported file format. Please upload a .csv or .xlsx file.');
    }
  };

  const handleChartTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    setData(null);
    if (newType && fileData) {
      if (fileData.name.endsWith('.csv')) {
        processCSV(fileData, newType);
      } else if (fileData.name.endsWith('.xlsx')) {
        processXLSX(fileData, newType);
      }
    }
  };

  return (
    <Card>
      <Card.Body>
        <Form>
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

          {type && (
            <Form.Group>
              <Form.Label><strong>Upload Data</strong></Form.Label>
              <Form.Control type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
              <Form.Text className="text-muted">
                {helpText}
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
};

export default FileUploader;
