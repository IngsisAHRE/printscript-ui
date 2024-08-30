import { Button, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface StyledButtonProps {
    title: string;
    path?: string;
    icon: ReactNode;
    onClick?: () => void;
}

export const StyledButton = ({ title, path, icon, onClick }: StyledButtonProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (path) {
            navigate(path);
        }
    };

    return (
        <Button
            key={title}
            onClick={handleClick}
            sx={{
                my: 2,
                color: 'white',
                display: 'flex',
                justifyContent: "center",
                gap: "4px",
                backgroundColor: location.pathname === path ? 'primary.light' : 'transparent',
                "&:hover": {
                    backgroundColor: 'primary.dark'
                }
            }}
        >
            {icon}
            <Typography>{title}</Typography>
        </Button>
    );
};