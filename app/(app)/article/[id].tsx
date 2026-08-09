import { Image, Linking, Share, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledButton, Stack, Loader } from "fluent-styles";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import RenderHTML, { type MixedStyleDeclaration } from "react-native-render-html";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { useArticleDetail } from "../../../src/hooks/useChurchData";
import { getFeatureById } from "../../../src/config/mobileFeatures";
import { SHADOW_SOFT } from "../../../src/theme/shadows";
import { COLORS } from "../../../src/theme/colors";

const H_PAD = 24;
const HERO_HEIGHT = 220;
const ACCENT_COLOR = getFeatureById("articles")?.color ?? "#4F46E5";

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

// Premium, readable typography for the rich-text body — headings/quotes
// tuned to sit comfortably alongside the rest of the app's serif-free,
// generous-line-height reading style (see "A word of welcome" on Home).
const HTML_TAGS_STYLES: Record<string, MixedStyleDeclaration> = {
  body: { color: COLORS.ink, fontSize: 15.5, lineHeight: 25 },
  p: { marginTop: 0, marginBottom: 16 },
  h1: { fontSize: 22, fontWeight: "800", color: COLORS.ink, marginTop: 8, marginBottom: 12, lineHeight: 28 },
  h2: { fontSize: 19, fontWeight: "800", color: COLORS.ink, marginTop: 8, marginBottom: 10, lineHeight: 25 },
  h3: { fontSize: 17, fontWeight: "700", color: COLORS.ink, marginTop: 6, marginBottom: 8, lineHeight: 23 },
  strong: { fontWeight: "700" },
  b: { fontWeight: "700" },
  em: { fontStyle: "italic" },
  i: { fontStyle: "italic" },
  u: { textDecorationLine: "underline" },
  a: { color: ACCENT_COLOR, fontWeight: "600", textDecorationLine: "underline" },
  ul: { marginBottom: 16 },
  ol: { marginBottom: 16 },
  li: { marginBottom: 6 },
  blockquote: {
    marginLeft: 0,
    marginRight: 0,
    marginVertical: 16,
    paddingLeft: 16,
    paddingVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT_COLOR,
    color: COLORS.inkSoft,
    fontStyle: "italic",
  },
};

export default function ArticleDetailScreen() {
  return (
    <FeatureGate feature="articles">
      <ArticleDetailScreenContent />
    </FeatureGate>
  );
}

function ArticleDetailScreenContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: article, isLoading, isError } = useArticleDetail(id);
  const { width: windowWidth } = useWindowDimensions();

  function handleShare() {
    if (!article) return;
    Share.share({ message: `${article.title}\n\n${article.summary}` });
  }

  return (
    <StyledPage showStatusBar backgroundColor={COLORS.paper}>
      <StyledPage.Header marginHorizontal={16} title="Article" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />

      {isLoading ? (
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Loader color={COLORS.indigo} />
        </Stack>
      ) : isError || !article ? (
        <Stack flex={1} alignItems="center" justifyContent="center" paddingHorizontal={32} gap={6}>
          <StyledText fontSize={15} fontWeight="700" color={COLORS.ink} style={{ textAlign: "center" }}>
            This article isn't available
          </StyledText>
          <StyledText fontSize={13} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
            It may have been unpublished or removed.
          </StyledText>
        </Stack>
      ) : (
        <StyledScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Stack paddingHorizontal={H_PAD} marginTop={8}>
            <Stack height={HERO_HEIGHT} borderRadius={20} overflow="hidden" style={SHADOW_SOFT}>
              {article.secure_url ? (
                <Image source={{ uri: article.secure_url }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              ) : (
                <Svg width="100%" height="100%">
                  <Defs>
                    <LinearGradient id="article-detail-bg" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor="#4F46E5" />
                      <Stop offset="1" stopColor="#312E81" />
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="100%" fill="url(#article-detail-bg)" />
                </Svg>
              )}
            </Stack>
          </Stack>

          <Stack paddingHorizontal={H_PAD} marginTop={20} gap={8}>
            <StyledText fontSize={24} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 30 }}>
              {article.title}
            </StyledText>
            {formatDate(article.publishedAt) ? (
              <Stack horizontal alignItems="center" gap={6}>
                <Icon name="calendar" size={13} color={COLORS.inkSoft} />
                <StyledText fontSize={12.5} color={COLORS.inkSoft}>
                  {formatDate(article.publishedAt)}
                </StyledText>
              </Stack>
            ) : null}
          </Stack>

          <Stack paddingHorizontal={H_PAD} marginTop={20}>
            <RenderHTML
              contentWidth={windowWidth - H_PAD * 2}
              source={{ html: article.content }}
              tagsStyles={HTML_TAGS_STYLES}
              renderersProps={{
                a: {
                  onPress: (_event, href) => {
                    if (href) Linking.openURL(href);
                  },
                },
              }}
              defaultTextProps={{ selectable: true }}
            />
          </Stack>

          <Stack paddingHorizontal={H_PAD} marginTop={28}>
            <StyledButton outline block onPress={handleShare} accessibilityLabel="Share this article">
              <Stack horizontal alignItems="center" justifyContent="center" gap={8}>
                <Icon name="share-2" size={15} color={COLORS.ink} />
                <StyledText fontSize={14} fontWeight="700" color={COLORS.ink}>
                  Share Article
                </StyledText>
              </Stack>
            </StyledButton>
          </Stack>
        </StyledScrollView>
      )}
    </StyledPage>
  );
}
