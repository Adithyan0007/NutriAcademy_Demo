import { Stack, router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getCurrentUser } from "../data/localDb";

export default function RootLayout() {
  const segments = useSegments();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function protectRoutes() {
      const user = await getCurrentUser();

      const currentRoute = String(segments[0] || "");

      const isPublicRoute =
        currentRoute === "" ||
        currentRoute === "signup" ||
        currentRoute === "forgot-password";

      if (!user && !isPublicRoute) {
        router.replace("/");
      }

      if (user && isPublicRoute) {
        router.replace("/home");
      }

      setCheckingAuth(false);
    }

    protectRoutes();
  }, [segments]);

  if (checkingAuth) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F0FDF4",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#166534" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="home" />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="lesson/[courseId]/[lessonId]" />
      <Stack.Screen name="my-learning" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
