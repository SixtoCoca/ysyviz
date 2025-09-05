import { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { CirclePicker } from 'react-color';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCustomPalettes } from '../../../contexts/CustomPaletteContext';
import { toast } from 'react-hot-toast';

const CustomPaletteModal = ({ show, onHide, onSave }) => {
    const { t } = useLanguage();
    const { addCustomPalette, clearAllCustomPalettes, customPalettes } = useCustomPalettes();
    const [paletteName, setPaletteName] = useState('');
    const [colors, setColors] = useState(['#1f77b4', '#ff7f0e']);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColorIndex, setSelectedColorIndex] = useState(null);
    const colorPickerRef = useRef(null);

    const predefinedColors = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
        '#393b79', '#637939', '#8c6d31', '#843c39', '#7b4173',
        '#3182bd', '#31a354', '#756bb1', '#636363', '#e6550d',
        '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6'
    ];

    useEffect(() => {
        const handler = (e) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
                setShowColorPicker(false);
                setSelectedColorIndex(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleAddColor = () => {
        setColors(prev => [...prev, '#1f77b4']);
    };

    const handleRemoveColor = (index) => {
        if (colors.length > 2) {
            setColors(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleColorChange = (color, index) => {
        setColors(prev => prev.map((c, i) => i === index ? color.hex : c));
    };

    const handleColorPickerSelect = (color) => {
        if (selectedColorIndex !== null) {
            handleColorChange(color, selectedColorIndex);
        } else {
            setColors(prev => [...prev, color.hex]);
        }
        setShowColorPicker(false);
        setSelectedColorIndex(null);
    };

    const handleSave = () => {
        if (!paletteName.trim()) {
            toast.error(t('palette_name_required'));
            return;
        }
        if (colors.length < 2) {
            toast.error(t('palette_colors_required'));
            return;
        }

        const newPalette = addCustomPalette({
            name: paletteName.trim(),
            colors: colors
        });

        onSave(newPalette);
        handleClose();
        toast.success(t('palette_saved'));
    };

    const handleClearAll = () => {
        if (window.confirm(t('clear_all_palettes_confirm'))) {
            clearAllCustomPalettes();
            toast.success(t('all_palettes_cleared'));
        }
    };

    const handleClose = () => {
        setPaletteName('');
        setColors(['#1f77b4', '#ff7f0e']);
        setShowColorPicker(false);
        setSelectedColorIndex(null);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{t('add_custom_palette')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>{t('palette_name')}</Form.Label>
                    <Form.Control
                        type="text"
                        value={paletteName}
                        onChange={(e) => setPaletteName(e.target.value)}
                        placeholder={t('palette_name')}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Colores</Form.Label>
                    <Row className="g-2">
                        {colors.map((color, index) => (
                            <Col key={index} xs="auto">
                                <InputGroup>
                                    <InputGroup.Text
                                        style={{ 
                                            backgroundColor: color, 
                                            width: '40px', 
                                            height: '40px',
                                            cursor: 'pointer',
                                            border: '2px solid #dee2e6'
                                        }}
                                        onClick={() => {
                                            setSelectedColorIndex(index);
                                            setShowColorPicker(true);
                                        }}
                                    />
                                    <Form.Control
                                        type="text"
                                        value={color}
                                        onChange={(e) => handleColorChange({ hex: e.target.value }, index)}
                                        style={{ width: '100px' }}
                                    />
                                    {colors.length > 2 && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleRemoveColor(index)}
                                        >
                                            ×
                                        </Button>
                                    )}
                                </InputGroup>
                            </Col>
                        ))}
                    </Row>
                </Form.Group>

                <div className="d-flex gap-2 mb-3">
                    <Button variant="outline-primary" onClick={handleAddColor}>
                        {t('add_color')}
                    </Button>
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => {
                            setSelectedColorIndex(null);
                            setShowColorPicker(true);
                        }}
                    >
                        {t('add_color')} (Selector)
                    </Button>
                </div>
                
                {showColorPicker && (
                    <div ref={colorPickerRef} className="position-relative">
                        <CirclePicker
                            colors={predefinedColors}
                            onChange={handleColorPickerSelect}
                            width="100%"
                        />
                    </div>
                )}

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between w-100">
                    <Button 
                        variant="outline-danger" 
                        onClick={handleClearAll}
                        disabled={customPalettes.length === 0}
                    >
                        {t('clear_all_palettes')}
                    </Button>
                    <div>
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            {t('cancel')}
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            {t('save_palette')}
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomPaletteModal;
