import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const SankeySettings = ({ config, onChange }) => {
    const { t } = useLanguage();
    
    const handleChange = (key, value) => {
        onChange({ ...config, [key]: value });
    };

    return <>
        <div className='mt-3'>
            <h6>{t('link_colors')}</h6>
            <Form.Check
                type='radio'
                id='sankey-node-colors'
                name='sankeyLinkColors'
                label={t('use_node_colors')}
                checked={config?.linkColors === 'node' || !config?.linkColors}
                onChange={() => handleChange('linkColors', 'node')}
            />
            <div className='text-muted small'>
                {t('links_use_source_color')}
            </div>
            
            <Form.Check
                type='radio'
                id='sankey-neutral-gray'
                name='sankeyLinkColors'
                label={t('neutral_gray')}
                checked={config?.linkColors === 'gray'}
                onChange={() => handleChange('linkColors', 'gray')}
            />
            <div className='text-muted small'>
                {t('links_neutral_gray')}
            </div>
        </div>
    </>;
};

export default SankeySettings;
