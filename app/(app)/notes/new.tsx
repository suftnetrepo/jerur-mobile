import { ThemeHeader } from "@/src/components/ThemeHeader";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledButton, Stack, useToast } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { NoteFormFields } from "../../../src/components/NoteFormFields";
import { createNote, updateNote } from "../../../src/notes/notes-repository";
import { COLORS , isDarkTheme } from "../../../src/theme/colors";

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
  const autoSavedNoteIdRef = useRef<string | null>(null);
  const toast = useToast();

  async function handleContentCommit(nextContent: string) {
    try {
      if (autoSavedNoteIdRef.current) {
        await updateNote(autoSavedNoteIdRef.current, { title: title.trim(), content: nextContent });
      } else {
        const created = await createNote({ title: title.trim(), content: nextContent });
        autoSavedNoteIdRef.current = created.id;
      }
    } catch (error) {
      toast.error("Couldn't save note", "Your text is still in the composer. Please try again.");
      throw error;
    }
  }

  async function handleSave() {
    if (savingRef.current) return;
    if (!title.trim() && !content.trim()) {
      toast.info("Nothing to save yet", "Write something before saving your note.");
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      if (autoSavedNoteIdRef.current) {
        await updateNote(autoSavedNoteIdRef.current, { title: title.trim(), content: content.trim() });
      } else {
        await createNote({ title: title.trim(), content: content.trim() });
      }
      router.back();
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paper : undefined}>
      <ThemeHeader
        showBackArrow
         shapeProps={{
          cycle: true,
          size: 46,
          borderRadius: 23,
          borderWidth: 1,
          borderColor: COLORS.chromeBorder,
        }}
        marginHorizontal={16}
        onBackPress={() => router.back()}
        title="New Note"
        titleAlignment="center"
        backgroundColor={COLORS.paper}
        rightIcon={
         <StyledButton icon compact backgroundColor={COLORS.sage} loading={saving} onPress={handleSave} accessibilityLabel="Save note">
              <Icon name="check" size={16} color={COLORS.onPrimary} />
            </StyledButton>
        }
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={12}>
        <Stack flex={1} paddingHorizontal={16} paddingVertical={16} paddingBottom={20}>
          <NoteFormFields
            title={title}
            onTitleChange={setTitle}
            content={content}
            onContentChange={setContent}
            onContentCommit={handleContentCommit}
          />
        </Stack>
      </KeyboardAvoidingView>
    </StyledPage>
  );
}
