import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="give" />
      <Stack.Screen name="prayers" />
      <Stack.Screen name="fellowship" />
      <Stack.Screen name="events/index" />
      <Stack.Screen name="article/[id]" />
      <Stack.Screen name="more" />
      <Stack.Screen name="account" />
      <Stack.Screen name="check-in" />
      <Stack.Screen name="service-times" />
      <Stack.Screen name="new-here" />
      <Stack.Screen name="about" />
      <Stack.Screen name="contact" />
      <Stack.Screen name="testimonies" />
      <Stack.Screen name="food-bank" />
      <Stack.Screen name="free-transport" />
      <Stack.Screen name="resources/bfc" />
      <Stack.Screen name="resources/wofbi" />
      <Stack.Screen name="bible/index" />
      <Stack.Screen name="bible/[bookNumber]" />
      <Stack.Screen name="bible/[bookNumber]/[chapter]" />
      <Stack.Screen name="hymns/index" />
      <Stack.Screen name="hymns/[id]" />
      <Stack.Screen name="notes/index" />
      <Stack.Screen name="notes/new" />
      <Stack.Screen name="notes/[id]" />
    </Stack>
  );
}
