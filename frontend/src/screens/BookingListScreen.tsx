import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import bookingData from "../data/booking-data.json";
import { Provider } from "../types/booking";

const providers = bookingData.providers as Provider[];

export default function BookingListScreen({ navigation }: any) {
  const [selectedType, setSelectedType] = useState<"All" | "Doctor" | "Counselor">("All");

  const filteredProviders = useMemo(() => {
    if (selectedType === "All") return providers;
    return providers.filter((provider) => provider.type === selectedType);
  }, [selectedType]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View>
      <Text style={styles.title}>Book Support</Text>
      <TouchableOpacity
        style={styles.recordsButton}
        onPress={() => navigation.navigate("BookingRecords")}
        >
        <Text style={styles.recordsButtonText}>View My Bookings</Text>
        </TouchableOpacity>
        </View>
      <Text style={styles.subtitle}>
        Choose a doctor or counselor and select a timeslot.
      </Text>

      <View style={styles.filterRow}>
        {["All", "Doctor", "Counselor"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type as "All" | "Doctor" | "Counselor")}
            style={[
              styles.filterButton,
              selectedType === type && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedType === type && styles.filterButtonTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredProviders.map((provider) => (
        <TouchableOpacity
          key={provider.id}
          style={styles.card}
          onPress={() => navigation.navigate("BookingDetail", { provider })}
        >
          <View style={styles.cardTopRow}>
            <Text style={styles.providerType}>{provider.type}</Text>
          </View>

          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
          <Text style={styles.providerMeta}>{provider.location}</Text>
          <Text style={styles.providerMeta}>
            {provider.languages.join(" • ")}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 28,
    backgroundColor: "#F8F7FF",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  filterButtonActive: {
    backgroundColor: "#111827",
  },
  filterButtonText: {
    color: "#111827",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  providerType: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 13,
  },
  providerName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  providerSpecialty: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  providerMeta: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  recordsButton: {
  alignSelf: "flex-start",
  backgroundColor: "#111827",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 14,
  marginBottom: 16,
},

recordsButtonText: {
  color: "white",
  fontWeight: "700",
  fontSize: 14,
},
});