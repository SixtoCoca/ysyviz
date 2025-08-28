import { Form, Alert, Button, Badge } from 'react-bootstrap';
import { useState, useCallback, useRef } from 'react';
import * as d3 from 'd3';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../contexts/LanguageContext';

const DataUploader = ({ setData, type, helpText }) => {
    const { t } = useLanguage();
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState('');
    const inputRef = useRef(null);

    const handleFileSelect = (file) => {
        setError('');
        setStatus('');
        setSelectedFile(file || null);
    };

    const readCSV = (text) => {
        const parsed = d3.csvParse(text);
        const columns = Object.keys(parsed[0] || {});
        return { rows: parsed, columns };
    };

    const readXLSX = (arrayBuffer) => {
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const columns = Object.keys(jsonData[0] || {});
        return { rows: jsonData, columns };
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        try {
            const reader = new FileReader();
            await new Promise((resolve, reject) => {
                reader.onload = (event) => {
                    try {
                        let res;
                        if (selectedFile.name.endsWith('.csv')) {
                            res = readCSV(event.target.result);
                        } else if (selectedFile.name.endsWith('.xlsx')) {
                            res = readXLSX(event.target.result);
                        } else {
                            throw new Error('Unsupported format');
                        }
                        setData({ values: res.rows, columns: res.columns });
                        setStatus('loaded');
                        toast.success(t('file_uploaded_successfully', { filename: selectedFile.name }));
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                };
                reader.onerror = () => reject(new Error('File read error'));
                if (selectedFile.name.endsWith('.csv')) {
                    reader.readAsText(selectedFile);
                } else {
                    reader.readAsArrayBuffer(selectedFile);
                }
            });
        } catch {
            setError(t('error_processing_file'));
            toast.error(t('error_uploading_file'));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    }, []);

    const openFileDialog = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.click();
        }
    };

    const humanSize = (bytes) => {
        if (!bytes && bytes !== 0) return '';
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(2)} MB`;
    };

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label><strong>{t('upload_data')}</strong></Form.Label>
                <div
                    role="button"
                    tabIndex={0}
                    onClick={openFileDialog}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
                    className={`border border-secondary rounded p-4 text-center bg-light ${dragActive ? 'border-primary bg-white' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                    onDrop={handleDrop}
                    style={{ cursor: 'pointer' }}
                >
                    <p className="mb-2">{t('drag_drop_message')}</p>
                    <Form.Control
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileChange}
                        ref={inputRef}
                        className="d-none"
                    />
                </div>
                {helpText && (
                    <Form.Text className="text-muted d-block mt-2">{helpText}</Form.Text>
                )}
            </Form.Group>

            {selectedFile && (
                <div className="mb-3">
                    <div className="mb-2">
                        <Badge bg="info" className="fs-5">
                            {t('selected')}: {selectedFile.name} · {humanSize(selectedFile.size)}
                        </Badge>
                    </div>
                    {status && (
                        <div>
                                                    <Badge bg={status === 'loaded' ? 'success' : 'secondary'} className="fs-5">
                            {status === 'loaded' ? t('loaded') : t('ready_to_load')}
                        </Badge>
                        </div>
                    )}
                </div>
            )}

            <div className="d-flex justify-content-end mb-3">
                <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                >
                    {t('upload')}
                </Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
        </>
    );
};

export default DataUploader;

