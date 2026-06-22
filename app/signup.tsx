import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
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

  async function handleSignup() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      Alert.alert("Missing details", "Please fill all fields");
      return;
    }

    if (trimmedPassword.length < 4) {
      Alert.alert("Weak password", "Password should be at least 4 characters");
      return;
    }

    const result = await signupUser(trimmedName, trimmedEmail, trimmedPassword);

    if (!result.success) {
      Alert.alert("Signup failed", result.message);
      return;
    }

    setName("");
    setEmail("");
    setPassword("");

    Alert.alert(
      "Account Created",
      "Your account has been created successfully. Please login now.",
      [
        {
          text: "Login",
          onPress: () => router.replace("/"),
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoMark}>
        <Text style={styles.logoLetter}>N</Text>
      </View>

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>Start your nutrition learning journey</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
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
