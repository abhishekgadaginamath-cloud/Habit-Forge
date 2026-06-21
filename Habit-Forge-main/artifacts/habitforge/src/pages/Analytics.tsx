import {
  useGetHeatmap,
  useGetConsistency,
  useGetProfile,
  getGetHeatmapQueryKey,
  getGetConsistencyQueryKey,
} from "@workspace/api-client-react";
import HeatmapChart from "../components/HeatmapChart";
import ConsistencyChart from "../components/ConsistencyChart";
import PremiumGate from "../components/PremiumGate";

const S = {
  panel: {
    background: "var(--bg-surface)",
    border: "0.5px solid var(--border)",
    borderRadius: 10,
    padding: 20,
  } as React.CSSProperties,
  label: {
    fontSize: 11,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontWeight: 500,
    marginBottom: 4,
  },
};

export default function Analytics() {
  const { data: profile } = useGetProfile();
  const isPremium = profile?.isPremium ?? false;

  const { data: heatmap = [], isLoading: heatmapLoading } = useGetHeatmap({
    query: { enabled: isPremium, queryKey: getGetHeatmapQueryKey() },
  });
  const { data: consistency = [], isLoading: consistencyLoading } = useGetConsistency({
    query: { enabled: isPremium, queryKey: getGetConsistencyQueryKey() },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Heatmap */}
      <div style={S.panel}>
        <div style={{ marginBottom: 16 }}>
          <div style={S.label}>Activity Heatmap</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            Last 365 days of habit completions
          </div>
        </div>
        <PremiumGate isPremium={isPremium}>
          {heatmapLoading ? (
            <div style={{ height: 96, background: "var(--bg-elevated)", borderRadius: 8, opacity: 0.5 }} />
          ) : (
            <HeatmapChart data={heatmap} />
          )}
        </PremiumGate>
      </div>

      {/* Consistency chart */}
      <div style={S.panel}>
        <div style={{ marginBottom: 16 }}>
          <div style={S.label}>Daily Consistency</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            Completion rate over the last 30 days
          </div>
        </div>
        <PremiumGate isPremium={isPremium}>
          {consistencyLoading ? (
            <div style={{ height: 180, background: "var(--bg-elevated)", borderRadius: 8, opacity: 0.5 }} />
          ) : (
            <ConsistencyChart data={consistency} />
          )}
        </PremiumGate>
      </div>

      {!isPremium && (
        <div
          style={{
            ...S.panel,
            border: "0.5px solid var(--border-accent)",
            background: "var(--purple-dark)",
            textAlign: "center",
            padding: "28px 24px",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>📊</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--purple-pale)", marginBottom: 6 }}>
            Unlock Full Analytics
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 280, margin: "0 auto 16px", lineHeight: 1.6 }}>
            Upgrade to premium to access detailed heatmaps and consistency charts
          </div>
          <button
            style={{
              background: "var(--purple-mid)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
}
