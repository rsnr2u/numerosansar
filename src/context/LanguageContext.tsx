import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "English" | "Hindi" | "Gujarati" | "Marathi" | "Punjabi" | "Bengali" | "Tamil" | "Telugu" | "Kannada" | "Malayalam";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>("English");

    useEffect(() => {
        // Compatibility with existing local storage but force English
        localStorage.setItem("global_language", "English");
    }, []);

    const setLanguage = (lang: Language) => {
        // No-op to prevent state changes from old components
        console.log("Internal language locked to English. Translation handled by widget.");
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
