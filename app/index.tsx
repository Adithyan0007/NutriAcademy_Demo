import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { loginUser } from "../data/localDb";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter email and password.");
      return;
    }

    const result = await loginUser(trimmedEmail, trimmedPassword);

    if (!result.success) {
      setError(result.message || "Invalid email or password.");
      return;
    }

    router.replace("/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NutriAcademy</Text>
      <Text style={styles.subtitle}>
        Professional Nutrition Learning Platform
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError("");
        }}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError("");
        }}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>New student? Create account</Text>
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

  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#0D2818",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginBottom: 32,
    marginTop: 8,
    fontWeight: "600",
  },

  errorBox: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    padding: 13,
    borderRadius: 14,
    marginBottom: 14,
  },

  errorText: {
    color: "#B91C1C",
    fontWeight: "800",
    textAlign: "center",
  },

  input: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5F0E8",
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
});
