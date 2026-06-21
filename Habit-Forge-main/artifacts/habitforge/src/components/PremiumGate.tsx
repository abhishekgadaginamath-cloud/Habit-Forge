interface PremiumGateProps {
  isPremium: boolean;
  children: React.ReactNode;
}

export default function PremiumGate({ isPremium, children }: PremiumGateProps) {
  if (isPremium) return <>{children}</>;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>{children}</div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "rgba(15, 14, 23, 0.75)",
          backdropFilter: "blur(2px)",
          borderRadius: 10,
        }}
      >
        <div style={{ fontSize: 30 }}>🔒</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Premium Feature</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", maxWidth: 220, lineHeight: 1.5 }}>
          Unlock detailed charts and insights with a premium account
        </div>
        <button
          style={{
            background: "var(--purple-mid)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}
