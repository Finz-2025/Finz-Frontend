import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfirmButton from '@/features/onboarding/components/ConfirmButton';
import DotProgress from '@/features/onboarding/components/DotProgress';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import Title from '@/features/onboarding/components/Title';
import { colors } from '@/theme/colors';

import backgroundImage from '~assets/images/onboarding_bg.png';
import backBtn from '~assets/icons/backBtn.png';

type Props = {
  title: string;
  children: React.ReactNode;
  confirmDisabled: boolean;
  onConfirm: () => void;
  progressIndex: 0 | 1 | 2 | 3;
  onBack?: () => void;
};

export default function OnboardLayout(p: Props) {
  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={s.background}
    >
      <View style={s.container}>
        {/* 뒤로가기 버튼 */}
        {p.onBack && (
          <TouchableOpacity
            onPress={p.onBack}
            style={s.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image source={backBtn} style={s.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}

        {/* Title */}
        <Title text={p.title} />
        {/* Body */}
        <View style={s.body}>{p.children}</View>
        {/* Confirm */}
        <ConfirmButton
          disabled={p.confirmDisabled}
          onPress={p.onConfirm}
          label="확인"
        />
        {/* Dots */}
        <DotProgress activeIndex={p.progressIndex} total={4} />
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(42),
    paddingTop: moderateVerticalScale(167),
    backgroundColor: colors.white + '00',
  },
  backBtn: {
    position: 'absolute',
    top: moderateVerticalScale(60),
    left: moderateScale(20),
    zIndex: 10,
    padding: 8,
  },
  backIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});
