import {AppBar, Box, Container, Toolbar, Typography} from "@mui/material";
import {Code, Rule} from "@mui/icons-material";
import {ReactNode} from "react";
import {SessionButtons} from "../auth/SessionButtons.tsx";
import {StyledButton} from "../common/StyledButton.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {useSetRules} from "../../utils/queries.tsx";
import {useNavigate} from "react-router-dom";

type PageType = {
    title: string;
    path: string;
    icon: ReactNode;
}

const pages: PageType[] = [{
    title: 'Snippets',
    path: '/',
    icon: <Code/>
}, {
    title: 'Rules',
    path: '/user-rules',
    icon: <Rule/>
}];

export const Navbar = () => {
    const { isAuthenticated } = useAuth0();
    const {mutateAsync : setRules} = useSetRules();
    const navigate = useNavigate();

    return (
        <AppBar position="static" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{display: "flex", gap: "24px"}}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            display: {xs: 'none', md: 'flex'},
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Printscript
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, gap: '4px'}}>
                        {isAuthenticated && pages.map((page) => (
                            <StyledButton
                                key={page.title}
                                path={page.path}
                                title={page.title}
                                icon={page.icon}
                                onClick={() => {
                                    setRules()
                                    navigate(page.path);
                                } }
                            />
                        ))}
                    </Box>
                    <SessionButtons />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
