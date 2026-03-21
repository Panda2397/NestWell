import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8F7FF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
  },
  progressWrap: {
    marginTop: 22,
    marginBottom: 20,
  },
  progressBg: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E8E7F5",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6D5EF9",
    borderRadius: 999,
  },
  progressText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  questionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F1EEFF",
    color: "#6D5EF9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 14,
  },
  questionText: {
    fontSize: 24,
    lineHeight: 34,
    fontWeight: "700",
    color: "#111827",
  },
  optionsWrap: {
    marginTop: 20,
    gap: 12,
  },
  optionCard: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    maxWidth: width - 130,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  optionCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  optionValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  resultCard: {
    borderRadius: 28,
    padding: 24,
    marginTop: 30,
  },
  resultEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  resultSubtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: "#4B5563",
  },
  typeBox: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 18,
    padding: 16,
  },
  typeLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
    fontWeight: "600",
  },
  typeValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
  actionButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#EEF0F4",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
});