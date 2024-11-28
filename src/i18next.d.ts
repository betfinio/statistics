import type { resources } from './i18n';

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: 'statistics';
		resources: (typeof resources)['en'];
	}
}

export type ILanguageKeys = (typeof resources)['en']['statistics'];
export type ILanguageErrorKeys = keyof (typeof resources)['en']['shared']['errors'];
