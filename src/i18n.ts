import { sharedLang } from 'betfinio_app/locales/index';
import type { i18n } from 'i18next';
import * as i18 from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';
import csStatistic from './translations/cs/staking.json';
import enStatistic from './translations/en/staking.json';
import ruStatistic from './translations/ru/staking.json';
export const defaultNS = 'statistics';

export const resources = {
	en: {
		staking: enStatistic,
		shared: sharedLang.en,
	},
	ru: {
		staking: ruStatistic,
		shared: sharedLang.ru,
	},
	cs: {
		staking: csStatistic,
		shared: sharedLang.cz,
	},
} as const;

const instance: i18n = i18.createInstance();
instance
	.use(initReactI18next)
	.use(I18nextBrowserLanguageDetector)
	.use(ICU)
	.init({
		resources,
		detection: {
			order: ['localStorage', 'navigator'],
			convertDetectedLanguage: (lng) => lng.split('-')[0],
		},
		supportedLngs: ['en', 'ru', 'cs'],
		fallbackLng: 'en',
		defaultNS,
		interpolation: { escapeValue: false },
		react: { useSuspense: true },
	});

export default instance;
