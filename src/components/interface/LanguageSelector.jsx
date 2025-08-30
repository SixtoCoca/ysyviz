import { ToggleButton } from 'react-bootstrap';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    return (
        <ToggleButton
            id='language-toggle'
            type='checkbox'
            variant='light'
            size='sm'
            checked={language === 'es'}
            onChange={toggleLanguage}
            className='d-flex align-items-center gap-2 border-0 bg-transparent shadow-none language-toggle'
            style={{ minWidth: '60px' }}
        >
            {language === 'en' ? (
                <>
                    <span style={{ fontSize: '18px' }}>🇺🇸</span>
                    <span className='small'>EN</span>
                </>
            ) : (
                <>
                    <span style={{ fontSize: '18px' }}>🇪🇸</span>
                    <span className='small'>ES</span>
                </>
            )}
        </ToggleButton>
    );
};

export default LanguageSelector;
