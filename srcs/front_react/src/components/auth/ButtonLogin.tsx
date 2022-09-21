import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { REDIRECT_LINK_AUTH } from "../../const/const";

export default function ButtonLogin(props: any) {

  function linkLog(event: any) {
    //event.preventDefault();
    window.location.href = REDIRECT_LINK_AUTH;
  }

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      pt: "20vh",
    }}>
      <Button onClick={linkLog} variant="contained" sx={{
        bgcolor: "white",
        "&:hover": {
          bgcolor: "white",
        },
      }}>
        <Typography variant="h4" sx={{
          fontWeight: "semibold",
          fontFamily: "Montserrat",
          fontSize: "1.5rem",
          color: "black",
        }}>
          SE CONNECTER AVEC 42
        </Typography>
      </Button>
    </Box>
  );
}
