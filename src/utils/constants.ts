const isCypress = typeof Cypress !== 'undefined';

export const FRONTEND_URL = isCypress ? Cypress.env('VITE_FRONTEND_URL') : import.meta.env.VITE_FRONTEND_URL ?? process?.env?.VITE_FRONTEND_URL ?? "";
export const BACKEND_URL = isCypress ? Cypress.env('VITE_BACKEND_URL') : import.meta.env.VITE_BACKEND_URL ?? process?.env?.VITE_BACKEND_URL ?? "";
export const RUNNER_URL = isCypress ? Cypress.env('VITE_RUNNER_URL') : import.meta.env.VITE_RUNNER_URL ?? process?.env?.VITE_RUNNER_URL ?? "";
export const AUTH0_USERNAME = isCypress ? Cypress.env('AUTH0_USERNAME') : process?.env?.AUTH0_USERNAME ?? "";
export const AUTH0_PASSWORD = isCypress ? Cypress.env('AUTH0_PASSWORD') : process?.env?.AUTH0_PASSWORD ?? "";
export const AUTH0_DOMAIN = isCypress ? Cypress.env('VITE_AUTH0_DOMAIN') : import.meta.env.VITE_AUTH0_DOMAIN ?? process?.env?.VITE_AUTH0_DOMAIN ?? "";
export const AUTH0_AUDIENCE = isCypress ? Cypress.env('VITE_AUTH0_AUDIENCE') : import.meta.env.VITE_AUTH0_AUDIENCE ?? process?.env?.VITE_AUTH0_AUDIENCE ?? "";
export const AUTH0_CLIENT_ID = isCypress ? Cypress.env('VITE_AUTH0_CLIENT_ID') : import.meta.env.VITE_AUTH0_CLIENT_ID ?? process?.env?.VITE_AUTH0_CLIENT_ID ?? "";