import { Form, Alert } from 'react-bootstrap';
import { useState, useCallback, useRef } from 'react';
import * as d3 from 'd3';
import * as XLSX from 'xlsx';
import { useChartHelpText } from './hooks/useChartHelpText';

const DataUploader = ({ setData, type }) => {
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);
    const helpText = useChartHelpText(type);

    const handleFile = (file) => {
        const reader = new FileReader();

        if (file.name.endsWith('.csv')) {
            reader.onload = (event) => {
                try {
                    const raw = d3.csvParse(event.target.result);
                    const columns = Object.keys(raw[0] || {});
                    setData({ values: raw, columns });
                } catch {
                    setError('Error processing CSV file');
                }
            };
            reader.readAsText(file);
        } else if (file.name.endsWith('.xlsx')) {
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    const columns = Object.keys(jsonData[0] || {});
                    setData({ values: jsonData, columns });
                } catch {
                    setError('Error processing Excel file');
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            setError('Unsupported file format. Please upload a .csv or .xlsx file.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
            const dt = new DataTransfer();
            dt.items.add(file);
            if (inputRef.current) {
                inputRef.current.files = dt.files;
            }
        }
    }, []);

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label><strong>Upload Data</strong></Form.Label>
                <div
                    className={`border border-secondary rounded p-4 text-center bg-light ${dragActive ? 'border-primary bg-white' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                    onDrop={handleDrop}
                >
                    <p className="mb-2">Drag & drop your file here, or click to select</p>
                    <Form.Control
                        type="file"
                        accept=".csv, .xlsx"
                        onChange={handleFileChange}
                        ref={inputRef}
                        className="mx-auto"
                        style={{ maxWidth: '300px' }}
                    />
                </div>
                <Form.Text className="text-muted">{helpText}</Form.Text>
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}
        </>
    );
};

export default DataUploader;
