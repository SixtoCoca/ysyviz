import { useState } from 'react';

export const useChartConfig = () => {
    const [cfg, setCfg] = useState({
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
    });

    return [cfg, setCfg];
};
