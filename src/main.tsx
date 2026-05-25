import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import "./index.css";
import { auth0Config } from "./lib/auth0-config";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={auth0Config.domain}
    clientId={auth0Config.clientId}
    authorizationParams={{
      redirect_uri: `${window.location.origin}/callback`,
    }}
    cacheLocation="localstorage"
    useRefreshTokens
  >
    <App />
  </Auth0Provider>
);
