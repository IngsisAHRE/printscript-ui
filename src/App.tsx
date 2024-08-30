import './App.css';
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import ProfileScreen from "./screens/Profile.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import {ReactNode, useEffect} from "react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen/>
    },
    {
        path: '/rules',
        element: <RulesScreen/>
    },
    {
        path: '/profile',
        element: <ProfileScreen/>
    }
]);

export const queryClient = new QueryClient()

const AuthWrapper = ({ children } : { children : ReactNode}) => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const getAndStoreToken = async () => {
            if (isAuthenticated) {
                try {
                    const token = await getAccessTokenSilently();
                    localStorage.setItem('auth0_token', token);
                } catch (error) {
                    console.error("Error getting access token", error);
                }
            }
        };

        getAndStoreToken();
    }, [isAuthenticated, getAccessTokenSilently]);

    return children;
};

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthWrapper>
                <RouterProvider router={router}/>
            </AuthWrapper>
        </QueryClientProvider>
    );
}

export default App;