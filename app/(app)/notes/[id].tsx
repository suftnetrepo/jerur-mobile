import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, Share } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledButton, StyledText, StyledPressable, Stack, Loader, useToast, useDialogue } from "fluent-styles";
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
  const [note, setNote] = useState<Note | null | undefined>(undefined); // undefined = still loading
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

  // Refreshes isMarked whenever this screen regains focus too (e.g. the
  // user marked a *different* note from the library, then came back here).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

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
    // If this was the Bible Note, its mark simply disappears with the row
    // (SQLite is the single source of truth for the mark - see
    // src/notes/marked-note.ts) - no separate cleanup needed here.
    await deleteNote(id);
    router.back();
  }

  // Native share sheet - title + full content, same text a member would
  // get from formatNoteShareText elsewhere (kept as one pure formatter so
  // "what gets shared" has a single definition). Works identically whether
  // the note was typed manually or grew from Bible verses via
  // appendToMarkedNote() - it's all just `content` by this point.
  async function handleShare() {
    if (!note) return;
    try {
      await Share.share({ message: formatNoteShareText({ title, content }) });
    } catch {
      // User-cancelled or platform share error - nothing to recover from here.
    }
  }

  async function handleToggleBibleNote() {
    if (!note || marking) return;
    setMarking(true);
    try {
      if (note.isMarked) {
        await unmarkNote();
      } else {
        await markNote(note.id);
      }
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
          size: 48,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.chromeBorder,
        }}
        marginHorizontal={16}
        
        onBackPress={() => router.back()}
        backgroundColor={COLORS.paper}
       
        title={getDisplayTitle(note)}
        titleAlignment="left"
        titleProps={{ fontSize: 15, fontWeight: "700", color: COLORS.ink, numberOfLines: 1 }}
        rightIcon={
          <Stack horizontal alignItems="center" gap={8}>
            <StyledButton icon compact backgroundColor={COLORS.chrome} onPress={handleShare} accessibilityLabel="Share note">
              <Icon name="share" size={15} color={COLORS.ink} />
            </StyledButton>
            <StyledButton icon compact backgroundColor={COLORS.errorLight} onPress={handleDelete} accessibilityLabel="Delete note">
              <Icon name="trash-2" size={15} color={COLORS.error} />
            </StyledButton>
            <StyledButton icon compact primary loading={saving} onPress={handleSave} accessibilityLabel="Save note">
              <Icon name="check" size={16} color={COLORS.white} />
            </StyledButton>
          </Stack>
        }
      />

      <Stack paddingHorizontal={24} paddingTop={4} paddingBottom={10} gap={10}>
        <StyledPressable
          onPress={handleToggleBibleNote}
          disabled={marking}
          flexDirection="row"
          alignSelf="flex-start"
          alignItems="center"
          gap={6}
          paddingHorizontal={13}
          paddingVertical={8}
          borderRadius={20}
          marginTop={4}
          backgroundColor={note.isMarked ? COLORS.goldPale : COLORS.white}
          style={{ borderWidth: 1, borderColor: note.isMarked ? COLORS.gold : COLORS.chromeBorder }}
          accessibilityRole="button"
          accessibilityLabel={note.isMarked ? "Bible Note, tap to unset" : "Set as Bible Note"}
        >
          <Icon name="book" size={13} color={note.isMarked ? COLORS.goldDeep : COLORS.inkSoft} />
          <StyledText fontSize={12.5} fontWeight="700" color={note.isMarked ? COLORS.goldDeep : COLORS.inkSoft}>
            {note.isMarked ? "Bible Note ✓" : "Set as Bible Note"}
          </StyledText>
        </StyledPressable>

        <StyledText fontSize={11.5} color={COLORS.inkSoft}>
          Updated {formatNoteDateTime(note.updatedAt)}
        </StyledText>
      </Stack>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={12}>
        <Stack flex={1} paddingHorizontal={24} paddingBottom={20}>
          <NoteFormFields title={title} onTitleChange={setTitle} content={content} onContentChange={setContent} />
        </Stack>
      </KeyboardAvoidingView>
    </StyledPage>
  );
}
