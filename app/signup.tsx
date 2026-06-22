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

  const [showPassword, setShowPassword] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    isSuccess: false,
  });

  function showAlert(title: string, message: string, isSuccess = false) {
    setModalConfig({
      title,
      message,
      isSuccess,
    });

    setModalVisible(true);
  }

  async function handleSignup() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      showAlert("Missing Details", "Please fill all fields to continue.");
      return;
    }

    if (trimmedPassword.length < 4) {
      showAlert("Weak Password", "Password should be at least 4 characters.");
      return;
    }

    const result = await signupUser(trimmedName, trimmedEmail, trimmedPassword);

    if (!result.success) {
      showAlert("Signup Failed", result.message || "Something went wrong.");
      return;
    }

    setName("");
    setEmail("");
    setPassword("");

    showAlert(
      "Account Created! 🎉",
      "Your account has been created successfully. Please login now.",
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
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
              <Text style={styles.modalIcon}>
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
                    ? "#166534"
                    : "#EF4444",
                },
              ]}
              onPress={handleModalClose}
            >
              <Text style={styles.modalButtonText}>
                {modalConfig.isSuccess ? "Login Now" : "Try Again"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.logoMark}>
        <Text style={styles.logoLetter}>N</Text>
      </View>

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>Start your nutrition learning journey</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#94A3B8"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
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

      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
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
    backgroundColor: "#F0FDF4",
  },

  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#052e16",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  logoLetter: {
    color: "#86efac",
    fontSize: 34,
    fontWeight: "900",
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0D2818",
    textAlign: "center",
  },

  subtitle: {
    color: "#64748B",
    marginBottom: 30,
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },

  input: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5F0E8",
    color: "#0F172A",
  },

  passwordWrapper: {
    backgroundColor: "white",
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5F0E8",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 14,
  },

  passwordInput: {
    flex: 1,
    padding: 16,
    color: "#0F172A",
  },

  showText: {
    color: "#166534",
    fontWeight: "900",
  },

  button: {
    backgroundColor: "#166534",
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 16,
  },

  link: {
    color: "#166534",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalContent: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 330,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },

  iconBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  modalIcon: {
    fontSize: 25,
  },

  modalTitle: {
    fontSize: 21,
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
    fontWeight: "900",
    textAlign: "center",
    fontSize: 15,
  },
});
