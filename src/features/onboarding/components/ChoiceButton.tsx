import { Pressable, StyleSheet, Text, Image, View } from 'react-native';
import { moderateVerticalScale } from 'react-native-size-matters';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';

// 버튼 배경 이미지
import unselectedBtn from '~assets/icons/choiceBtn_bg.png';
import selectedBtn from '~assets/icons/activeBtn_bg.png';
import { colors } from '@/theme/colors';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: object;
};

export default function ChoiceButton({
  label,
  selected,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrapper, style]}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      {/* 버튼 배경 이미지 */}
      <Image
        source={selected ? selectedBtn : unselectedBtn}
        style={styles.image}
        resizeMode="contain"
      />

      {/* 텍스트 */}
      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.label,
            selected ? styles.labelSelected : styles.labelUnselected,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  image: {
    width: '95%',
    height: moderateVerticalScale(65),
  },
  textWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: 20,
  },
  labelUnselected: {
    color: colors.primary,
  },
  labelSelected: {
    color: colors.white,
  },
});
