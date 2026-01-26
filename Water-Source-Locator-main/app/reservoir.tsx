import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";

type WaterBody = {
  id: string;
  name: string;
  type: "Reservoir" | "River" | "Lake";
  lat: number;
  lon: number;
  capacity_mcm?: number; // million cubic meters
  current_level_mcm?: number;
  status?: string; // e.g., "Normal", "Low", "Critical"
  polygon?: Array<{ lat: number; lon: number }>; // for reservoir polygon outline
  polyline?: Array<{ lat: number; lon: number }>; // for rivers
};

const SAMPLE_WATER_BODIES: WaterBody[] = [
  {
    id: "res-1",
    name: "Jedarpalayam Dam (sample)",
    type: "Reservoir",
    lat: 11.3525,
    lon: 77.6869,
    capacity_mcm: 12.3,
    current_level_mcm: 8.1,
    status: "Normal",
    polygon: [
      { lat: 11.3540, lon: 77.6845 },
      { lat: 11.3533, lon: 77.6870 },
      { lat: 11.3510, lon: 77.6880 },
      { lat: 11.3500, lon: 77.6852 },
    ],
  },
  {
    id: "res-2",
    name: "Solasiramani Barrage (sample)",
    type: "Reservoir",
    lat: 11.4602,
    lon: 77.7361,
    capacity_mcm: 7.8,
    current_level_mcm: 2.4,
    status: "Low",
    polygon: [
      { lat: 11.4612, lon: 77.7345 },
      { lat: 11.4598, lon: 77.7355 },
      { lat: 11.4590, lon: 77.7369 },
      { lat: 11.4601, lon: 77.7375 },
    ],
  },
  {
    id: "riv-1",
    name: "Kaveri River (sample reach)",
    type: "River",
    lat: 11.4500,
    lon: 77.7000,
    polyline: [
      { lat: 11.4700, lon: 77.6900 },
      { lat: 11.4600, lon: 77.6950 },
      { lat: 11.4500, lon: 77.7000 },
      { lat: 11.4400, lon: 77.7050 },
    ],
  },
  {
    id: "lake-1",
    name: "Local Lake (sample)",
    type: "Lake",
    lat: 11.3700,
    lon: 77.7000,
    capacity_mcm: 1.2,
    current_level_mcm: 0.8,
    status: "Normal",
  },
];

const { width, height } = Dimensions.get("window");

