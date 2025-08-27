import { Card } from 'react-bootstrap';
import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { ChartFieldRequirements } from '../../constants/graph-requirements';
import { ChartPalettes, ChartColors } from '../../constants/chart-colors';
import ChartTypePicker from './ChartTypePicker';
import DataMappingPanel from './panels/DataMappingPanel';
import DimensionsPanel from './panels/DimensionsPanel';
import AppearancePanel from './panels/AppearancePanel';

const AdvancedSettings = ({ cfg, setCfg, type, setType, data }) => {
    const [draft, setDraft] = useState(cfg);

    useEffect(() => setDraft(cfg), [cfg]);
    const debouncedCommit = useMemo(() => debounce(setCfg, 400), [setCfg]);
    useEffect(() => () => debouncedCommit.flush(), [debouncedCommit]);

    const req = ChartFieldRequirements[type] || { required: [], optional: [] };
    const requiredFieldsRaw = req.required || [];
    const optionalFields = req.optional || [];

    const requiredFields = type === 'parallel'
        ? requiredFieldsRaw.filter(f => f !== 'dimensions')
        : requiredFieldsRaw;

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
        if (!optionalFields.includes('title') && next.title) next.title = '';
        if (!optionalFields.includes('color')) next.color = undefined;
        if (!optionalFields.includes('palette')) next.palette = undefined;
        if (optionalFields.includes('color') && !next.color) next.color = ChartColors[0];
        if (optionalFields.includes('palette') && (!next.palette || !next.palette.length)) next.palette = ChartPalettes[0].colors;
        if (!optionalFields.includes('donutHole')) next.donutHole = undefined;
        setDraft(next);
        debouncedCommit(next);
    }, [type]);

    const handleFieldChange = (name, value) => {
        const updated = { ...draft, [name]: value };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const handleOptionalChange = (key, value) => {
        const updated = { ...draft, [key]: value };
        if (key === 'color') updated.palette = undefined;
        if (key === 'palette') updated.color = undefined;
        setDraft(updated);
        debouncedCommit(updated);
    };

    const handleDimensionsSelect = (values) => {
        const updated = { ...draft, dimensions: values };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const moveDim = (idx, dir) => {
        const list = [...(draft.dimensions || [])];
        const j = idx + dir;
        if (j < 0 || j >= list.length) return;
        const tmp = list[idx];
        list[idx] = list[j];
        list[j] = tmp;
        const updated = { ...draft, dimensions: list };
        setDraft(updated);
        debouncedCommit(updated);
    };

    const removeDim = (idx) => {
        const list = [...(draft.dimensions || [])];
        list.splice(idx, 1);
        const updated = { ...draft, dimensions: list };
        setDraft(updated);
        debouncedCommit(updated);
    };

    return <>
        <Card className='mb-3'>
            <Card.Body>
                <ChartTypePicker value={type} onChange={setType} />
            </Card.Body>
        </Card>

        {type === 'parallel' && columns.length > 0 &&
            <DimensionsPanel
                columns={columns}
                values={draft.dimensions || []}
                onChange={handleDimensionsSelect}
                moveDim={moveDim}
                removeDim={removeDim}
            />
        }

        <DataMappingPanel
            columns={columns}
            requiredFields={requiredFields}
            draft={draft}
            onFieldChange={handleFieldChange}
        />

        <AppearancePanel
            optionalKeys={optionalFields}
            draft={draft}
            onChange={handleOptionalChange}
        />
    </>
};

export default AdvancedSettings;
