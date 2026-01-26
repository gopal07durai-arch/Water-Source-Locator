// app/forecast.tsx
import axios from "axios";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const API_KEY = "0c0459d234368201b4007d0b8450e318"; // Replace with your OpenWeatherMap API key
const screenWidth = Dimensions.get("window").width;

// Enable animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ForecastScreen() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState<any[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"EN" | "TA">("EN"); // Local state for language

  // Texts based on language
  const texts = {
    title: language === "EN" ? "🌦 5-Day Weather Forecast" : "🌦 5-நாள் வானிலை முன்னறிவு",
    cityPlaceholder: language === "EN" ? "Enter city name" : "நகரத்தின் பெயரை உள்ளிடவும்",
    searchCity: language === "EN" ? "🔍 Search City" : "🔍 நகரம் தேடு",
    useLocation: language === "EN" ? "📍 Use Current Location" : "📍 தற்போதைய இடத்தை பயன்படுத்தவும்",
    cityNotFound: language === "EN" ? "City not found ❌" : "நகர் கண்டுபிடிக்கப்படவில்லை ❌",
    locationDenied: language === "EN" ? "Location permission denied ❌" : "இட அனுமதி மறுக்கப்பட்டது ❌",
    locationError: language === "EN" ? "Unable to fetch location weather ❌" : "இட வானிலை பெற முடியவில்லை ❌",
  };

  // Fetch forecast by city
  const fetchWeatherByCity = async () => {
    if (!city) return;
    try {
      setError("");
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      processForecast(res.data.list);
    } catch {
      setError(texts.cityNotFound);
    }
  };

  // Fetch forecast by current location
  const fetchWeatherByLocation = async () => {
    try {
      setError("");
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError(texts.locationDenied);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${API_KEY}&units=metric`
      );
      processForecast(res.data.list);
    } catch {
      setError(texts.locationError);
    }
  };

  // Group forecast data by date
  const processForecast = (data: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    data.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    const days = Object.keys(grouped).map((date) => ({
      date,
      details: grouped[date],
    }));
    setForecast(days.slice(0, 5));
  };

  const toggleExpand = (date: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDay(expandedDay === date ? null : date);
  };

  return (
    <ImageBackground
      source={{
        uri: "https://tse3.mm.bing.net/th/id/OIP.loe6xn9rYiiRYuMdOog6WQAAAA?r=0&cb=thfvnext&pid=ImgDet&w=178&h=317&c=7&dpr=1.5&o=7&rm=3",
      }}
      style={styles.bg}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{texts.title}</Text>

        {/* Language Switch */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
          <TouchableOpacity
            style={[styles.langButton, language === "EN" && styles.langActive]}
            onPress={() => setLanguage("EN")}
          >
            <Text>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langButton, language === "TA" && styles.langActive]}
            onPress={() => setLanguage("TA")}
          >
            <Text>தமிழ்</Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder={texts.cityPlaceholder}
          value={city}
          onChangeText={setCity}
        />

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={fetchWeatherByCity}>
          <Text style={styles.buttonText}>{texts.searchCity}</Text>
        </TouchableOpacity>
        <View style={{ height: 10 }} />
        <TouchableOpacity style={styles.button} onPress={fetchWeatherByLocation}>
          <Text style={styles.buttonText}>{texts.useLocation}</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Forecast List */}
        <FlatList
          data={forecast}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View style={styles.dayBox}>
              <TouchableOpacity onPress={() => toggleExpand(item.date)}>
                <Text style={styles.dayText}>
                  📅 {new Date(item.date).toDateString()}
                </Text>
              </TouchableOpacity>

              {expandedDay === item.date && (
                <View style={styles.detailBox}>
                  {item.details.map((d: any, idx: number) => (
                    <Text key={idx} style={styles.detailText}>
                      ⏰ {d.dt_txt.split(" ")[1]} - 🌡 {d.main.temp}°C, {d.weather[0].description}
                    </Text>
                  ))}

                  <LineChart
                    data={{
                      labels: item.details.map((d: any) => d.dt_txt.split(" ")[1].slice(0, 5)),
                      datasets: [{ data: item.details.map((d: any) => d.main.temp) }],
                    }}
                    width={screenWidth * 0.85}
                    height={200}
                    yAxisSuffix="°C"
                    chartConfig={{
                      backgroundColor: "#e0f7fa",
                      backgroundGradientFrom: "#b2ebf2",
                      backgroundGradientTo: "#4dd0e1",
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    bezier
                    style={styles.chart}
                  />
                </View>
              )}
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: "cover" },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 15,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0077b6",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  error: { color: "red", textAlign: "center", marginTop: 10 },
  dayBox: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 12,
    marginVertical: 6,
    padding: 12,
  },
  dayText: { fontSize: 16, fontWeight: "700" },
  detailBox: { marginTop: 10 },
  detailText: { fontSize: 14, marginBottom: 4 },
  chart: { marginTop: 10, borderRadius: 10 },
  langButton: {
    borderWidth: 1,
    borderColor: "#00334e",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  langActive: {
    backgroundColor: "#89CFF0",
  },
});
