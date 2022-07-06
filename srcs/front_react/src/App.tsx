import {
  Box,
  Button,
  createTheme,
  IconButton,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";

import React, { createContext, useContext, useMemo, useState } from "react";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import UserList from "./userlist/UserListItem";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

const ColorModeContext = createContext({ darkMode: () => {} });

function App() {
  const [inputChat, setInputChat] = useState(false);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 1,
      }}
    >
      <Button
        sx={{
          height: "fit-content",
          position: "absolute",
          right: 0,
        }}
        onClick={colorMode.darkMode}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </Button>
      <Sidebar inputChat={inputChat} setInputChat={setInputChat} />
      {inputChat && <Chat />}
    </Box>
  );
}

export default function Darkmode() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const colorMode = useMemo(
    () => ({
      darkMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
