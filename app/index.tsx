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
import { loginUser } from "../data/localDb";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing details", "Please enter email and password");
      return;
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      Alert.alert("Login failed", result.message);
      return;
    }

    router.replace("/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NUTRIACADEMY</Text>
      <Text style={styles.subtitle}>Professional nutrition courses</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
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
    backgroundColor: "#F8FAFC",
  },
  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#166534",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginBottom: 35,
    marginTop: 8,
  },
  input: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
});
