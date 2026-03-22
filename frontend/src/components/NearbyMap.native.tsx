import React, { useRef } from "react";
import { ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type Hospital = {
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
  distanceKm: number;
};

type Props = {
  region: Region | null;
  hospitals: Hospital[];
  loading: boolean;
  selectedHospitalId: string | null;
  setSelectedHospitalId: (id: string) => void;
};

export default function NearbyMap({
  region,
  hospitals,
  loading,
  selectedHospitalId,
  setSelectedHospitalId,
}: Props) {
  const mapRef = useRef<MapView | null>(null);

  const focusOnHospital = (hospital: Hospital) => {
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

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  if (!region) {
    return (
      <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 12 }}>
        Unable to access location. Please enable location permission.
      </Text>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={{ width: "100%", height: 280, borderRadius: 20 }}
      region={region}
      showsUserLocation
    >
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.institution_eng}
          coordinate={{
            latitude: hospital.latitude,
            longitude: hospital.longitude,
          }}
          title={hospital.institution_eng}
          pinColor={
            selectedHospitalId === hospital.institution_eng ? "#4338CA" : "#EF4444"
          }
          onPress={() => {
            setSelectedHospitalId(hospital.institution_eng);
            focusOnHospital(hospital);
          }}
        />
      ))}
    </MapView>
  );
}