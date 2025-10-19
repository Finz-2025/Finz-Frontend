import { StyleSheet, Text, View } from 'react-native';
import { moderateVerticalScale } from '../../../theme/scale';
import { colors } from '../../../theme/colors';
import { FONT_FAMILY, FONT_WEIGHT } from '../../../theme/typography';

type TitleProps = {
  text: string;
  spacingBottom?: number;
};

export default function Title({ text, spacingBottom = 39 }: TitleProps) {
  const containerStyle = {
    marginBottom: moderateVerticalScale(spacingBottom),
  };

  return (
    <View style={containerStyle}>
      <Text style={styles.title}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHT.extraLight,
    fontSize: 35,
    color: colors.black,
    textAlign: 'left',
  },
});
