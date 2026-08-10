import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledText, StyledTextInput, StyledButton, Stack, Loader } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { NoteCard } from "../../../src/components/NoteCard";
import { getNotes } from "../../../src/notes/notes-repository";
import { searchNotes } from "../../../src/notes/notes-search";
import { COLORS } from "../../../src/theme/colors";
import type { Note } from "../../../src/notes/types";

export default function NotesScreen() {
  return (
    <FeatureGate feature="note">
      <NotesScreenContent />
    </FeatureGate>
  );
}

function NotesScreenContent() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Reloads every time this screen gains focus (not just on first mount) -
  // expo-router keeps the library screen mounted underneath /notes/new and
  // /notes/[id], so a plain useEffect(() => {}, []) would never see notes
  // created/edited/deleted/marked after the initial load. SQLite reads are
  // a few ms, not worth a global store just to avoid this.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getNotes().then((result) => {
        if (!cancelled) {
          setNotes(result);
          setLoading(false);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const filtered = searchNotes(notes, query);

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
      <StyledPage.Header showBackArrow onBackPress={() => router.back()} backgroundColor={COLORS.chrome} />

      <Stack paddingHorizontal={24} paddingTop={4} paddingBottom={16}>
        <StyledText fontSize={26} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Notes
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 18, lineHeight: 20 }}>
          Write, reflect and grow in God's Word
        </StyledText>

        <StyledButton primary onPress={() => router.push("/notes/new" as any)} style={{ width: "100%", marginBottom: 16 }}>
          <StyledText fontSize={14.5} fontWeight="700" color={COLORS.white}>
            + Create Note
          </StyledText>
        </StyledButton>

        <StyledTextInput
          variant="outline"
          placeholder="Search notes..."
          leftIcon={<Icon name="search" size={15} color={COLORS.inkSoft} />}
          value={query}
          onChangeText={setQuery}
          clearable
          maxLength={60}
        />
      </Stack>

      {loading ? (
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Loader color={COLORS.indigo} />
        </Stack>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteCard note={item} onPress={() => router.push(`/notes/${item.id}` as any)} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 2, paddingBottom: 32, gap: 12, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            notes.length === 0 ? (
              <Stack flex={1} alignItems="center" justifyContent="center" paddingVertical={48} gap={10} paddingHorizontal={20}>
                <Stack width={56} height={56} borderRadius={28} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center" marginBottom={4}>
                  <Icon name="edit-3" size={22} color={COLORS.goldDeep} />
                </Stack>
                <StyledText fontSize={16} fontWeight="800" color={COLORS.ink}>
                  No notes yet
                </StyledText>
                <StyledText fontSize={13} color={COLORS.inkSoft} style={{ textAlign: "center", lineHeight: 19 }}>
                  Capture what God is speaking to you as you read and reflect.
                </StyledText>
                <StyledButton primary compact onPress={() => router.push("/notes/new" as any)} style={{ marginTop: 8 }}>
                  <StyledText fontSize={13.5} fontWeight="700" color={COLORS.white}>
                    Create your first note
                  </StyledText>
                </StyledButton>
              </Stack>
            ) : (
              <Stack alignItems="center" paddingVertical={48}>
                <StyledText fontSize={14} color={COLORS.inkSoft}>
                  No notes found
                </StyledText>
              </Stack>
            )
          }
        />
      )}
    </StyledPage>
  );
}
