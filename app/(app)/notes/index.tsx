import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledText,
  StyledTextInput,
  StyledButton,
  Stack,
  Loader,
  StyledSpacer,
} from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { NoteCard } from "../../../src/components/NoteCard";
import { getNotes } from "../../../src/notes/notes-repository";
import { searchNotes } from "../../../src/notes/notes-search";
import { COLORS, ICON_TONES } from "../../../src/theme/colors";
import { SHADOW_SOFT } from "../../../src/theme/shadows";
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
    }, []),
  );

  const filtered = searchNotes(notes, query);

  return (
    <StyledPage showStatusBar backgroundColor={COLORS.paper}>
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
        title="Notes"
        titleAlignment="center"
        onBackPress={() => router.back()}
        backgroundColor={COLORS.paper}
        rightIcon={
          <StyledButton
            icon
            compact
            backgroundColor={COLORS.goldPale}
            onPress={() => router.push("/notes/new" as any)}
            accessibilityLabel="Create note"
          >
            <Icon name="plus" size={20} color={COLORS.goldDeep} />
          </StyledButton>
        }
      />

      <StyledText
        textAlign="center"
        fontSize={13.5}
        color={COLORS.inkSoft}
        style={{ marginBottom: 18, lineHeight: 20 }}
      >
        Write, reflect and grow in God's Word
      </StyledText>
      <Stack>
        <StyledTextInput
          variant="filled"
          placeholder="Search notes..."
          leftIcon={<Icon name="search" size={15} color={COLORS.inkSoft} />}
          value={query}
          onChangeText={setQuery}
          clearable
          maxLength={60}
        />
      </Stack>
      <Stack vertical paddingHorizontal={24} paddingTop={4} paddingBottom={14}>
        {notes.length > 0 && (
          <Stack
            marginHorizontal={8}
            horizontal
            alignItems="center"
            justifyContent="space-between"
            marginTop={8}
          >
            <StyledText
              fontSize={11}
              fontWeight="700"
              letterSpacing={0.5}
              color={COLORS.inkSoft}
            >
              {query.trim() ? "Results" : "All Notes"}
            </StyledText>
            <StyledText fontSize={12} color={COLORS.inkSoft}>
              {filtered.length} note{filtered.length === 1 ? "" : "s"}
            </StyledText>
          </Stack>
        )}
      </Stack>

      {loading ? (
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Loader color={COLORS.indigo} />
        </Stack>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <NoteCard
              note={item}
              accentColor={ICON_TONES[index % ICON_TONES.length].fg}
              onPress={() => router.push(`/notes/${item.id}` as any)}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 6,
            paddingBottom: 32,
            gap: 12,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            notes.length === 0 ? (
              <Stack
                flex={1}
                alignItems="center"
                justifyContent="center"
                paddingVertical={32}
                gap={14}
                paddingHorizontal={32}
              >
                <Stack
                  width={140}
                  height={140}
                  borderRadius={70}
                  backgroundColor={COLORS.goldPale}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Stack
                    width={96}
                    height={96}
                    borderRadius={48}
                    backgroundColor={COLORS.white}
                    alignItems="center"
                    justifyContent="center"
                    style={SHADOW_SOFT}
                  >
                    <Icon name="book-open" size={36} color={COLORS.goldDeep} />
                  </Stack>
                  <Icon
                    name="star"
                    size={13}
                    color={COLORS.gold}
                    style={{ position: "absolute", top: 10, right: 18 }}
                  />
                  <Icon
                    name="star"
                    size={9}
                    color={COLORS.goldDeep}
                    style={{ position: "absolute", bottom: 18, left: 12 }}
                  />
                </Stack>
                <StyledText fontSize={17} fontWeight="800" color={COLORS.ink}>
                  No notes yet
                </StyledText>
                <StyledText
                  fontSize={13.5}
                  color={COLORS.inkSoft}
                  style={{ textAlign: "center", lineHeight: 20 }}
                >
                  Capture what God is speaking to you as you read and reflect.
                </StyledText>
                <StyledButton
                  primary
                  compact
                  onPress={() => router.push("/notes/new" as any)}
                  style={{ marginTop: 4 }}
                >
                  <StyledText
                    fontSize={13.5}
                    fontWeight="700"
                    color={COLORS.white}
                  >
                    + Create your first note
                  </StyledText>
                </StyledButton>

                <Stack
                  horizontal
                  alignItems="flex-start"
                  gap={10}
                  backgroundColor={COLORS.goldPale}
                  borderRadius={16}
                  padding={14}
                  marginTop={20}
                >
                  <Icon
                    name="zap"
                    size={15}
                    color={COLORS.goldDeep}
                    style={{ marginTop: 1 }}
                  />
                  <Stack flex={1}>
                    <StyledText
                      fontSize={12.5}
                      fontWeight="700"
                      color={COLORS.goldDeep}
                    >
                      Tip: Set a note as your Bible Note
                    </StyledText>
                    <StyledText
                      fontSize={12}
                      color={COLORS.goldDeep}
                      style={{ opacity: 0.85, marginTop: 2, lineHeight: 17 }}
                    >
                      to quickly save verses from the Bible.
                    </StyledText>
                  </Stack>
                </Stack>
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
