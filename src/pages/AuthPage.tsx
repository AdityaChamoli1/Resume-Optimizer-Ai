import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";

const AuthPage = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = (screen_hint?: "signup") =>
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
        ...(screen_hint ? { screen_hint } : {}),
      },
      appState: { returnTo: "/dashboard" },
    });

  const handleGoogle = () =>
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
        connection: "google-oauth2",
      },
      appState: { returnTo: "/dashboard" },
    });

  return (
    <div className="min-h-screen bg-background mesh-gradient flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold text-foreground mb-2">
            <Zap className="h-5 w-5 text-primary" />
            OptimizeForm AI
          </Link>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <Button
          variant="outline"
          className="w-full mb-4 gap-2 border-border text-foreground"
          onClick={handleGoogle}
          disabled={isLoading}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <Button className="w-full glow-primary mb-3" onClick={() => handleLogin()} disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Sign In with Email
        </Button>

        <Button variant="ghost" className="w-full text-foreground" onClick={() => handleLogin("signup")} disabled={isLoading}>
          Create an account
        </Button>
      </div>
    </div>
  );
};

export default AuthPage;
