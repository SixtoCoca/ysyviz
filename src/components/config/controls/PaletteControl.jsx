import { useMemo, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { ChartPalettes } from '../../../constants/chart-colors';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCustomPalettes } from '../../../contexts/CustomPaletteContext';
import CustomPaletteModal from './CustomPaletteModal';

const PaletteControl = ({ value, onChange }) => {
    const { t } = useLanguage();
    const { customPalettes } = useCustomPalettes();
    const [showModal, setShowModal] = useState(false);
    
    const options = useMemo(() => {
        const defaultOptions = ChartPalettes.map(p => ({ value: p.id, label: p.name, colors: p.colors }));
        const customOptions = customPalettes.map(p => ({ value: p.id, label: p.name, colors: p.colors, isCustom: true }));
        return [...defaultOptions, ...customOptions];
    }, [customPalettes]);
    
    const current = useMemo(() => {
        const val = Array.isArray(value) ? value : [];
        return options.find(o => JSON.stringify(o.colors) === JSON.stringify(val)) || null;
    }, [value, options]);

    const handleCustomPaletteSave = (newPalette) => {
        onChange(newPalette.colors);
    };

    return <>
        <div className='color-selector'>
            <Form.Label>{t('palette')}</Form.Label>
            <Select
                isClearable
                options={options}
                value={current}
                onChange={(opt) => onChange(opt?.colors || [])}
                classNamePrefix='ncg-select'
                placeholder={t('pick_palette')}
                formatOptionLabel={(opt) =>
                    <div className='d-flex align-items-center'>
                        <div className='d-flex flex-wrap gap-1 me-2' style={{ width: 72 }}>
                            {opt.colors.slice(0, 8).map((c, i) =>
                                <span key={`${opt.value}-${i}`} className='d-inline-block rounded border' style={{ width: 14, height: 14, background: c }} />
                            )}
                        </div>
                        <span>{opt.label}</span>
                        {opt.isCustom && <span className='ms-2 text-muted small'>(Custom)</span>}
                    </div>
                }
            />
            <Button 
                variant="outline-primary" 
                size="sm" 
                className="mt-2 w-100"
                onClick={() => setShowModal(true)}
            >
                {t('add_custom_palette')}
            </Button>
        </div>
        
        <CustomPaletteModal
            show={showModal}
            onHide={() => setShowModal(false)}
            onSave={handleCustomPaletteSave}
        />
    </>
};

export default PaletteControl;