export default function ReservoirMapScreen() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [waterBodies, setWaterBodies] =
    useState<WaterBody[]>(SAMPLE_WATER_BODIES);
  const [nearby, setNearby] = useState<WaterBody[]>([]);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      await getUserLocation();
      // if you want to load remote data replace or merge with SAMPLE_WATER_BODIES
      // await loadRemoteReservoirs();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      computeNearby();
    }
  }, [location, waterBodies]);

  async function getUserLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location permission required",
          "Please allow location access to see nearby reservoirs."
        );
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });

      // animate map to user location
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          },
          900
        );
      }, 500);
    } catch (err) {
      console.error("Location error:", err);
      Alert.alert("Error", "Could not get current location.");
      setLoading(false);
    }
  }

  // Placeholder for fetching reservoir data from remote API
  async function loadRemoteReservoirs() {
    // Example:
    // const resp = await fetch('https://api.example.gov/reservoirs/tamilnadu');
    // const json = await resp.json();
    // setWaterBodies(transformApiToWaterBody(json));
  }

  function haversineDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // km
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
  }

  function computeNearby() {
    if (!location) return;
    const withDist = waterBodies
      .map((w) => ({
        ...w,
        distKm: haversineDistanceKm(location.lat, location.lon, w.lat, w.lon),
      }))
      .sort((a, b) => a.distKm - b.distKm);
    setNearby(withDist.slice(0, 6));
  }

  function renderMarker(body: WaterBody) {
    const coordinate = { latitude: body.lat, longitude: body.lon };
    const pinColor =
      body.type === "Reservoir"
        ? "#0077b6"
        : body.type === "Lake"
        ? "#2ec4b6"
        : "#ff9f1c"; // river orange

    return (
      <Marker
        key={body.id}
        coordinate={coordinate}
        title={body.name}
        pinColor={pinColor}
        onPress={() => {
          // center map on marker on press
          mapRef.current?.animateToRegion(
            {
              latitude: body.lat,
              longitude: body.lon,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
            500
          );
        }}
      >
        <Callout tooltip>
          <View style={styles.callout}>
            <Text style={styles.calloutTitle}>{body.name}</Text>
            <Text style={styles.calloutType}>{body.type}</Text>
            {body.capacity_mcm !== undefined && (
              <Text>Capacity: {body.capacity_mcm} MCM</Text>
            )}
            {body.current_level_mcm !== undefined && (
              <Text>Current: {body.current_level_mcm} MCM</Text>
            )}
            {body.status && <Text>Status: {body.status}</Text>}
            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() =>
                Alert.alert(body.name, `Open detailed view (not implemented)`)
              }
            >
              <Text style={styles.detailBtnText}>View details</Text>
            </TouchableOpacity>
          </View>
        </Callout>
      </Marker>
    );
  }

  function renderPolygonsAndPolylines() {
    return waterBodies.map((b) => {
      if (b.polygon && b.polygon.length > 2) {
        return (
          <Polygon
            key={`poly-${b.id}`}
            coordinates={b.polygon.map((p) => ({
              latitude: p.lat,
              longitude: p.lon,
            }))}
            strokeColor={b.status === "Low" ? "#ff6347" : "#0077b6"}
            fillColor={b.status === "Low" ? "rgba(255,99,71,0.2)" : "rgba(0,119,182,0.15)"}
            strokeWidth={2}
          />
        );
      }
      if (b.polyline && b.polyline.length > 1) {
        return (
          <Polyline
            key={`line-${b.id}`}
            coordinates={b.polyline.map((p) => ({
              latitude: p.lat,
              longitude: p.lon,
            }))}
            strokeColor="#2a9d8f"
            strokeWidth={4}
          />
        );
      }
      return null;
    });
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0077b6" />
        <Text style={{ marginTop: 12 }}>Loading map and location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={(r) => {mapRef.current = r}}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location?.lat ?? 11.3400,
          longitude: location?.lon ?? 77.7000,
          latitudeDelta: 0.6,
          longitudeDelta: 0.6,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Render polygons and polylines for reservoirs/rivers/lakes */}
        {renderPolygonsAndPolylines()}

        {/* Render markers */}
        {waterBodies.map((w) => renderMarker(w))}
      </MapView>

      {/* Bottom sheet / list of nearest water bodies */}
      <View style={styles.bottomCard}>
        <Text style={styles.bottomTitle}>Nearest water resources</Text>
        <FlatList
          data={nearby}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.nearCard}
              onPress={() =>
                mapRef.current?.animateToRegion(
                  {
                    latitude: item.lat,
                    longitude: item.lon,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                  },
                  400
                )
              }
            >
              <Text style={styles.nearName}>{item.name}</Text>
              <Text style={styles.nearType}>{item.type}</Text>
              <Text style={styles.nearDist}>
                {Math.round(
                  haversineDistanceKm(
                    location?.lat ?? item.lat,
                    location?.lon ?? item.lon,
                    item.lat,
                    item.lon
                  ) * 10
                ) / 10}
                km
              </Text>
              <Text style={styles.nearStatus}>{item.status ?? ""}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callout: {
    width: 200,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  calloutTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
    color: "#01497c",
  },
  calloutType: {
    fontSize: 12,
    marginBottom: 6,
    color: "#0077b6",
  },
  detailBtn: {
    marginTop: 8,
    backgroundColor: "#0077b6",
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  bottomCard: {
    position: "absolute",
    bottom: 18,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    elevation: 6,
  },
  bottomTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#023e8a",
    marginBottom: 8,
  },
  nearCard: {
    backgroundColor: "#e6f7ff",
    marginRight: 10,
    padding: 12,
    borderRadius: 10,
    width: width * 0.55,
  },
  nearName: { fontWeight: "700", color: "#01497c", marginBottom: 4 },
  nearType: { fontSize: 12, color: "#0077b6" },
  nearDist: { marginTop: 8, fontWeight: "600", color: "#023e8a" },
  nearStatus: { marginTop: 4, fontSize: 12, color: "#ff4500" },
});
