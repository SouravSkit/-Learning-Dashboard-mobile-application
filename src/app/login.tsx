import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useLoginViewModel } from "@/viewModels/LoginViewModel";

export default function LoginScreen() {
  const viewModel = useLoginViewModel();
  const { signIn } = useAuth();

  async function handleLogin() {
    const success = await viewModel.login();
    if (success) {
      // Flipping the auth guard makes the root layout show the dashboard.
      signIn();
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Course Learn</Text>

          <TextInput
            placeholder="Email"
            value={viewModel.email}
            onChangeText={viewModel.setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            placeholder="Password"
            value={viewModel.password}
            onChangeText={viewModel.setPassword}
            style={styles.input}
            secureTextEntry
          />

          {viewModel.errorMessage !== null && (
            <Text style={styles.error}>{viewModel.errorMessage}</Text>
          )}

          <Pressable
            onPress={handleLogin}
            disabled={viewModel.isLoading}
            style={({ pressed }) => [
              styles.button,
              (viewModel.isLoading || pressed) && styles.buttonDisabled,
            ]}
          >
            {viewModel.isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonLabel}>Login</Text>
            )}
          </Pressable>

          <Text style={styles.hint}>
            Give any email + a password of 6+ characters.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 17,
    backgroundColor: "#FFFFFF",
  },
  error: {
    color: "#FF3B30",
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  hint: {
    fontSize: 13,
    color: "#6D6D70",
    textAlign: "center",
  },
});
