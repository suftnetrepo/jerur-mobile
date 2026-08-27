import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledButton, Stack, useToast } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { NoteFormFields } from "../../../src/components/NoteFormFields";
import { createNote } from "../../../src/notes/notes-repository";
import { COLORS } from "../../../src/theme/colors";

export default function NewNoteScreen() {
  return (
    <FeatureGate feature="note">
      <NewNoteScreenContent />
    </FeatureGate>
  );
}

function NewNoteScreenContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  // Explicit-Save (no autosave), guarded against a double-tap firing two
  // creates - the ref is checked synchronously before React state catches up.
  const savingRef = useRef(false);
  const toast = useToast();

  async function handleSave() {
    if (savingRef.current) return;
    if (!title.trim() && !content.trim()) {
      toast.info("Nothing to save yet", "Write something before saving your note.");
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      await createNote({ title: title.trim(), content: content.trim() });
      router.back();
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header
        showBackArrow
        onBackPress={() => router.back()}
        title="New Note"
        titleAlignment="center"
        backgroundColor={COLORS.paper}
        rightIcon={
         <StyledButton icon compact backgroundColor={COLORS.sage} loading={saving} onPress={handleSave} accessibilityLabel="Save note">
              <Icon name="check" size={16} color={COLORS.white} />
            </StyledButton>
        }
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={12}>
        <Stack flex={1} paddingHorizontal={16} paddingVertical={16} paddingBottom={20}>
          <NoteFormFields title={title} onTitleChange={setTitle} content={content} onContentChange={setContent} />
        </Stack>
      </KeyboardAvoidingView>
    </StyledPage>
  );
}
