import React from 'react';
import App from './App.tsx'
import './index.css'
import {createRoot} from "react-dom/client";
import {PaginationProvider} from "./contexts/paginationProvider.tsx";
import {SnackbarProvider} from "./contexts/snackbarProvider.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import {AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN, FRONTEND_URL } from "./utils/constants.ts";

createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <Auth0Provider
                clientId={AUTH0_CLIENT_ID}
                domain={AUTH0_DOMAIN}
                authorizationParams={{
                    redirect_uri: FRONTEND_URL,
                    audience: AUTH0_AUDIENCE,
                    scope: "openid profile email write:snippets"
                }}
                useRefreshTokens={true}
                cacheLocation="localstorage"
                onRedirectCallback={(appState) => {
                    window.history.replaceState(
                        {},
                        document.title,
                        appState?.returnTo || window.location.pathname
                    );
                }}>
                <PaginationProvider>
                    <SnackbarProvider>
                        <App/>
                    </SnackbarProvider>
                </PaginationProvider>
            </Auth0Provider>
        </React.StrictMode>,
)
