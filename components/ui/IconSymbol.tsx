// This file is a fallback for using MaterialIcons on Android and web.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

const MAPPING = {
  'arrow.left': 'arrow-left',
  'arrow.right': 'arrow-right',
  'arrow.up': 'arrow-up',
  'arrow.down': 'arrow-down',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'chevron.up': 'chevron-up',
  'chevron.down': 'chevron-down',
  'xmark': 'close',
  'heart': 'heart',
  'heart.fill': 'heart',
  'star': 'star',
  'star.fill': 'star',
  'person': 'account',
  'person.fill': 'account',
  'house': 'home',
  'house.fill': 'home',
  'magnifyingglass': 'magnify',
  'plus': 'plus',
  'minus': 'minus',
  'checkmark': 'check',
  'exclamationmark': 'exclamation',
  'info': 'information',
  'trash': 'trash-can',
  'gear': 'cog',
  'bell': 'bell',
  'bell.fill': 'bell',
  'bookmark': 'bookmark',
  'bookmark.fill': 'bookmark',
  'pencil': 'pencil',
  'folder': 'folder',
  'folder.fill': 'folder',
  'paperclip': 'paperclip',
  'link': 'link',
  'doc': 'file-document',
  'doc.fill': 'file-document',
  'photo': 'image',
  'photo.fill': 'image',
  'video': 'video',
  'video.fill': 'video',
  'music.note': 'music',
  'mic': 'microphone',
  'mic.fill': 'microphone',
  'location': 'map-marker',
  'location.fill': 'map-marker',
  'tag': 'tag',
  'tag.fill': 'tag',
  'cart': 'cart',
  'cart.fill': 'cart',
  'gift': 'gift',
  'gift.fill': 'gift',
} as const;

type IconName = keyof typeof MAPPING;

interface IconSymbolProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color = '#000',
  style,
}: IconSymbolProps) {
  return (
    <MaterialCommunityIcons
      name={MAPPING[name]}
      size={size}
      color={color}
      style={style}
    />
  );
}
