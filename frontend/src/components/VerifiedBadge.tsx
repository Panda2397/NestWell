import React, { useState } from 'react';
import { View, Pressable, Image, Text, StyleSheet } from 'react-native';

type Props = {
  human_checked?: boolean;
  ai_checked?: boolean;
  label?: string;
  size?: number;
};

export default function VerifiedBadge({ human_checked, ai_checked, label, size = 20 }: Props) {
  const [show, setShow] = useState(false);
  const verified = human_checked || ai_checked;
  if (!verified) return null;

  return (
    <View style={localStyles.wrap}>
      <Pressable
        onPressIn={() => setShow(true)}
        onPressOut={() => setShow(false)}
        onHoverIn={() => setShow(true)}
        onHoverOut={() => setShow(false)}
        accessibilityLabel={label || (human_checked ? 'Verified (Human)' : 'Verified (AI)')}
      >
        <Image
          source={require('../../assets/verfied_badge.png')}
          style={[localStyles.img, { width: size, height: size }]}
        />
      </Pressable>

      {show && (
        <View style={localStyles.tooltip}>
          <Text style={localStyles.tooltipText}>{`Verified by ${human_checked ? 'doctor' : 'AI'}`}</Text>
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  wrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  img: { resizeMode: 'contain' as const },
  tooltip: {
    position: 'absolute',
    top: -36,
    right: -8,
    minWidth: 120,
    backgroundColor: '#566077',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    zIndex: 50,
  },
  tooltipText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
