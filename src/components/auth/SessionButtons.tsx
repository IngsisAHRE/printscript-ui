import { useAuth0 } from "@auth0/auth0-react";
import { FRONTEND_URL } from "../../utils/constants.ts";
import {StyledButton} from "../common/StyledButton.tsx";
import {Login, Logout, Person} from "@mui/icons-material";

export const SessionButtons = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
    return (
        isAuthenticated ?
            <>
                <StyledButton title="Profile" path="/profile" icon={<Person />} />
                <StyledButton
                    onClick={() => logout({logoutParams:{returnTo: FRONTEND_URL}})}
                    icon={<Logout />} title={"Log out"} />
            </>
            :
            <StyledButton title="Log in" onClick={loginWithRedirect} icon={<Login />} />
    );
}
