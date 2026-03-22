import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

type Hospital = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type Props = {
  region: any;
  hospitals: Hospital[];
  loading: boolean;
};

export default function NearbyMap({ loading }: Props) {
  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <View
      style={{
        width: "100%",
        height: 280,
        borderRadius: 20,
        backgroundColor: "#E5E7EB",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "700", color: "#374151" }}>
        Map preview is available on mobile
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: "#6B7280",
          textAlign: "center",
        }}
      >
        Open this screen in Expo Go on iOS or Android to view the live map.
      </Text>
    </View>
  );
}