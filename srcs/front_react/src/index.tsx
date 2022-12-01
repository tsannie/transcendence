import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { TransitionProvider } from "./contexts/TransitionContext";
import "react-toastify/dist/ReactToastify.css";
import "./app.style.scss";
import "./toastify.style.scss";
import { MessageProvider } from "./contexts/MessageContext";
import ChatNotifProvider from "./contexts/ChatNotificationContext";
import { ChatDisplayContext, ChatDisplayProvider } from "./contexts/ChatDisplayContext";

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <TransitionProvider>
        <ChatNotifProvider>
          <ChatDisplayProvider>
            <MessageProvider>
              <App />
            </MessageProvider>
          </ChatDisplayProvider>
        </ChatNotifProvider>
      </TransitionProvider>
    </AuthProvider>
  </BrowserRouter>
);
