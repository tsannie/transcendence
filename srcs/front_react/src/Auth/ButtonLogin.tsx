import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { REDIRECT_LINK_AUTH } from "../const";
import { api } from "../userlist/UserListItem";

export default function ButtonLogin(props: any) {

  function linkLog(event: any) {
    //event.preventDefault();
    window.location.href = REDIRECT_LINK_AUTH;
  }

 /* useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {
      api.post('2fa/auth2fa').then(res => {
        if (res.data.isSecondFactor === false) {
          console.log('hello')
          setIsLogin(true);
        }
      }).catch(res => {
        console.log('invalid jwt');
        //console.log(res)
        document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
      });
    }
  });*/

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        pt: "20vh",
      }}
    >
      <Button
        sx={{
          bgcolor: "white",
          "&:hover": {
            bgcolor: "white",
          },
        }}
        onClick={linkLog}
        variant="contained"
      >
        <Typography
          sx={{
            fontWeight: "semibold",
            fontFamily: "Montserrat",
            fontSize: "1.5rem",
            color: "black",
          }}
          variant="h4"
        >
          SE CONNECTER AVEC 42
        </Typography>
      </Button>
    </Box>
  );
}
