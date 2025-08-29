import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../contexts/LanguageContext';

const ChordSettings = ({ config, onChange }) => {
    const { t } = useLanguage();
    
    const handleChange = (key, value) => {
        onChange({ ...config, [key]: value });
    };

    return <>
        <div className='mt-3'>
            <h6>{t('chord_colors')}</h6>
            <Form.Check
                type='radio'
                id='chord-node-colors'
                name='chordColors'
                label={t('use_node_colors')}
                checked={config?.chordColors === 'node' || !config?.chordColors}
                onChange={() => handleChange('chordColors', 'node')}
            />
            <div className='text-muted small'>
                {t('chords_use_source_color')}
            </div>
            
            <Form.Check
                type='radio'
                id='chord-neutral-gray'
                name='chordColors'
                label={t('neutral_gray')}
                checked={config?.chordColors === 'gray'}
                onChange={() => handleChange('chordColors', 'gray')}
            />
            <div className='text-muted small'>
                {t('chords_neutral_gray')}
            </div>
        </div>
    </>;
};

export default ChordSettings;
