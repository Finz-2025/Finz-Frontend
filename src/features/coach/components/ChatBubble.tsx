import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const coachIcon = require('~assets/images/coach_icon.png');

export default function ChatBubble({
  text,
  time,
  sender,
  highlightedParts = [],
}: {
  text: string;
  time: string;
  sender: 'user' | 'coach';
  highlightedParts?: Array<{ start: number; end: number }>;
}) {
  const isUser = sender === 'user';
  const chunks: Array<{ t: string; hi: boolean }> = [];
  if (!highlightedParts.length) {
    chunks.push({ t: text, hi: false });
  } else {
    let i = 0;
    highlightedParts.forEach(r => {
      if (i < r.start) chunks.push({ t: text.slice(i, r.start), hi: false });
      chunks.push({ t: text.slice(r.start, r.end), hi: true });
      i = r.end;
    });
    if (i < text.length) chunks.push({ t: text.slice(i), hi: false });
  }

  return (
    <View style={[s.row, isUser ? s.right : s.left]}>
      {!isUser && <Image source={coachIcon} style={s.icon} />}
      <View style={s.bubble}>
        <Text style={s.text}>
          {chunks.map((c, idx) => (
            <Text key={idx} style={c.hi ? s.highlight : undefined}>
              {c.t}
            </Text>
          ))}
        </Text>
        <Text style={[s.time, isUser && s.userTime]}>{time}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: moderateVerticalScale(12),
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  },
  icon: {
    width: moderateScale(35),
    height: moderateVerticalScale(35),
    marginRight: moderateScale(8),
  },
  bubble: {
    maxWidth: '78%',
    padding: moderateScale(10),
    borderRadius: moderateScale(15),
    boxShadow: `0 ${moderateScale(4)}px ${moderateScale(4)}px 0 ${
      colors.primary
    }`,
    backgroundColor: colors.white,
    marginBottom: moderateVerticalScale(2),
  },
  text: {
    color: colors.darkText,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.medium,
  },
  highlight: {
    color: colors.primary,
  },
  time: {
    marginTop: moderateVerticalScale(5),
    fontSize: moderateScale(10),
    color: colors.grayShadow,
  },
  userTime: {
    alignSelf: 'flex-end',
  },
});
