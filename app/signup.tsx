import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signupUser } from "../data/localDb";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Modal Configuration States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    isSuccess: false,
  });

  // Helper function to trigger our custom beautiful modal
  function showAlert(title: any, message: any, isSuccess = false) {
    setModalConfig({ title, message, isSuccess });
    setModalVisible(true);
  }

  async function handleSignup() {
    if (!name || !email || !password) {
      showAlert("Missing Details", "Please fill out all fields to continue.");
      return;
    }

    const result = await signupUser(name, email, password);

    if (!result.success) {
      showAlert("Signup Failed", result.message || "Something went wrong.");
      return;
    }

    // Trigger success layout
    showAlert(
      "Account Created! 🎉",
      "Your nutrition learning journey starts right here.",
      true,
    );
  }

  function handleModalClose() {
    setModalVisible(false);
    if (modalConfig.isSuccess) {
      router.replace("/");
    }
  }

  return (
    <View style={styles.container}>
      {/* CUSTOM BEAUTIFUL ALERT MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Visual Indicator Pill/Icon */}
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor: modalConfig.isSuccess
                    ? "#DCFCE7"
                    : "#FEE2E2",
                },
              ]}
            >
              <Text style={{ fontSize: 24 }}>
                {modalConfig.isSuccess ? "✅" : "⚠️"}
              </Text>
            </View>

            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
            <Text style={styles.modalMessage}>{modalConfig.message}</Text>

            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  backgroundColor: modalConfig.isSuccess
                    ? "#16A34A"
                    : "#EF4444",
                },
              ]}
              onPress={handleModalClose}
            >
              <Text style={styles.modalButtonText}>
                {modalConfig.isSuccess ? "Let's Login" : "Try Again"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SIGNUP FORM VIEW */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start your nutrition learning journey</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#94A3B8"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#94A3B8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  title: { fontSize: 32, fontWeight: "900", color: "#0F172A" },
  subtitle: { color: "#64748B", marginBottom: 30, marginTop: 8 },
  input: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#0F172A",
  },
  button: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 16,
  },
  link: {
    color: "#16A34A",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "700",
  },

  // NEW MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)", // Dark semi-transparent blur color
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 320,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    // Premium soft elevation shadow
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 15,
  },
});
