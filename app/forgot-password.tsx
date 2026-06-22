import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { resetPassword } from "../data/localDb";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleResetPassword() {
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = newPassword.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter email and new password.");
      return;
    }

    if (trimmedPassword.length < 4) {
      setError("Password should be at least 4 characters.");
      return;
    }

    const result = await resetPassword(trimmedEmail, trimmedPassword);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);
    setEmail("");
    setNewPassword("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoMark}>
        <Text style={styles.logoLetter}>N</Text>
      </View>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your registered email and create a new password.
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {success ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{success}</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Registered email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError("");
          setSuccess("");
        }}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="New password"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setError("");
            setSuccess("");
          }}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.link}>Back to Login</Text>
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
    fontSize: 32,
    fontWeight: "900",
    color: "#0D2818",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginBottom: 28,
    marginTop: 8,
    fontWeight: "600",
    lineHeight: 22,
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

  successBox: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#86EFAC",
    padding: 13,
    borderRadius: 14,
    marginBottom: 14,
  },

  successText: {
    color: "#166534",
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
});
