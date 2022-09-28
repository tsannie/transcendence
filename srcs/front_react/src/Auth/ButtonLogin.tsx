import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { REDIRECT_LINK_AUTH } from "../const";

export default function ButtonLogin(props: any) {
  function linkLog() {
    window.location.href = REDIRECT_LINK_AUTH;
    props.getAllUsers();
  }

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
