import { PostData } from "@/utils/postData";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import undefined from "./ui/TabBarBackground";

interface PostFormProps {
  onSubmit: (post: PostData) => void;
  onCancel: () => void;
  defaultAuthor?: string | null;
}

export default function PostForm({ onSubmit, onCancel }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = () => {
    setError(null);

    if (!title.trim()) return setError("Tittelen kan ikke være tom");
    if (!description.trim())
      return setError("Beskrivelsen kan heller ikke være tom");

    const newPost: PostData = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
    };

    setSubmitting(true);
    onSubmit(newPost);
    setSubmitting(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.header}> Ny post</Text>

        <Text style={styles.label}> Tittel</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="tittel.."
        />

        <Text style={styles.label}> Beskrivelse</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Hva har du på hjertet?"
        />

        {error ? <Text style={styles.error}> {error}</Text> : null}

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.secondary]}
            onPress={onCancel}
            disabled={submitting}
          >
            <Text style={styles.secondaryText}> Avbryt</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleSave}
            disabled={submitting}
          >
            <Text style={styles.primaryText}>
              {submitting ? "Lagrer..." : "Lagre"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  label: { fontWeight: "600", marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  multiline: { minHeight: 80, textAlignVertical: "top" },
  error: { color: "red", marginTop: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  primary: { backgroundColor: "#007AFF" },
  primaryText: { color: "white", fontWeight: "700" },
  secondary: { backgroundColor: "#eee" },
  secondaryText: { color: "#333", fontWeight: "700" },
});
