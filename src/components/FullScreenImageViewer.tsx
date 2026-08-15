import { Image, Modal, Pressable, StatusBar } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPressable } from "fluent-styles";

/**
 * Minimal full-screen lightbox for flyers and other content-led images.
 * `contain` is intentional: unlike card thumbnails, the viewer must never
 * crop text or artwork. The dark backdrop may be tapped to close, while the
 * image itself consumes taps so it does not dismiss accidentally.
 */
export function FullScreenImageViewer({
  visible,
  imageUri,
  accessibilityLabel,
  onClose,
}: {
  visible: boolean;
  imageUri: string;
  accessibilityLabel: string;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.96)" />
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close image viewer"
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.96)", justifyContent: "center" }}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 72 }}
        >
          <Image
            source={{ uri: imageUri }}
            resizeMode="contain"
            accessibilityLabel={accessibilityLabel}
            style={{ width: "100%", height: "100%" }}
          />
        </Pressable>

        <StyledPressable
          onPress={onClose}
          width={44}
          height={44}
          borderRadius={22}
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(255,255,255,0.16)"
          accessibilityRole="button"
          accessibilityLabel="Close image viewer"
          style={{ position: "absolute", top: 54, right: 18 }}
        >
          <Icon name="x" size={22} color="#FFFFFF" />
        </StyledPressable>
      </Pressable>
    </Modal>
  );
}
