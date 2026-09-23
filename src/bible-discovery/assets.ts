import type { ImageSourcePropType } from "react-native";

export const STORY_ARTWORK: Record<string, ImageSourcePropType> = {
  creation: require("../../assets/images/bible-discovery/stories/creation.webp"),
  "noah-and-the-ark": require("../../assets/images/bible-discovery/stories/noah-and-the-ark.webp"),
  abraham: require("../../assets/images/bible-discovery/stories/abraham.webp"),
  joseph: require("../../assets/images/bible-discovery/stories/joseph.webp"),
  moses: require("../../assets/images/bible-discovery/stories/moses.webp"),
  "joshua-jericho": require("../../assets/images/bible-discovery/stories/joshua-jericho.webp"),
  ruth: require("../../assets/images/bible-discovery/stories/ruth.webp"),
  samuel: require("../../assets/images/bible-discovery/stories/samuel.webp"),
  "david-and-goliath": require("../../assets/images/bible-discovery/stories/david-and-goliath.webp"),
  solomon: require("../../assets/images/bible-discovery/stories/solomon.webp"),
  elijah: require("../../assets/images/bible-discovery/stories/elijah.webp"),
  jonah: require("../../assets/images/bible-discovery/stories/jonah.webp"),
  "daniel-and-the-lions": require("../../assets/images/bible-discovery/stories/daniel-and-the-lions.webp"),
  esther: require("../../assets/images/bible-discovery/stories/esther.webp"),
  "birth-of-jesus": require("../../assets/images/bible-discovery/stories/birth-of-jesus.webp"),
  "jesus-calms-storm": require("../../assets/images/bible-discovery/stories/jesus-calms-storm.webp"),
  "good-samaritan": require("../../assets/images/bible-discovery/stories/good-samaritan.webp"),
  "prodigal-son": require("../../assets/images/bible-discovery/stories/prodigal-son.webp"),
  crucifixion: require("../../assets/images/bible-discovery/stories/crucifixion.webp"),
  resurrection: require("../../assets/images/bible-discovery/stories/resurrection.webp"),
};

export const COLLECTION_COVER_ARTWORK: Record<string, ImageSourcePropType> = {
  "foundations-of-faith": STORY_ARTWORK.creation,
  "heroes-of-faith": STORY_ARTWORK["david-and-goliath"],
  "women-of-faith": STORY_ARTWORK.esther,
  "miracles-of-jesus": STORY_ARTWORK["jesus-calms-storm"],
  "parables-of-jesus": STORY_ARTWORK["good-samaritan"],
  "easter-journey": STORY_ARTWORK.resurrection,
};
