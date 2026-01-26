// app/map.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Geojson } from "react-native-maps";

// ✅ Load your converted JSON (renamed from .geojson → .json)
const groundwaterGeoJSON = require("../assets/data/ground_water.json");

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌍 Tamil Nadu Groundwater Levels</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 11.1271, // Center of Tamil Nadu
          longitude: 78.6569,
          latitudeDelta: 4.5,
          longitudeDelta: 4.5,
        }}
      >
        <Geojson
          geojson={groundwaterGeoJSON}
          strokeColor="black"
          fillColor="rgba(0, 0, 0, 0)" // default transparent
          strokeWidth={1}
        />
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend (Water Level)</Text>
        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "green" }]} />
          <Text> Safe (0–2m)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "yellow" }]} />
          <Text> Moderate (2–20m)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.colorBox, { backgroundColor: "red" }]} />
          <Text> Critical (&gt20m)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
    color: "#003366",
  },
  map: {
    flex: 1,
  },
  legend: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    position: "absolute",
    bottom: 20,
    left: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  legendTitle: { fontWeight: "bold", marginBottom: 5 },
  legendRow: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  colorBox: { width: 20, height: 20, marginRight: 8 },
});
