import { useState } from "react";
import { Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { StyledPage, Stack } from "fluent-styles";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { Text } from "../../../src/components/text";
import { DiscoveryCollectionCard, DiscoveryFontSizeButton } from "../../../src/components/BibleDiscovery";
import { ReaderFontSizePopup } from "../../../src/components/ReaderFontSizePopup";
import { DISCOVERY_COLLECTIONS, getStoriesForCollection } from "../../../src/bible-discovery/data";
import { useReaderFontSize } from "../../../src/bible/use-reader-font-size";
import { COLORS, isDarkTheme } from "../../../src/theme/colors";

export default function CollectionsScreen() { return <FeatureGate feature="bible-discovery"><Content /></FeatureGate>; }
function Content() { const { fontSize, increase, decrease, reset, canIncrease, canDecrease } = useReaderFontSize(); const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false); const scale = fontSize / 19; return <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paperSoft} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paperSoft : undefined}><AppBackHeader title="Collections" backgroundColor={COLORS.paperSoft} rightIcon={<DiscoveryFontSizeButton onPress={() => setFontSizePopupVisible(true)} />} /><ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}><Stack marginBottom={20} gap={5}><Text fontSize={26 * scale} fontWeight="800" color={COLORS.ink}>Discover by collection</Text><Text fontSize={13.5 * scale} color={COLORS.inkSoft} style={{ lineHeight: 20 * scale }}>Explore Bible stories grouped around faith, courage, the life of Jesus and the hope of Easter.</Text></Stack><Stack gap={18}>{DISCOVERY_COLLECTIONS.map((collection) => { const stories = getStoriesForCollection(collection.id); if (!stories.length) return null; return <DiscoveryCollectionCard key={collection.id} collection={collection} storyCount={stories.length} width="100%" height={Math.max(280, 280 * scale)} fontScale={scale} onPress={() => router.push(`/bible-discovery/collection/${collection.id}` as never)} />; })}</Stack></ScrollView><ReaderFontSizePopup visible={fontSizePopupVisible} onClose={() => setFontSizePopupVisible(false)} fontSize={fontSize} canDecrease={canDecrease} canIncrease={canIncrease} onDecrease={decrease} onIncrease={increase} onReset={reset} /></StyledPage>; }
