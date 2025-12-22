import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import LanguageData from '../i18n/LanguageData';
import baseURL from '../helper/ApiConstant';
import axios from 'axios';

const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load language from AsyncStorage on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      // First check if user has a saved language preference
      const storedLanguage = await AsyncStorage.getItem('Language');
      if (storedLanguage) {
        const languageCode = JSON.parse(storedLanguage);
        setSelectedLanguage(languageCode);
        i18n.changeLanguage(languageCode);
        setIsLoading(false);
        return;
      }

      // If no stored language, try to get from user profile (if logged in)
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await axios({
            method: 'get',
            url: baseURL + 'profile',
            headers: {
              Authorization: 'Bearer' + token,
              Accept: 'application/json',
            },
          });
          
          if (response.data?.data?.lang) {
            const profileLanguage = response.data.data.lang;
            setSelectedLanguage(profileLanguage);
            i18n.changeLanguage(profileLanguage);
            await AsyncStorage.setItem('Language', JSON.stringify(profileLanguage));
            setIsLoading(false);
            return;
          }
        } catch (error) {
          // If profile fetch fails, continue with default
          console.error('Error fetching profile language:', error);
        }
      }

      // Default to English if no language is found
      setSelectedLanguage('en');
      i18n.changeLanguage('en');
    } catch (error) {
      console.error('Error loading language:', error);
      setSelectedLanguage('en');
      i18n.changeLanguage('en');
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode, updateBackend = false) => {
    try {
      // Update AsyncStorage
      await AsyncStorage.setItem('Language', JSON.stringify(languageCode));
      
      // Update i18n
      await i18n.changeLanguage(languageCode);
      
      // Update state
      setSelectedLanguage(languageCode);

      // Optionally update backend if user is logged in
      if (updateBackend) {
        await updateLanguageOnBackend(languageCode);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const updateLanguageOnBackend = async languageCode => {
    try {
      const Token = await AsyncStorage.getItem('accessToken');
      if (!Token) {
        return; // User not logged in, skip backend update
      }

      const data = {
        lang: languageCode,
        _method: 'put',
      };

      await axios({
        method: 'post',
        url: baseURL + 'set_language',
        headers: {
          Authorization: 'Bearer' + Token,
          Accept: 'application/json',
        },
        data: data,
      });
    } catch (error) {
      console.error('Error updating language on backend:', error);
      // Don't throw error, language change should still work locally
    }
  };

  const getLanguageData = () => {
    return LanguageData.find(lang => lang.code === selectedLanguage) || LanguageData[0];
  };

  const value = {
    selectedLanguage,
    changeLanguage,
    isLoading,
    getLanguageData,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

