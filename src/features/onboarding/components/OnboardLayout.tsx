import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfirmButton from '@/features/onboarding/components/ConfirmButton';
import DotProgress from '@/features/onboarding/components/DotProgress';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import Title from '@/features/onboarding/components/Title';

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
      style={S.background}
    >
      <SafeAreaView style={S.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={S.flex}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView
            style={S.flex}
            contentContainerStyle={S.content}
            keyboardShouldPersistTaps="handled"
          >
            {/* 뒤로가기 버튼 */}
            {p.onBack && (
              <TouchableOpacity
                onPress={p.onBack}
                style={S.backBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Image
                  source={backBtn}
                  style={S.backIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {/* 상단 타이틀 */}
            <View style={S.header}>
              <Title text={p.title} />
            </View>

            {/* 본문 */}
            <View style={S.body}>{p.children}</View>

            {/* 하단 영역: 버튼 + 점프로그레스 */}
            <View style={S.footer}>
              <ConfirmButton
                disabled={p.confirmDisabled}
                onPress={p.onConfirm}
                label="확인"
              />
              <DotProgress activeIndex={p.progressIndex} total={4} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const S = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
  },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(42),
    paddingTop: moderateVerticalScale(24),
    paddingBottom: moderateVerticalScale(24),
  },
  header: {
    marginTop: moderateVerticalScale(120),
  },
  body: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footer: {
    gap: moderateVerticalScale(12),
    paddingTop: moderateVerticalScale(8),
  },
  backBtn: {
    position: 'absolute',
    top: moderateVerticalScale(16),
    left: moderateScale(12),
    zIndex: 10,
    padding: 8,
  },
  backIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
  },
});
