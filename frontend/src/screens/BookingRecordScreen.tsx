import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

type BookingRecord = {
  id: string;
  provider: string;
  type: "Doctor" | "Counselor";
  time: string;
  location: string;
};

export default function BookingRecordsScreen() {
  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: "b1",
      provider: "Dr. Emily Chan",
      type: "Doctor",
      time: "Mon 10:00 AM",
      location: "Central, Hong Kong",
    },
    {
      id: "b2",
      provider: "Ms. Grace Wong",
      type: "Counselor",
      time: "Wed 3:00 PM",
      location: "Tsim Sha Tsui, Hong Kong",
    },
  ]);

  const handleCancel = (id: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            setBookings((prev) => prev.filter((booking) => booking.id !== id));
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <Text style={styles.subtitle}>
        View your booked appointments and support sessions.
      </Text>

      {bookings.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            Your booked doctor and counselor appointments will appear here.
          </Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <View key={booking.id} style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.type}>{booking.type}</Text>
            </View>

            <Text style={styles.name}>{booking.provider}</Text>
            <Text style={styles.info}>{booking.time}</Text>
            <Text style={styles.info}>{booking.location}</Text>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(booking.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 28,
    backgroundColor: "#F8F7FF",
    flexGrow: 1,
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
    marginBottom: 18,
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  type: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 13,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  cancelButton: {
    marginTop: 14,
    backgroundColor: "#FEE2E2",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
  },
});