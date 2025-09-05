import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="SignUp"
        options={{
          headerTransparent: true,
          headerTitle: ""
        }}
      />
      <Stack.Screen 
        name="SignIn"
        options={{
          headerTransparent: true,
          headerTitle: ""
        }}
      />
    </Stack>
  );
}