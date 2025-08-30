import { Card } from 'react-bootstrap';
import { useState, useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import { ChartFieldRequirements } from '../../constants/graph-requirements';
import { ChartPalettes, ChartColors } from '../../constants/chart-colors';
import ChartTypePicker from './ChartTypePicker';
import { useLanguage } from '../../contexts/LanguageContext';
import DataMappingPanel from './panels/DataMappingPanel';
import AppearancePanel from './panels/AppearancePanel';
import SpecificSettingsPanel from './panels/SpecificSettingsPanel';

const AdvancedSettings = ({ cfg, setCfg, type, setType, data }) => {
    const { t } = useLanguage();
    const [draft, setDraft] = useState(cfg);
    const [mappingValid, setMappingValid] = useState(true);

    useEffect(() => setDraft(cfg), [cfg]);
    const debouncedCommitRef = useRef(debounce(setCfg, 400));
    useEffect(() => {
        debouncedCommitRef.current = debounce(setCfg, 400);
        return () => debouncedCommitRef.current.flush();
    }, [setCfg]);

    useEffect(() => {
        if (type) {
            const resetConfig = {
                title: '',
                type: '',
                color: '#4682b4',
                field_x: '',
                field_y: '',
                field_r: '',
                field_label: '',
                field_value: '',
                field_category: '',
                field_group: '',
                field_source: '',
                field_target: '',
                field_series: '',
                field_pyramid_left: '',
                field_pyramid_right: '',
                customLegend: '',
                customLegendPosition: '',
            };
            setDraft(resetConfig);
            debouncedCommitRef.current(resetConfig);
        }
    }, [type]);

    const req = ChartFieldRequirements[type] || { required: [], optional: [] };
    const requiredFieldsRaw = Array.isArray(req.required) ? req.required : [];
    const optionalFields = Array.isArray(req.optional) ? req.optional : [];

    const showDimensions = requiredFieldsRaw.includes('dimensions');
    const requiredFields = requiredFieldsRaw.filter(f => f !== 'dimensions');

        const hasSeriesField = Boolean(draft.field_series);
    const hasMultipleValues = Array.isArray(draft.field_value) && draft.field_value.length > 1;
    const hasMultipleYValues = Array.isArray(draft.field_y) && draft.field_y.length > 1;
    const hasMultipleXValues = Array.isArray(draft.field_x) && draft.field_x.length > 1;
    const hasMultipleGroupValues = Array.isArray(draft.field_group) && draft.field_group.length > 1;
    const supportsSeriesColors = ['bar', 'line', 'area', 'scatter', 'bubble'].includes(type);
    const supportsColorPalette = ['violin', 'boxplot'].includes(type);

    const mappingOptionalKeys = useMemo(
        () => {
            let keys = optionalFields.filter(k => k === 'series' || k === 'pyramid_left' || k === 'pyramid_right');
            
            if (hasMultipleValues || hasMultipleYValues || hasMultipleXValues || hasMultipleGroupValues) {
                keys = keys.filter(k => k !== 'series');
            }
            
            return keys;
        },
        [optionalFields, hasMultipleValues, hasMultipleYValues, hasMultipleXValues, hasMultipleGroupValues]
    );
    
    const appearanceOptionalKeys = useMemo(() => {
        let keys = optionalFields.filter(k => k !== 'series');
        
        if (supportsSeriesColors && (hasSeriesField || hasMultipleValues || hasMultipleYValues || hasMultipleXValues || hasMultipleGroupValues)) {
            keys = keys.filter(k => k !== 'color');
            if (!keys.includes('palette')) keys.push('palette');
            if (!keys.includes('legendPosition')) keys.push('legendPosition');
        } else if (supportsSeriesColors && !hasSeriesField && !hasMultipleValues && !hasMultipleYValues && !hasMultipleXValues && !hasMultipleGroupValues) {
            keys = keys.filter(k => k !== 'palette');
            keys = keys.filter(k => k !== 'legendPosition');
            if (!keys.includes('color')) keys.push('color');
        }
        
        if (supportsColorPalette) {
            if (!keys.includes('colorMode')) keys.push('colorMode');
            if (draft.colorMode === 'palette') {
                if (!keys.includes('palette')) keys.push('palette');
                keys = keys.filter(k => k !== 'color');
            } else {
                if (!keys.includes('color')) keys.push('color');
                keys = keys.filter(k => k !== 'palette');
            }
        }
        
        return keys;
    }, [optionalFields, supportsSeriesColors, supportsColorPalette, hasSeriesField, hasMultipleValues, hasMultipleYValues, hasMultipleXValues, hasMultipleGroupValues, draft.colorMode]);

    const columns = useMemo(() => {
        if (!data || typeof data !== 'object') return [];
        if (Array.isArray(data.columns)) return data.columns;
        if (Array.isArray(data.values) && data.values.length > 0) {
            const firstRow = data.values.find(r => typeof r === 'object' && r !== null);
            if (firstRow) return Object.keys(firstRow).filter(k => k !== '__rowNum__');
        }
        return [];
    }, [data]);

    useEffect(() => {
        const next = { ...draft };
        let changed = false;
        
        if (!appearanceOptionalKeys.includes('title') && next.title) {
            next.title = '';
            changed = true;
        }
        if (!appearanceOptionalKeys.includes('color') && next.color) {
            next.color = undefined;
            changed = true;
        }
        if (!appearanceOptionalKeys.includes('palette') && next.palette) {
            next.palette = undefined;
            changed = true;
        }
        if (!appearanceOptionalKeys.includes('orientation') && next.orientation) {
            next.orientation = undefined;
            changed = true;
        }
        if (appearanceOptionalKeys.includes('color') && !next.color) {
            next.color = ChartColors[0];
            changed = true;
        }
        if (appearanceOptionalKeys.includes('palette') && (!next.palette || !next.palette.length)) {
            next.palette = ChartPalettes[0].colors;
            changed = true;
        }
        if (appearanceOptionalKeys.includes('opacity') && next.opacity === undefined) {
            next.opacity = 0.8;
            changed = true;
        }
        if (!appearanceOptionalKeys.includes('customLegend') && next.customLegend) {
            next.customLegend = undefined;
            changed = true;
        }
        if (!appearanceOptionalKeys.includes('customLegendPosition') && next.customLegendPosition) {
            next.customLegendPosition = undefined;
            changed = true;
        }

        
        if (changed) {
            setDraft(next);
            debouncedCommitRef.current(next);
        }
    }, [type, supportsSeriesColors, hasSeriesField]);

    useEffect(() => {
        if (!supportsSeriesColors && !supportsColorPalette) return;
        
        let updated = null;
        if ((hasSeriesField || hasMultipleValues || hasMultipleYValues || hasMultipleXValues || hasMultipleGroupValues) && (!draft.palette || !draft.palette.length)) {
            updated = { ...draft, palette: ChartPalettes[0].colors, color: undefined, legendPosition: 'top-left' };
        } else if (!hasSeriesField && !hasMultipleValues && !hasMultipleYValues && !hasMultipleXValues && !hasMultipleGroupValues && !draft.color) {
            updated = { ...draft, color: ChartColors[0], palette: undefined, legendPosition: undefined };
        }
        
        if (updated) {
            setDraft(updated);
            debouncedCommitRef.current(updated);
        }
    }, [hasSeriesField, hasMultipleValues, hasMultipleYValues, hasMultipleXValues, hasMultipleGroupValues, supportsSeriesColors, supportsColorPalette]);

    const handleFieldChange = (name, value) => {
        const fieldKey = name.startsWith('field_') ? name : `field_${name}`;
        const updated = { ...draft, [fieldKey]: value };
        
        if (name === 'series' && value && supportsSeriesColors && !updated.legendPosition) {
            updated.legendPosition = 'top-left';
        }
        
        if ((name === 'value' || name === 'y') && Array.isArray(value) && value.length > 1 && supportsSeriesColors) {
            updated.palette = ChartPalettes[0].colors;
            updated.color = undefined;
            updated.legendPosition = 'top-left';
        }
        
        if ((name === 'x' || name === 'group') && Array.isArray(value) && value.length > 1) {
            updated.palette = ChartPalettes[0].colors;
            updated.color = undefined;
            updated.legendPosition = 'top-left';
        }
        
        setDraft(updated);
        debouncedCommitRef.current(updated);
    };

    const handleOptionalChange = (key, value) => {
        const updated = { ...draft, [key]: value };
        if (key === 'color') updated.palette = undefined;
        if (key === 'palette') updated.color = undefined;
        setDraft(updated);
        debouncedCommitRef.current(updated);
    };

    const handleSpecificChange = (updated) => {
        setDraft(updated);
        debouncedCommitRef.current(updated);
    };

    const handleDimensionsSelect = values => {
        const list = Array.isArray(values) ? values : [];
        const updated = { ...draft, dimensions: list };
        setDraft(updated);
        debouncedCommitRef.current(updated);
    };

    const moveDim = (idx, dir) => {
        const list = Array.isArray(draft.dimensions) ? [...draft.dimensions] : [];
        const j = idx + dir;
        if (j < 0 || j >= list.length) return;
        const tmp = list[idx];
        list[idx] = list[j];
        list[j] = tmp;
        const updated = { ...draft, dimensions: list };
        setDraft(updated);
        debouncedCommitRef.current(updated);
    };

    const removeDim = idx => {
        const list = Array.isArray(draft.dimensions) ? [...draft.dimensions] : [];
        list.splice(idx, 1);
        const updated = { ...draft, dimensions: list };
        setDraft(updated);
        debouncedCommitRef.current(updated);
    };

    return <>
        <Card className='mb-3'>
            <Card.Body>
                <ChartTypePicker value={type} onChange={setType} />
            </Card.Body>
        </Card>

        <DataMappingPanel
            columns={columns}
            requiredFields={requiredFields}
            optionalMappingKeys={mappingOptionalKeys}
            draft={draft}
            onFieldChange={handleFieldChange}
            dimensionsEnabled={showDimensions}
            dimensionsRequired={showDimensions}
            dimensionsValues={draft.dimensions || []}
            onDimensionsChange={handleDimensionsSelect}
            moveDim={moveDim}
            removeDim={removeDim}
            chartType={type}
            requirements={req}
            onValidityChange={setMappingValid}
        />

        <AppearancePanel
            optionalKeys={appearanceOptionalKeys}
            draft={draft}
            onChange={handleOptionalChange}
        />

        <SpecificSettingsPanel
            config={draft}
            onChange={handleSpecificChange}
            chartType={type}
        />
    </>;
};

export default AdvancedSettings;
