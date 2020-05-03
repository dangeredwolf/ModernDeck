export const getFullLanguage = () => navigator.language.replace("-","_");
export const getMainLanguage = () => navigator.language.substring(0,2);
export const getFallbackLanguage = () => "en";
