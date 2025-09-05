import { createContext, useContext, useState, useEffect } from 'react';

const CustomPaletteContext = createContext();

export const CustomPaletteProvider = ({ children }) => {
    const [customPalettes, setCustomPalettes] = useState(() => {
        try {
            const saved = localStorage.getItem('customPalettes');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading custom palettes from localStorage:', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('customPalettes', JSON.stringify(customPalettes));
        } catch (error) {
            console.error('Error saving custom palettes to localStorage:', error);
        }
    }, [customPalettes]);

    const addCustomPalette = (palette) => {
        const newPalette = {
            id: `custom-${Date.now()}`,
            name: palette.name,
            colors: palette.colors,
            isCustom: true
        };
        setCustomPalettes(prev => [...prev, newPalette]);
        return newPalette;
    };

    const removeCustomPalette = (paletteId) => {
        setCustomPalettes(prev => prev.filter(p => p.id !== paletteId));
    };

    const updateCustomPalette = (paletteId, updatedPalette) => {
        setCustomPalettes(prev => 
            prev.map(p => 
                p.id === paletteId 
                    ? { ...p, name: updatedPalette.name, colors: updatedPalette.colors }
                    : p
            )
        );
    };

    const clearAllCustomPalettes = () => {
        setCustomPalettes([]);
    };

    const value = {
        customPalettes,
        addCustomPalette,
        removeCustomPalette,
        updateCustomPalette,
        clearAllCustomPalettes
    };

    return (
        <CustomPaletteContext.Provider value={value}>
            {children}
        </CustomPaletteContext.Provider>
    );
};

export const useCustomPalettes = () => {
    const context = useContext(CustomPaletteContext);
    if (!context) {
        throw new Error('useCustomPalettes must be used within a CustomPaletteProvider');
    }
    return context;
};
