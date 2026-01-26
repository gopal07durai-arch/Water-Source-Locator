// app/storage.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_KEY = "0c0459d234368201b4007d0b8450e318"; // Replace with your OpenWeatherMap API Key

interface ForecastItem {
  dt_txt: string;
  rain?: { "3h": number };
  main: { temp: number };
  weather: { description: string }[];
}

// 🌐 Translations
const translations = {
  en: {
    title: "💧 Rainfall Prediction",
    enterCity: "Enter city name",
    getForecast: "🔍 Get Forecast",
    useLocation: "📍 Use My Location",
    recentlySearched: "Recently Searched:",
    errorCity: "Please enter a city name",
    errorFetch: "Failed to fetch forecast. Check city name.",
    errorLocation: "Failed to fetch location forecast.",
    permissionDenied: "Enable location services.",
    rainfall: "🌧 Rainfall",
    temp: "🌡 Temp",
  },
  ta: {
    title: "💧 மழை முன்னறிவு",
    enterCity: "நகரின் பெயரை உள்ளிடவும்",
    getForecast: "🔍 முன்னறிவு பெற",
    useLocation: "📍 என் இருப்பிடத்தைப் பயன்படுத்து",
    recentlySearched: "சமீபத்தில் தேடியவை:",
    errorCity: "நகரின் பெயரை உள்ளிடவும்",
    errorFetch: "முன்னறிவை பெற முடியவில்லை. நகரின் பெயரை சரிபார்க்கவும்.",
    errorLocation: "இருப்பிட முன்னறிவை பெற முடியவில்லை.",
    permissionDenied: "இருப்பிட சேவைகளை இயக்கவும்.",
    rainfall: "🌧 மழை அளவு",
    temp: "🌡 வெப்பநிலை",
  },
};

export default function StorageScreen() {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "ta">("en");

  const t = translations[language]; // Shortcut for active translations

  useEffect(() => {
    loadHistory();
  }, []);

  // 📂 Load search history
  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem("rainfallHistory");
      if (stored) setHistory(JSON.parse(stored));
    } catch (error) {
      console.error("Error loading history", error);
    }
  };

  // 📂 Save search history
  const saveToHistory = async (cityName: string) => {
    try {
      let newHistory = [cityName, ...history.filter((c) => c !== cityName)];
      if (newHistory.length > 5) newHistory.pop(); // Keep max 5
      setHistory(newHistory);
      await AsyncStorage.setItem("rainfallHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Error saving history", error);
    }
  };

  // 🌧 Fetch rainfall forecast by city
  const fetchForecast = async (cityName?: string) => {
    const searchCity = cityName || city;
    if (!searchCity.trim()) {
      Alert.alert("Error", t.errorCity);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric&lang=${language}`
      );
      setForecastData(response.data.list);
      saveToHistory(searchCity);
    } catch (error) {
      Alert.alert("Error", t.errorFetch);
    } finally {
      setLoading(false);
    }
  };

  // 📍 Fetch rainfall forecast by GPS location
  const fetchByLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", t.permissionDenied);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${API_KEY}&units=metric&lang=${language}`
      );
      setForecastData(response.data.list);
      saveToHistory("My Location");
    } catch (error) {
      Alert.alert("Error", t.errorLocation);
    } finally {
      setLoading(false);
    }
  };

  // 📊 Render rainfall card
  const renderItem = ({ item }: { item: ForecastItem }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{new Date(item.dt_txt).toLocaleString()}</Text>
      <Text style={styles.temp}>
        {t.temp}: {item.main.temp}°C
      </Text>
      <Text style={styles.rain}>
        {t.rainfall}: {item.rain?.["3h"] ? `${item.rain["3h"]} mm` : "0 mm"}
      </Text>
      <Text style={styles.desc}>☁ {item.weather[0].description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🌐 Language Switch */}
      <View style={styles.langSwitch}>
        <Text style={{ fontWeight: "bold" }}>EN</Text>
        <Switch
          value={language === "ta"}
          onValueChange={(val) => setLanguage(val ? "ta" : "en")}
        />
        <Text style={{ fontWeight: "bold" }}>TA</Text>
      </View>

      <Text style={styles.title}>{t.title}</Text>

      <TextInput
        style={styles.input}
        placeholder={t.enterCity}
        value={city}
        onChangeText={setCity}
      />
      <Button title={t.getForecast} onPress={() => fetchForecast()} color="#0077b6" />
      <View style={{ marginTop: 10 }} />
      <Button title={t.useLocation} onPress={fetchByLocation} color="#0096c7" />

      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>{t.recentlySearched}</Text>
          <View style={styles.historyList}>
            {history.map((c) => (
              <TouchableOpacity key={c} onPress={() => fetchForecast(c)} style={styles.historyBtn}>
                <Text style={styles.historyText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0077b6" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={forecastData}
          keyExtractor={(item) => item.dt_txt}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#e6f7ff" },
  langSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#01497c", textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#90e0ef",
  },
  card: {
    backgroundColor: "#caf0f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  date: { fontSize: 16, fontWeight: "600", color: "#03045e" },
  temp: { fontSize: 16, marginTop: 4, color: "#0077b6" },
  rain: { fontSize: 14, marginTop: 4, color: "#023e8a" },
  desc: { fontSize: 14, color: "#555", marginTop: 4 },
  historyContainer: { marginTop: 20 },
  historyTitle: { fontSize: 16, fontWeight: "bold", color: "#01497c", marginBottom: 8 },
  historyList: { flexDirection: "row", flexWrap: "wrap" },
  historyBtn: {
    backgroundColor: "#90e0ef",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  historyText: { color: "#01497c", fontWeight: "500" },
});
