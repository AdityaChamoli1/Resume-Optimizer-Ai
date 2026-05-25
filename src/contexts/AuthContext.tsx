import { createContext, useContext, ReactNode, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  session: { access_token?: string } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: auth0User, isLoading, isAuthenticated, logout, loginWithRedirect } = useAuth0();

  const value = useMemo<AuthContextType>(() => ({
    user: isAuthenticated && auth0User
      ? {
          id: auth0User.sub ?? "",
          email: auth0User.email,
          name: auth0User.name,
          picture: auth0User.picture,
          ...auth0User,
        }
      : null,
    session: isAuthenticated ? {} : null,
    loading: isLoading,
    signOut: async () => {
      await logout({ logoutParams: { returnTo: window.location.origin } });
    },
    signIn: async () => {
      await loginWithRedirect();
    },
  }), [auth0User, isAuthenticated, isLoading, logout, loginWithRedirect]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
