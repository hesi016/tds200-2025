import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Gender = "Female" | "Male" | "Other" | "";

type Profile = {
  name: string;
  gender: Gender;
  bio: string;
  url: string;
};

const STORAGE_KEY = "profile_v1";

const defaultProfile: Profile = {
  name: "",
  gender: "",
  bio: "",
  url: "",
};

export default function ProfilePage() {
  // Saved (persisted) state
  const [saved, setSaved] = useState<Profile>(defaultProfile);

  // Draft (editable) state — alltid redigerbar i kortet
  const [draft, setDraft] = useState<Profile>(defaultProfile);

  // Last inn fra AsyncStorage ved mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: Profile = JSON.parse(raw);
          setSaved(parsed);
          setDraft(parsed); // start med saved-verdier
        }
      } catch (e) {
        console.warn("Failed to load profile", e);
      }
    })();
  }, []);

  // Enkle helpers
  const setField = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setDraft((p) => ({ ...p, [key]: value }));

  const isHttpUrl = useMemo(() => /^https?:\/\/.+/i.test(draft.url), [draft.url]);

  const onSave = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSaved(draft);
      Alert.alert("Saved", "Profile updated.");
    } catch (e) {
      Alert.alert("Error", "Could not save profile.");
    }
  };

  const onCancel = () => {
    setDraft(saved); // forkast endringer
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Profile</Text>

          {/* Profil-kort: direkte redigerbart */}
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <View style={styles.avatarFrame}>
                {isHttpUrl ? (
                  <Image source={{ uri: draft.url }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitials}>
                      {draft.name ? draft.name.charAt(0).toUpperCase() : "?"}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ flex: 1, gap: 8 }}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  placeholder="Enter your name"
                  value={draft.name}
                  onChangeText={(t) => setField("name", t)}
                  style={styles.input}
                />
              </View>
            </View>

            <Text style={styles.label}>Profile picture URL</Text>
            <TextInput
              placeholder="https://example.com/me.jpg"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              value={draft.url}
              onChangeText={(t) => setField("url", t)}
              style={styles.input}
            />
            {draft.url.length > 0 && !isHttpUrl && (
              <Text style={styles.helper}>Tip: URL må starte med http:// eller https://</Text>
            )}

            <Text style={styles.label}>Gender</Text>
            <View style={styles.segment}>
              {(["Female", "Male", "Other"] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setField("gender", g)}
                  style={[styles.segmentBtn, draft.gender === g && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, draft.gender === g && styles.segmentTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Short bio</Text>
            <TextInput
              placeholder="Tell us a bit about yourself…"
              value={draft.bio}
              onChangeText={(t) => setField("bio", t)}
              style={[styles.input, styles.multiline]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onSave}>
                <Text style={styles.btnPrimaryText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onCancel}>
                <Text style={styles.btnGhostText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Liten oppsummering av lagret status */}
          <View style={styles.footerNote}>
            <Text style={styles.footerText}>
              Saved data persists via AsyncStorage. Reload the app to verify.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" }, // slate-900
  container: { padding: 20, gap: 16 },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#111827", // gray-900
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "#1f2937", // gray-800
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerRow: { flexDirection: "row", gap: 16, alignItems: "center" },
  avatarFrame: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#0b1220",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { width: "100%", height: "100%", resizeMode: "cover" },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: { color: "#94a3b8", fontSize: 28, fontWeight: "700" },
  label: { color: "#9ca3af", fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: "#0b1220",
    borderColor: "#23304a",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "white",
    fontSize: 16,
  },
  helper: { color: "#fbbf24", fontSize: 12, marginTop: -4 }, // amber-400
  multiline: { minHeight: 96 },
  segment: { flexDirection: "row", gap: 8 },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#23304a",
    backgroundColor: "#0b1220",
    alignItems: "center",
  },
  segmentBtnActive: {
    backgroundColor: "#1d4ed8", // blue-700
    borderColor: "#1d4ed8",
  },
  segmentText: { color: "#cbd5e1", fontSize: 14, fontWeight: "600" },
  segmentTextActive: { color: "white" },
  actions: { flexDirection: "row", gap: 12, marginTop: 6 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#2563eb" }, // blue-600
  btnPrimaryText: { color: "white", fontWeight: "700" },
  btnGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#334155" },
  btnGhostText: { color: "#cbd5e1", fontWeight: "700" },
  footerNote: { alignItems: "center", marginTop: 4 },
  footerText: { color: "#94a3b8", fontSize: 12 },
});
