// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [language, setLanguage] = useState<"EN" | "TA">("EN");
  const [modalVisible, setModalVisible] = useState(false);

  const texts = {
    title: language === "EN" ? "🌊 Water Source Locator" : "🌊 நீர் வளத் தேடுபொறி",
    subtitle:
      language === "EN"
        ? "Plan smarter with water forecasts, reservoir details, and timely alerts — designed to support farmers, industries, and communities."
        : "நீர் முன்னறிவிப்புகள், அணைகள் விவரங்கள் மற்றும் அறிவுறுத்தல்களைப் பயன்படுத்தி விவசாயிகள், தொழிற்சாலைகள் மற்றும் சமூகங்களுக்கு உதவும் முறையில் திட்டமிடவும்.",
    buttons: {
      rainfall: language === "EN" ? "🌧 Rainfall Forecast" : "🌧 மழை முன்னறிவு",
      reservoir: language === "EN" ? "💧 Reservoir Details" : "💧 அணைகள் விவரங்கள்",
      weather: language === "EN" ? "🌦 Weather Forecast" : "🌦 வானிலை முன்னறிவு",
      alerts: language === "EN" ? "⚠️ Alerts & Warnings" : "⚠️ அறிவுறுத்தல்கள் & எச்சரிக்கை",
    },
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="settings-outline" size={28} color="#014f86" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{texts.title}</Text>
        <Text style={styles.subtitle}>{texts.subtitle}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/storage")}
        >
          <Text style={styles.buttonText}>{texts.buttons.rainfall}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/reservoir")}
        >
          <Text style={styles.buttonText}>{texts.buttons.reservoir}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/forecast")}
        >
          <Text style={styles.buttonText}>{texts.buttons.weather}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.alertButton]}
          onPress={() => router.push("/alerts")}
        >
          <Text style={styles.buttonText}>{texts.buttons.alerts}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {language === "EN" ? "Select Language" : "மொழியைத் தேர்ந்தெடுக்கவும்"}
            </Text>
            <Pressable
              style={styles.languageButton}
              onPress={() => { setLanguage("EN"); setModalVisible(false); }}
            >
              <Text style={styles.languageText}>English</Text>
            </Pressable>
            <Pressable
              style={styles.languageButton}
              onPress={() => { setLanguage("TA"); setModalVisible(false); }}
            >
              <Text style={styles.languageText}>தமிழ்</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f0fbff" },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#014f86",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#014f86",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#89CFF0",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "85%",
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertButton: {
    backgroundColor: "#ff6961",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00334e",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 40,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#014f86",
  },
  languageButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    backgroundColor: "#89CFF0",
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  languageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00334e",
  },
});
