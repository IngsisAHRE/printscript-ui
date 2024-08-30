import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {Avatar, Box, Card, Typography} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";


const ProfileScreen = () => {
    const { user,isAuthenticated } = useAuth0();

  return (isAuthenticated && user &&
      <Card sx={{ borderRadius:"16px" , height:"60vh", padding:"80px"}}>
          <Box sx={{
              display:"flex",
              flexDirection:"row",
              alignItems:"center",
              gap:"24px"
          }}>
              <Avatar
                  src={user.picture}
                  alt={user.name}
                  sx={{
                      width: 120,
                      height: 120,
                  }}
              />
              <Box sx={{
                  alignItems:"center",
                  gap:"24px"
              }}>
                  <Typography fontSize={40}>{user.name}</Typography>
                  <Typography >Nickname: {user.nickname}</Typography>
                  <Typography >Email: {user.email}</Typography>
              </Box>
          </Box>
      </Card>
  )
}

export default withNavbar(ProfileScreen);

