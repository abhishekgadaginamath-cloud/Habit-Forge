import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadesOfPurple } from "@clerk/themes";
import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Logo from "./components/Logo";
import Home from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import HabitsPage from "./pages/Habits";
import ProfilePage from "./pages/Profile";
import AnalyticsPage from "./pages/Analytics";
import FocusModePage from "./pages/FocusMode";
import ChallengesPage from "./pages/Challenges";
import CalendarPage from "./pages/CalendarPage";
import AICoachPage from "./pages/AICoach";
import SettingsPage from "./pages/Settings";
import PricingPage from "./pages/Pricing";
import NotFound from "./pages/not-found";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const clerkAppearance = {
  baseTheme: shadesOfPurple,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#7f77dd",
    colorForeground: "#e8e6f0",
    colorMutedForeground: "#8884a8",
    colorDanger: "#ef4444",
    colorBackground: "#13121f",
    colorInput: "#0f0e17",
    colorInputForeground: "#e8e6f0",
    colorNeutral: "#2a2840",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "8px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !rounded-none",
    footer: "!shadow-none !border-0 !rounded-none",
    headerTitle: { color: "#e8e6f0", fontSize: "20px", fontWeight: "700" },
    headerSubtitle: { color: "#8884a8" },
    socialButtonsBlockButtonText: { color: "#c8c4e8" },
    formFieldLabel: { color: "#8884a8" },
    footerActionLink: { color: "#9b94e8" },
    footerActionText: { color: "#5a5875" },
    dividerText: { color: "#5a5875" },
    identityPreviewEditButton: { color: "#9b94e8" },
    formFieldSuccessText: { color: "#22c55e" },
    alertText: { color: "#e8e6f0" },
    logoBox: { marginBottom: "8px" },
    logoImage: { height: "40px", width: "40px" },
    socialButtonsBlockButton: { border: "0.5px solid #2a2840" },
    formButtonPrimary: { background: "#7f77dd" },
    formFieldInput: { background: "#0f0e17", border: "0.5px solid #2a2840", color: "#e8e6f0" },
    footerAction: { background: "transparent" },
    dividerLine: { background: "#2a2840" },
    alert: { background: "#1a1830", border: "0.5px solid #2a2840" },
    otpCodeFieldInput: { background: "#0f0e17", border: "0.5px solid #2a2840" },
  },
};

const authPageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(ellipse 80% 70% at 50% 20%, #1a0533 0%, #0a0212 45%, #050008 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 16px",
};

function SignInPage() {
  return (
    <div style={authPageStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -6, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
          <Logo size={38} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#e8e6f0", letterSpacing: "-0.02em" }}>HabitForge</div>
          <div style={{ fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Begin your quest
          </div>
        </div>
      </div>
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={`${basePath}/dashboard`}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div style={authPageStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -6, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
          <Logo size={38} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#e8e6f0", letterSpacing: "-0.02em" }}>HabitForge</div>
          <div style={{ fontSize: 10, color: "#8b5cf6", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Create your character
          </div>
        </div>
      </div>
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        fallbackRedirectUrl={`${basePath}/dashboard`}
      />
    </div>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in"><Redirect to="/dashboard" /></Show>
      <Show when="signed-out"><Home /></Show>
    </>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in">
        <Layout><Component /></Layout>
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      signInFallbackRedirectUrl={`${basePath}/dashboard`}
      signUpFallbackRedirectUrl={`${basePath}/dashboard`}
      afterSignOutUrl={basePath || "/"}
      localization={{
        signIn: { start: { title: "Welcome back, Adventurer", subtitle: "Continue forging your habits" } },
        signUp: { start: { title: "Create your character", subtitle: "Begin your quest to build better habits" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/dashboard"  component={() => <ProtectedRoute component={DashboardPage}  />} />
          <Route path="/habits"     component={() => <ProtectedRoute component={HabitsPage}     />} />
          <Route path="/profile"    component={() => <ProtectedRoute component={ProfilePage}    />} />
          <Route path="/analytics"  component={() => <ProtectedRoute component={AnalyticsPage}  />} />
          <Route path="/focus"      component={() => <ProtectedRoute component={FocusModePage}  />} />
          <Route path="/challenges" component={() => <ProtectedRoute component={ChallengesPage} />} />
          <Route path="/calendar"   component={() => <ProtectedRoute component={CalendarPage}   />} />
          <Route path="/ai-coach"   component={() => <ProtectedRoute component={AICoachPage}    />} />
          <Route path="/settings"   component={() => <ProtectedRoute component={SettingsPage}   />} />
          <Route path="/pricing"    component={() => <ProtectedRoute component={PricingPage}    />} />
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
