import { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledShape,
  Stack,
} from "fluent-styles";
import { Text } from "../../../src/components/text";
import { FeatureGate } from "../../../src/components/FeatureGate";
import {
  BibleChapterGrid,
  useBibleGridWidth,
} from "../../../src/components/BibleChapterGrid";
import { getBook } from "../../../src/bible/bible-lookup";
import { COLORS, ICON_TONES } from "../../../src/theme/colors";
import { SHADOW_CARD } from "../../../src/theme/shadows";

const H_PAD = 24;

export default function BibleBookScreen() {
  return (
    <FeatureGate feature="bible">
      <BibleBookScreenContent />
    </FeatureGate>
  );
}

function BibleBookScreenContent() {
  const { bookNumber: bookNumberParam } = useLocalSearchParams<{
    bookNumber: string;
  }>();
  const bookNumber = Number(bookNumberParam);
  const book = useMemo(() => getBook(bookNumber), [bookNumber]);
  const gridWidth = useBibleGridWidth(H_PAD);

  if (!book) {
    return (
      <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
        <StyledPage.Header
          showBackArrow
          onBackPress={() => router.back()}
          title="Bible"
          titleAlignment="center"
        />
        <Stack
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={32}
        >
          <Text
            fontSize={14}
            color={COLORS.inkSoft}
            style={{ textAlign: "center" }}
          >
            That book couldn't be found.
          </Text>
        </Stack>
      </StyledPage>
    );
  }

  const tone = ICON_TONES[(book.number - 1) % ICON_TONES.length];

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header
        marginHorizontal={16}
        showBackArrow
         shapeProps ={{ cycle: true, size : 48, borderRadius: 24, borderWidth: 1, borderColor: COLORS.chromeBorder }}
   
        onBackPress={() => router.back()}
        title={book.name}
        titleAlignment="left"
        backgroundColor={COLORS.paper}
      />
      <StyledScrollView
        contentContainerStyle={{
          paddingHorizontal: H_PAD,
          paddingTop: 12,
          paddingBottom: 32,
        }}
      >
        <BibleChapterGrid
          chapterCount={book.chapterCount}
          tone={tone}
          containerWidth={gridWidth}
          onSelect={(chapter) =>
            router.push(`/bible/${book.number}/${chapter}/verses` as any)
          }
        />
      </StyledScrollView>
    </StyledPage>
  );
}
