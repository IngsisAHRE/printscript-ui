import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter, Navigate} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import ProfileScreen from "./screens/Profile.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {ReactNode, useEffect} from "react";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {FRONTEND_URL} from "./utils/constants.ts";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/" />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen />
    },
    {
        path: "/user-rules",
        element: <PrivateRoute><RulesScreen /></PrivateRoute>
    },
    {
        path: "/profile",
        element: <PrivateRoute><ProfileScreen /></PrivateRoute>
    }
]);

export const queryClient = new QueryClient()


const AuthWrapper = ({ children } : { children : ReactNode}) => {
    const { isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

    useEffect(() => {
        const getAndStoreToken = async () => {
            if (isAuthenticated) {
                try {
                    const token = await getAccessTokenSilently();
                    const decodedToken: JwtPayload = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decodedToken.exp! < currentTime) {
                        localStorage.removeItem('auth0_token');
                        await logout({logoutParams:{returnTo: FRONTEND_URL}});
                    } else {
                        localStorage.setItem('auth0_token', token);
                    }
                } catch (error) {
                    console.error("Error getting access token", error);
                }
            }
        };

        getAndStoreToken();
    }, [isAuthenticated, getAccessTokenSilently, logout]);

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