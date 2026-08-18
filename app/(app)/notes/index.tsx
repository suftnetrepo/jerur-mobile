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
        title="Notes"
        titleAlignment="center"
        onBackPress={() => router.back()}
        backgroundColor={COLORS.paper}
        titleProps={{
          fontSize: 17,
          fontWeight: "800",
          color: COLORS.ink,
        }}
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

      {/* ── Intro ─────────────────────────────────────────────────────── */}
      <Stack paddingHorizontal={24} paddingTop={2} paddingBottom={16}>
        <Stack alignItems="center" marginBottom={18}>
          <StyledText
            fontSize={13}
            color={COLORS.inkSoft}
            style={{ textAlign: "center", lineHeight: 19 }}
          >
            Write, reflect and grow in God's Word
          </StyledText>
        </Stack>

        {/* Search is deliberately contained and elevated instead of spanning
            edge-to-edge like a generic form control. */}
        <Stack
          backgroundColor={COLORS.white}
          borderRadius={18}
          paddingHorizontal={4}
          style={SHADOW_SOFT}
        >
          <StyledTextInput
            variant="filled"
            placeholder="Search your notes..."
            leftIcon={
              <Icon name="search" size={15} color={COLORS.inkSoft} />
            }
            value={query}
            onChangeText={setQuery}
            clearable
            maxLength={60}
          />
        </Stack>
      </Stack>

      {/* ── Library heading ───────────────────────────────────────────── */}
      {notes.length > 0 && (
        <Stack
          horizontal
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal={28}
          paddingTop={4}
          paddingBottom={12}
        >
          <Stack horizontal alignItems="center" gap={8}>
            <Stack
              width={28}
              height={28}
              borderRadius={14}
              backgroundColor={COLORS.goldPale}
              alignItems="center"
              justifyContent="center"
            >
              <Icon name="book-open" size={12} color={COLORS.goldDeep} />
            </Stack>
            <StyledText
              fontSize={12}
              fontWeight="800"
              letterSpacing={0.35}
              color={COLORS.ink}
            >
              {query.trim() ? "Search results" : "Your notes"}
            </StyledText>
          </Stack>

          <Stack
            paddingHorizontal={10}
            paddingVertical={5}
            borderRadius={12}
            backgroundColor={COLORS.paperAlt}
          >
            <StyledText
              fontSize={11.5}
              fontWeight="700"
              color={COLORS.inkSoft}
            >
              {filtered.length} note{filtered.length === 1 ? "" : "s"}
            </StyledText>
          </Stack>
        </Stack>
      )}

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
            paddingTop: 4,
            paddingBottom: 42,
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
                paddingVertical={42}
                paddingHorizontal={30}
              >
                <Stack
                  width={132}
                  height={132}
                  borderRadius={66}
                  backgroundColor={COLORS.goldPale}
                  alignItems="center"
                  justifyContent="center"
                  marginBottom={22}
                >
                  <Stack
                    width={88}
                    height={88}
                    borderRadius={44}
                    backgroundColor={COLORS.white}
                    alignItems="center"
                    justifyContent="center"
                    style={SHADOW_SOFT}
                  >
                    <Icon
                      name="book-open"
                      size={32}
                      color={COLORS.goldDeep}
                    />
                  </Stack>

                  <Icon
                    name="star"
                    size={12}
                    color={COLORS.gold}
                    style={{ position: "absolute", top: 10, right: 18 }}
                  />
                  <Icon
                    name="star"
                    size={8}
                    color={COLORS.goldDeep}
                    style={{ position: "absolute", bottom: 18, left: 13 }}
                  />
                </Stack>

                <StyledText
                  fontSize={18}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 7 }}
                >
                  Your notes start here
                </StyledText>

                <StyledText
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{
                    textAlign: "center",
                    lineHeight: 20,
                    marginBottom: 20,
                    maxWidth: 280,
                  }}
                >
                  Capture what God is speaking to you as you read, study and
                  reflect on His Word.
                </StyledText>

                <StyledButton
                  primary
                  compact
                  onPress={() => router.push("/notes/new" as any)}
                >
                  <Stack horizontal alignItems="center" gap={7}>
                    <Icon name="plus" size={14} color={COLORS.white} />
                    <StyledText
                      fontSize={13}
                      fontWeight="800"
                      color={COLORS.white}
                    >
                      Create your first note
                    </StyledText>
                  </Stack>
                </StyledButton>

                <Stack
                  horizontal
                  alignItems="flex-start"
                  gap={10}
                  backgroundColor={COLORS.goldPale}
                  borderRadius={18}
                  padding={15}
                  marginTop={24}
                  width="100%"
                >
                  <Stack
                    width={32}
                    height={32}
                    borderRadius={16}
                    backgroundColor={COLORS.white}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon name="bookmark" size={14} color={COLORS.goldDeep} />
                  </Stack>

                  <Stack flex={1}>
                    <StyledText
                      fontSize={12}
                      fontWeight="800"
                      color={COLORS.goldDeep}
                      style={{ marginBottom: 3 }}
                    >
                      Make one your Bible Note
                    </StyledText>
                    <StyledText
                      fontSize={11.5}
                      color={COLORS.goldDeep}
                      style={{ opacity: 0.82, lineHeight: 17 }}
                    >
                      Save verses from the Bible directly into one dedicated
                      note.
                    </StyledText>
                  </Stack>
                </Stack>
              </Stack>
            ) : (
              <Stack
                flex={1}
                alignItems="center"
                justifyContent="center"
                paddingVertical={56}
                paddingHorizontal={32}
              >
                <Stack
                  width={54}
                  height={54}
                  borderRadius={27}
                  backgroundColor={COLORS.paperAlt}
                  alignItems="center"
                  justifyContent="center"
                  marginBottom={12}
                >
                  <Icon name="search" size={21} color={COLORS.inkSoft} />
                </Stack>
                <StyledText
                  fontSize={15}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 5 }}
                >
                  No matching notes
                </StyledText>
                <StyledText
                  fontSize={12.5}
                  color={COLORS.inkSoft}
                  style={{ textAlign: "center" }}
                >
                  Try a different title, verse or keyword.
                </StyledText>
              </Stack>
            )
          }
        />
      )}
    </StyledPage>
  );
}