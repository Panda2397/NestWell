import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from "react-native";
import { Provider, TimeSlot } from "../types/booking";

export default function BookingDetailScreen({ route }: any) {
  const provider: Provider = route.params.provider;
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const selectedSlot = provider.slots.find((slot) => slot.id === selectedSlotId);

  const handleBook = () => {
    if (!selectedSlot) {
      Alert.alert("Please select a timeslot first.");
      return;
    }

    Alert.alert(
      "Booking Confirmed",
      `You booked ${provider.name} at ${selectedSlot.label}.`
    );

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.type}>{provider.type}</Text>
      <Text style={styles.name}>{provider.name}</Text>
      <Text style={styles.specialty}>{provider.specialty}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Location</Text>
        <Text style={styles.infoText}>{provider.location}</Text>

        <Text style={[styles.infoTitle, { marginTop: 12 }]}>Languages</Text>
        <Text style={styles.infoText}>{provider.languages.join(" • ")}</Text>

        <Text style={[styles.infoTitle, { marginTop: 12 }]}>About</Text>
        <Text style={styles.infoText}>{provider.about}</Text>
      </View>

      <Text style={styles.sectionTitle}>Available Timeslots</Text>

      <View style={styles.slotsWrap}>
        {provider.slots.map((slot: TimeSlot) => {
          const isSelected = selectedSlotId === slot.id;
          const isDisabled = !slot.available;

          return (
            <TouchableOpacity
              key={slot.id}
              disabled={isDisabled}
              onPress={() => setSelectedSlotId(slot.id)}
              style={[
                styles.slotCard,
                isSelected && styles.slotCardSelected,
                isDisabled && styles.slotCardDisabled,
              ]}
            >
              <Text
                style={[
                  styles.slotText,
                  isSelected && styles.slotTextSelected,
                  isDisabled && styles.slotTextDisabled,
                ]}
              >
                {slot.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 28,
    backgroundColor: "#F8F7FF",
  },
  type: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  specialty: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  slotsWrap: {
    gap: 10,
  },
  slotCard: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  slotCardSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#4338CA",
  },
  slotCardDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  slotText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  slotTextSelected: {
    color: "#4338CA",
  },
  slotTextDisabled: {
    color: "#9CA3AF",
  },
  bookButton: {
    marginTop: 20,
    backgroundColor: "#111827",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});