import { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { FONT_FAMILY, FONT_WEIGHT } from '../../../theme/typography';
import { moderateScale } from 'react-native-size-matters';

const mascot = require('~assets/images/onboardingsplash_mascot.png');

export default function WelcomeSplash({ navigation }: any) {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={s.container}>
      <View style={s.centerArea}>
        <Text style={s.welcomeText}>환영합니다! 🎉</Text>
      </View>
      <Image source={mascot} style={s.mascot} />
    </View>
  );
}

const { width } = Dimensions.get('window');

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcomeText: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHT.extraLight,
    fontSize: moderateScale(35),
    color: colors.black,
    textAlign: 'center',
  },
  mascot: {
    width,
    height: width * 0.58,
    alignSelf: 'flex-start',
  },
});
