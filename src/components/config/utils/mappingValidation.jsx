export const isMappingValid = (type, cfg, requirements) => {
    const req = requirements?.required || [];
    return req.every(k => {
        if (k === 'dimensions') return Array.isArray(cfg?.dimensions) && cfg.dimensions.length > 0;
        const fieldKey = k.startsWith('field_') ? k : `field_${k}`;
        const v = cfg?.[fieldKey];
        return v !== undefined && v !== null && v !== '';
    });
};
