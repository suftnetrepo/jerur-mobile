import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, Share } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledButton,
  StyledText,
  StyledPressable,
  Stack,
  Loader,
  useToast,
  useDialogue,
} from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { NoteFormFields } from "../../../src/components/NoteFormFields";
import { getNoteById, updateNote, deleteNote } from "../../../src/notes/notes-repository";
import { markNote, unmarkNote } from "../../../src/notes/marked-note";
import { formatNoteDateTime, getDisplayTitle } from "../../../src/notes/display";
import { formatNoteShareText } from "../../../src/notes/share-text";
import { COLORS } from "../../../src/theme/colors";
import type { Note } from "../../../src/notes/types";

export default function NoteDetailScreen() {
  return (
    <FeatureGate feature="note">
      <NoteDetailScreenContent />
    </FeatureGate>
  );
}

function NoteDetailScreenContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<Note | null | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [marking, setMarking] = useState(false);
  const toast = useToast();
  const dialogue = useDialogue();

  const load = useCallback(async () => {
    const result = await getNoteById(id);
    setNote(result);
    if (result) {
      setTitle(result.title);
      setContent(result.content);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      const updated = await updateNote(id, { title: title.trim(), content: content.trim() });
      if (updated) setNote(updated);
      toast.success("Note saved");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = await dialogue.confirm({
      title: "Delete this note?",
      message: "This action cannot be undone.",
      icon: "🗑️",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      destructive: true,
    });
    if (!confirmed) return;
    await deleteNote(id);
    router.back();
  }

  async function handleShare() {
    if (!note) return;
    try {
      await Share.share({ message: formatNoteShareText({ title, content }) });
    } catch {}
  }

  async function handleToggleBibleNote() {
    if (!note || marking) return;
    setMarking(true);
    try {
      if (note.isMarked) await unmarkNote();
      else await markNote(note.id);
      await load();
    } finally {
      setMarking(false);
    }
  }

  if (note === undefined) {
    return (
      <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
        <StyledPage.Header showBackArrow onBackPress={() => router.back()} backgroundColor={COLORS.paper} paddingHorizontal={16} />
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Loader color={COLORS.indigo} />
        </Stack>
      </StyledPage>
    );
  }

  if (note === null) {
    return (
      <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
        <StyledPage.Header showBackArrow onBackPress={() => router.back()} title="Notes" titleAlignment="center" paddingHorizontal={16} />
        <Stack flex={1} alignItems="center" justifyContent="center" paddingHorizontal={32}>
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
            That note couldn't be found.
          </StyledText>
        </Stack>
      </StyledPage>
    );
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header
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
        backgroundColor={COLORS.paper}
        title={getDisplayTitle(note)}
        titleAlignment="left"
        titleProps={{
          fontSize: 16,
          fontWeight: "800",
          color: COLORS.ink,
          numberOfLines: 1,
        }}
        rightIcon={
          <Stack horizontal alignItems="center" gap={7}>
            <StyledButton icon compact backgroundColor={COLORS.chrome} onPress={handleShare} accessibilityLabel="Share note">
              <Icon name="share-2" size={15} color={COLORS.ink} />
            </StyledButton>
            <StyledButton icon compact backgroundColor={COLORS.errorLight} onPress={handleDelete} accessibilityLabel="Delete note">
              <Icon name="trash-2" size={15} color={COLORS.error} />
            </StyledButton>
            <StyledButton icon compact backgroundColor={COLORS.sage} loading={saving} onPress={handleSave} accessibilityLabel="Save note">
              <Icon name="check" size={16} color={COLORS.white} />
            </StyledButton>
          </Stack>
        }
      />

      {/* Compact document metadata */}
      <Stack paddingHorizontal={24} paddingTop={6} paddingBottom={14}>
        <Stack horizontal alignItems="center" justifyContent="space-between" gap={10}>
          <StyledPressable
            onPress={handleToggleBibleNote}
            disabled={marking}
            flexDirection="row"
            alignSelf="flex-start"
            alignItems="center"
            gap={6}
            paddingHorizontal={11}
            paddingVertical={7}
            borderRadius={16}
            backgroundColor={note.isMarked ? COLORS.goldPale : COLORS.white}
            style={{
              borderWidth: 1,
              borderColor: note.isMarked ? COLORS.gold : COLORS.chromeBorder,
            }}
            accessibilityRole="button"
            accessibilityLabel={note.isMarked ? "Bible Note, tap to unset" : "Set as Bible Note"}
          >
            <Icon name="book-open" size={12} color={note.isMarked ? COLORS.goldDeep : COLORS.inkSoft} />
            <StyledText fontSize={11.5} fontWeight="800" color={note.isMarked ? COLORS.goldDeep : COLORS.inkSoft}>
              {note.isMarked ? "Bible Note" : "Set as Bible Note"}
            </StyledText>
            {note.isMarked && <Icon name="check" size={12} color={COLORS.goldDeep} />}
          </StyledPressable>

          <Stack horizontal alignItems="center" gap={5} flexShrink={1}>
            <Icon name="clock" size={11} color={COLORS.inkSoft} />
            <StyledText fontSize={10.5} color={COLORS.inkSoft} numberOfLines={1}>
              {formatNoteDateTime(note.updatedAt)}
            </StyledText>
          </Stack>
        </Stack>
      </Stack>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={12}
      >
        <Stack flex={1} paddingHorizontal={24} paddingBottom={20}>
          <NoteFormFields
            title={title}
            onTitleChange={setTitle}
            content={content}
            onContentChange={setContent}
          />
        </Stack>
      </KeyboardAvoidingView>
    </StyledPage>
  );
}