const configuredApiServerUrl = (process.env.REACT_APP_API_SERVER_URL || '').trim();
const configuredApiBaseUrl = (process.env.REACT_APP_API_BASE_URL || '').trim();

const derivedServerUrlFromBase = configuredApiBaseUrl
	? configuredApiBaseUrl.replace(/\/api\/?$/, '')
	: '';

const defaultServerUrl =
	typeof window !== 'undefined' && window.location.hostname === 'localhost'
		? 'http://localhost:5000'
		: 'https://pdfbackend-three.vercel.app';

export const API_SERVER_URL = configuredApiServerUrl || derivedServerUrlFromBase || defaultServerUrl;