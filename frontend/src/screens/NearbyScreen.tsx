import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import NearbyMap from "../components/NearbyMap";
import hospitalData from "../data/facility-hosp.json"


type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type HospitalRecord = {
    cluster_eng: string;
  institution_eng: string;
  with_AE_service_eng: string;
  address_eng: string;
  cluster_tc: string;
  institution_tc: string;
  with_AE_service_tc: string;
  address_tc: string;
  cluster_sc: string;
  institution_sc: string;
  with_AE_service_sc: string;
  address_sc: string;
  latitude: number;
  longitude: number;
};

export default function NearbyScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  
  const mapRef = useRef<MapView | null>(null);
  const [selectedAEType, setSelectedAEType] = useState<"All" | "AE" | "Without AE">("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);;
  const [sortMode, setSortMode] = useState<"nearest" | "name">("nearest");

  // mock hospital data near current position later
  const [hospitals, setHospitals] = useState<
    (HospitalRecord & { distanceKm: number })[]
  >([]);
  
  

  useEffect(() => {
    const getLocation = async () => {
      try {
        const permissionResult = await Location.requestForegroundPermissionsAsync();
        const status = permissionResult.status;

        if (status !== "granted") {
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        const toRad = (value: number) => (value * Math.PI) / 180;

        const getDistanceKm = (
          lat1: number,
          lon1: number,
          lat2: number,
          lon2: number
        ) => {
          const R = 6371;
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
              Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        const normalizedHospitals = (hospitalData as HospitalRecord[]).map((hospital) => ({
          ...hospital,
          distanceKm: getDistanceKm(
            latitude,
            longitude,
            hospital.latitude,
            hospital.longitude
          ),
        }));

        const sortedHospitals = normalizedHospitals.sort(
          (a, b) => a.distanceKm - b.distanceKm
        );

        setHospitals(sortedHospitals);
      } catch (error) {
        console.log("Location error:", error);
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);


  //useEffect end==========================
  const filteredHospitals = useMemo(() => {
    let result = hospitals;

    if (selectedAEType === "AE") {
      result = result.filter(
        (hospital) => hospital.with_AE_service_eng === "Yes"
      );
    } else if (selectedAEType === "Without AE") {
      result = result.filter(
        (hospital) => hospital.with_AE_service_eng === "No"
      );
    }

    if (selectedDistrict !== "All") {
      result = result.filter(
        (hospital) => hospital.cluster_eng === selectedDistrict
      );
    }

    if (sortMode === "nearest") {
      result = [...result].sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      result = [...result].sort((a, b) =>
        a.institution_eng.localeCompare(b.institution_eng)
      );
    }

    return result;
  }, [hospitals, selectedAEType, selectedDistrict, sortMode]);

  const focusOnHospital = (hospital) => {
    mapRef.current?.animateToRegion(
      {
        latitude: hospital.latitude,
        longitude: hospital.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  };

  

  // removed broken debug variables `status` and `location` that are out of scope here
  console.log("region:", region);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Nearby Support</Text>
      <Text style={styles.headerSubtitle}>
        Quick access to emergency hotlines and nearby hospitals.
      </Text>

      {/* Hotline cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hotlines / 支援熱線</Text>

        {/* Emergency */}
        <View style={styles.hotlineCard}>
          <View style={styles.hotlineTop}>
            <Text style={styles.hotlineCountry}>🇭🇰 Hong Kong</Text>
            <Text style={styles.hotlineBadge}>Emergency / 緊急</Text>
          </View>

          <Text style={styles.hotlineName}>999 Emergency Services</Text>
          <Text style={styles.hotlineDesc}>
            Call 999 for immediate danger or emergency assistance.
          </Text>

          <Text style={styles.hotlineNameCN}>999 緊急服務</Text>
          <Text style={styles.hotlineDescCN}>
            如遇即時危險或緊急情況，可致電 999 聯絡警方、消防或救護車。
          </Text>

          <TouchableOpacity
            style={styles.EmercallButton}
            onPress={() => Linking.openURL("tel:999")}
          >
            <Feather name="phone" size={18} color="white" />
            <Text style={styles.callButtonText}>Call / 致電 999</Text>
          </TouchableOpacity>
        </View>

        {/* Suicide Prevention */}
        <View style={styles.hotlineCard}>
          <View style={styles.hotlineTop}>
            <Text style={styles.hotlineCountry}>🇭🇰 Hong Kong</Text>
            <Text style={styles.hotlineBadge}>24h Support</Text>
          </View>

          <Text style={styles.hotlineName}>
            The Samaritan Befrienders Hong Kong
          </Text>
          <Text style={styles.hotlineDesc}>
            24-hour emotional support hotline for people in distress or crisis.
          </Text>

          <Text style={styles.hotlineNameCN}>
            香港撒瑪利亞防止自殺會
          </Text>
          <Text style={styles.hotlineDescCN}>
            提供 24 小時情緒支援熱線，適合感到情緒困擾或需要傾訴的人士。
          </Text>

          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL("tel:23892222")}
          >
            <Feather name="phone" size={18} color="white" />
            <Text style={styles.callButtonText}>Call / 致電 2389 2222</Text>
          </TouchableOpacity>
        </View>

        {/* Samaritans */}
        <View style={styles.hotlineCard}>
          <View style={styles.hotlineTop}>
            <Text style={styles.hotlineCountry}>🇭🇰 Hong Kong</Text>
            <Text style={styles.hotlineBadge}>24h Support</Text>
          </View>

          <Text style={styles.hotlineName}>
            The Samaritans Hong Kong
          </Text>
          <Text style={styles.hotlineDesc}>
            24-hour confidential emotional support for anyone in need.
          </Text>

          <Text style={styles.hotlineNameCN}>
            香港撒瑪利亞會
          </Text>
          <Text style={styles.hotlineDescCN}>
            提供 24 小時情緒支援服務，為有需要人士提供即時傾訴。
          </Text>

          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL("tel:28960000")}
          >
            <Feather name="phone" size={18} color="white" />
            <Text style={styles.callButtonText}>Call / 致電 2896 0000</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
     <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nearby Hospitals</Text>

      <NearbyMap
        ref={mapRef}
        region={region}
        hospitals={filteredHospitals}
        loading={loading}
        selectedHospitalId={selectedHospitalId}
        setSelectedHospitalId={setSelectedHospitalId}
      />
    </View>

    <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
      {["All", "AE", "Without AE"].map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => setSelectedAEType(type as "All" | "AE" | "Without AE")}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: selectedAEType === type ? "#111827" : "#E5E7EB",
          }}
        >
          <Text style={{ color: selectedAEType === type ? "white" : "#111827" }}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

      {/* Hospital list */}
      {filteredHospitals.map((hospital) => {
  const isSelected = selectedHospitalId === hospital.institution_eng;

  return (
    <TouchableOpacity
      key={hospital.institution_eng}
      onPress={() => setSelectedHospitalId(hospital.institution_eng)}
      style={[
        styles.hospitalCard,
        isSelected && {
          borderWidth: 2,
          borderColor: "#4338CA",
          backgroundColor: "#EEF2FF",
        },
      ]}
    >
      <Text style={styles.hospitalName}>{hospital.institution_eng}</Text>
      <Text style={styles.hospitalName}>{hospital.institution_tc}</Text>
      <Text style={styles.hospitalAdd}>{hospital.address_eng}</Text>
      <Text style={styles.hospitalAdd}>{hospital.address_tc}</Text>
    </TouchableOpacity>
  );
})}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#F8F7FF",
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  hotlineCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hotlineTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  hotlineCountry: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  hotlineBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
  },
  hotlineName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  hotlineDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    marginBottom: 14,
  },
  callButton: {
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
   EmercallButton: {
    backgroundColor: "#cf1913",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },
  callButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  map: {
    width: "100%",
    height: 280,
    borderRadius: 20,
  },
  noLocationText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },
  hospitalCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  hospitalAdd: {
    fontSize: 10,
    fontWeight: "700",
    color: "#37383a",
    marginBottom: 5,
  },
  directionsButton: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  directionsButtonText: {
    color: "#4338CA",
    fontWeight: "700",
  },
  hotlineNameCN: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginTop: 6,
  },

  hotlineDescCN: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
    marginBottom: 14,
  },
});