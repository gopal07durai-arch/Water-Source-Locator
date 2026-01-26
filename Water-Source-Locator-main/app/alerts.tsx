// app/alerts.tsx
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { scheduleAlertNotification } from "./notifications";

type AlertItem = {
  id: string;
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
};

const API_KEY = "0c0459d234368201b4007d0b8450e318"; // Replace with your OpenWeatherMap API key

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // Ask location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to fetch alerts.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // Fetch from OpenWeatherMap One Call API
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      const res = await axios.get(url);

      let newAlerts: AlertItem[] = [];

      // Process API alerts
      if (res.data.alerts) {
        newAlerts = res.data.alerts.map((a: any, index: number) => ({
          id: `${index}`,
          title: `⚠️ ${a.event}`,
          description: a.description,
          severity: "High",
        }));

        // Trigger notification for each API alert
        res.data.alerts.forEach((a: any) => {
          scheduleAlertNotification(`⚠️ ${a.event}`, a.description);
        });
      }

      // Custom drought warning (no rain + hot days)
      const daily = res.data.daily.slice(0, 7);
      const noRain = daily.every((d: any) => (d.rain ?? 0) < 1);
      const hotDays = daily.filter((d: any) => d.temp.max > 34).length >= 3;

      if (noRain && hotDays) {
        const droughtAlert: AlertItem = {
          id: "drought",
          title: "🌾 Drought Warning",
          description:
            "No significant rainfall expected in the next 7 days with high temperatures. Please save water and adopt efficient irrigation.",
          severity: "High",
        };
        newAlerts.push(droughtAlert);

        // Trigger notification for drought
        scheduleAlertNotification(droughtAlert.title, droughtAlert.description);
      }

      setAlerts(newAlerts);
    } catch (err) {
      console.warn("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCardColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "#ff6b6b";
      case "Medium":
        return "#FFD93D";
      default:
        return "#90EE90";
    }
  };

  const renderItem = ({ item }: { item: AlertItem }) => (
    <View style={[styles.card, { borderLeftColor: getCardColor(item.severity) }]}>
      <Text style={styles.alertTitle}>{item.title}</Text>
      <Text style={styles.alertDesc}>{item.description}</Text>
      <Text style={styles.severity}>Severity: {item.severity}</Text>
      <TouchableOpacity style={styles.ackButton}>
        <Text style={styles.ackText}>Acknowledge</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚠️ Alerts & Warnings</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#014f86" />
      ) : alerts.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16, color: "#555" }}>
          ✅ No active alerts. Stay safe!
        </Text>
      ) : (
        <FlatList data={alerts} keyExtractor={(item) => item.id} renderItem={renderItem} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fbff", padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#014f86",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 8,
  },
  alertTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6, color: "#00334e" },
  alertDesc: { fontSize: 14, color: "#555", marginBottom: 8 },
  severity: { fontSize: 12, fontWeight: "600", color: "#333", marginBottom: 10 },
  ackButton: {
    alignSelf: "flex-start",
    backgroundColor: "#89CFF0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ackText: { fontSize: 14, fontWeight: "600", color: "#00334e" },
});
