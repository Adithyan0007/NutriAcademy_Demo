import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="home" />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="my-learning" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
