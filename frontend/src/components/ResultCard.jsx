export default function ResultCard({ minutes }) {
  if (minutes == null) return null;
  return (
    <div style={styles.card}>
      <div style={styles.title}>Estimated Travel Time</div>
      <div style={styles.value}>{Number(minutes).toFixed(2)} mins</div>
      <div style={styles.sub}>Based on current inputs</div>
    </div>
  );
}

const styles = {
  card: {
    marginTop: 16,
    padding: 16,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    border: "1px solid #f3f4f6",
  },
  title: { fontSize: 14, color: "#6b7280" },
  value: { fontSize: 28, fontWeight: 800, color: "#111827", marginTop: 4 },
  sub: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
};
