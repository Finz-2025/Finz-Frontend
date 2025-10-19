import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { moderateScale, moderateVerticalScale } from '../../../theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '../../../theme/typography';
import { colors } from '../../../theme/colors';

type Props = TextInputProps & {
  helper?: string;
  isCurrencyInput?: boolean;
};

export default function RoundedTextInput({
  helper,
  isCurrencyInput = false,
  style,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={[
          styles.input,
          focused && styles.focused,
          isCurrencyInput && styles.currencyInput,
          style,
        ]}
        placeholderTextColor={colors.grayShadow}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    fontFamily: FONT_FAMILY,
    fontWeight: '400',
    fontSize: 20,
    color: colors.black,
    backgroundColor: colors.white,
    borderBottomWidth: moderateVerticalScale(3),
    borderBottomColor: colors.primary,
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
    paddingVertical: moderateVerticalScale(20),
    paddingHorizontal: moderateScale(20),
    textAlign: 'center',
  },
  currencyInput: {
    paddingRight: moderateScale(72),
  },
  focused: {
    borderBottomColor: colors.primaryShadow,
  },
  helper: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHT.light,
    fontSize: 15,
    color: colors.grayShadow,
    marginTop: moderateVerticalScale(15),
    textAlign: 'center',
  },
});
