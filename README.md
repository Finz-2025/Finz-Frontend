<div align="center">

<img width="140" alt="app icon" src="https://github.com/user-attachments/assets/e61b8089-9a19-4f99-b322-730c0f2b7e3b" />

# **FiNZ – 절약을 습관으로 만드는 AI 코치 기반 가계부**  

</div>

---

## 📑 목차 (Table of Contents)

- [📱 프로젝트 개요](#프로젝트-개요)
- [✨ 주요 기능 요약](#주요-기능-요약)
- [🛠 기술 스택-tech-stack](#기술-스택-tech-stack)
- [📂 프로젝트 폴더 구조-요약](#프로젝트-폴더-구조-요약)
- [🧩 상세 기능 설명](#상세-기능-설명)
  - [1️⃣ 온보딩(Onboarding)](#1️⃣-온보딩onboarding--기본-정보-입력--개인화-준비)
  - [2️⃣ 홈(Home)](#2️⃣-홈home--월간-소비-요약-대시보드)
  - [3️⃣ 캘린더(Calendar)](#3️⃣-캘린더calendar--일별-소비-흐름-시각화)
  - [4️⃣ 지출/수입 입력(Entry Sheet)](#4️⃣-지출수입-입력entry-sheet--바텀-시트-기반-ui)
  - [5️⃣ AI 코치(Chat)](#5️⃣-ai-코치chat--gemini-기반-개인화-피드백-제공)
  - [6️⃣ 목표 설정(Goals)](#6️⃣-목표-설정goals--소비-습관-개선을-위한-사용자-목표-관리)
- [🏆 프로젝트 성과-achievements](#프로젝트-성과-achievements)
- [🚀 개발 기여도-my-contributions--frontend](#개발-기여도-my-contributions--frontend)
- [📚 배운 점--회고-learnings](#배운-점--회고-learnings)

---

## 📱 프로젝트 개요

FiNZ는 사용자의 소비 패턴을 바탕으로 **맞춤형 소비 피드백**을 제공하여  
**절약의 습관화를 돕는 AI 챗봇 융합형 가계부 애플리케이션**입니다.

사용자가 입력한  
- **기본 정보(연령대 / 직업)**  
- **월별 / 일별 예산 정보**  
- **최근 3개월 간의 가계부 데이터**

위 데이터를 기반으로 **Gemini API 기반 AI 코치가 개인 맞춤형 절약 전략을 제공**합니다.

실제 ‘거지방’ 문화의 장점인 **피드백·소통·동기부여 요소를 AI 코치와 결합해**,  
2030 세대에게 지속적인 절약 루틴을 만들어주는 것을 목표로 합니다.

---

## ✨ 주요 기능 요약

### 1. 온보딩(Onboarding)
- 닉네임, 연령대, 직업 입력  
- 월 예산 설정  
- 개인화된 AI 피드백을 위한 기초 정보 수집

### 2. 홈(Home) 화면 요약
- 월별 총 지출 · 남은 예산 · 진행률 시각화  
- 이번 주/오늘의 소비 상태(지켰어요·초과했어요·노스펜드) 뱃지 제공  
- 빠른 입력 버튼으로 지출/수입 등록

### 3. 캘린더(Calendar) 기반 지출 관리
- 월간 예산 대비 일별 지출 상태를 색상으로 직관적 표시  
- 날짜 클릭 시 해당 일자 지출 내역 상세 조회

### 4. AI 코치(Chat)
- Gemini API 기반 AI 코치와 실시간 대화  
- 지출 입력 시 **자동으로 AI 코치에 전송**, 맞춤형 피드백 제공  
- 빠른 액션(Quick Actions)을 통한 추천 목표 설정 및 소비 상담 기능

### 5. 상태 관리 & UX 최적화
- Zustand 기반 온보딩 상태 및 채팅 상태 효율적 관리  
- AI 응답 지연 시 자연스러운 UX를 위한 동적 로딩 처리

---

## 🛠 기술 스택 (Tech Stack)

### **Frontend**
- **React Native (0.82)** – iOS/Android 크로스 플랫폼 개발
- **TypeScript** – 타입 안정성 확보 및 예측 가능한 코드 유지
- **Zustand** – 전역 상태 관리 (온보딩, 지출/수입, 캘린더, 코치 데이터)
- **React Navigation (native-stack)** – 화면 전환 및 탐색 구조

### **Networking & API**
- **axios** – 공통 인스턴스 + 인터셉터 기반 API 통신
- **Gemini API** – AI 코치 피드백 생성

### **UI & Utility**
- **React Native Calendars** – 달력 기반 지출/예산 관리
- **React Native View Shot** – 화면 캡처 및 공유 기능
- **react-native-size-matters** – 반응형 UI 스케일링
- **react-native-svg / vector-icons** – 일러스트 및 아이콘 렌더링

### **협업 & 관리 도구**
- **Figma** – UI/UX 설계 및 프로토타입 제작  
- **Notion** – 기능 정의서, 회의록, API 문서 협업  
- **Discord** – 개발 커뮤니케이션 및 실시간 논의  

---

## 📂 프로젝트 폴더 구조 (요약)

> 실제 디렉토리를 간소화한 형태로, 핵심 구조 중심으로 정리했습니다.

```bash
src/
├── app/                 # 앱 엔트리 & 네비게이션
│   ├── App.tsx
│   └── navigation/      # Root / Main / Onboarding Navigator
│
├── features/            # 주요 기능 모듈
│   ├── home/            # 홈 요약 · 캘린더 · 지출 입력
│   ├── coach/           # AI 코치 채팅 기능
│   ├── onboarding/      # 온보딩(닉네임/연령/직업/예산)
│   ├── commons/         # 공용 UI 컴포넌트(탭바·모달 등)
│   └── goals/           # 목표 설정 화면
│
├── state/ (내장 포함)   # 각 기능별 Zustand 스토어
│
├── lib/                 # 공통 API 클라이언트
├── services/            # 프로필 · 스토리지 유틸
└── theme/               # 색상 · 폰트 · 반응형 스케일
```

---

## 🧩 상세 기능 설명

---

### 1️⃣ 온보딩(Onboarding) – 기본 정보 입력 & 개인화 준비

FiNZ의 개인화된 피드백은 온보딩에서 입력한 정보(닉네임·연령대·직업·예산)를 기반으로 생성됩니다.  
단계별 화면 이동 흐름과, 유효성 검증을 위한 validators 설계를 포함합니다.

<table>
<tr>
<td align="center">온보딩 화면 (닉네임)</td>
<td align="center">온보딩 화면 (예산 입력)</td>
</tr>
<tr>
<td><img width="200" alt="온보딩 화면 (닉네임)" src="https://github.com/user-attachments/assets/b92418ab-2f21-44a7-9736-0cbe2f93b9bc" />
</td>
<td><img width="200" alt="온보딩 화면 (예산 입력)" src="https://github.com/user-attachments/assets/7595baa1-e428-44b8-83c4-6844e4eacdd4" />
</td>
</tr>
</table>

---

### 2️⃣ 홈(Home) – 월간 소비 요약 대시보드

월별 지출 요약, 남은 예산, 진행률을 한 화면에서 확인할 수 있는 핵심 메인 페이지입니다.  
지출 입력·일별 상세로 빠르게 이동할 수 있도록 플로우를 설계했습니다.

<table>
<tr>
<td align="center">홈 화면</td>
</tr>
<tr>
<td><img width="200" alt="홈 화면" src="https://github.com/user-attachments/assets/97049326-d381-46c8-8529-1e2424d1049b" />
</td>
</tr>
</table>

---

### 3️⃣ 캘린더(Calendar) – 일별 소비 흐름 시각화

React Native Calendars 기반으로  
**예산 대비 일별 지출 상태(정상·주의·초과)를 색상 또는 표시로 직관적 표현**합니다.  
날짜를 누르면 해당 일자 지출 상세 내역으로 이동합니다.

<table>
<tr>
<td align="center">홈 화면 - 날짜 선택</td>
</tr>
<tr>
<td><img width="200" alt="홈 화면 - 날짜 선택" src="https://github.com/user-attachments/assets/15aefa79-9c5e-4e68-b4dc-52c1acbaab31" />
</td>
</tr>
</table>

---

### 4️⃣ 지출/수입 입력(Entry Sheet) – 바텀 시트 기반 UI

지출/수입 입력은 사용 빈도가 높아,  
**바텀 시트 형태로 빠르고 직관적으로 입력할 수 있도록 설계**했습니다.

- 카테고리 선택  
- 금액 입력  
- 결제 수단  
- 메모  
- 수정 / 삭제  
- 입력 후 홈 및 코치 탭 자동 갱신

<table>
<tr>
<td align="center">지출 입력 시트</td>
<td align="center">수입 입력 시트</td>
</tr>
<tr>
<td><img width="200" alt="지출 입력 시트" src="https://github.com/user-attachments/assets/0249a76a-1fb0-4b91-8206-27867eedf009" />
</td>
<td><img width="200" alt="수입 입력 시트" src="https://github.com/user-attachments/assets/528379e1-f2de-4a56-b7cb-d21e0ae5add5" />
</td>
</tr>
</table>

---

### 5️⃣ AI 코치(Chat) – Gemini 기반 개인화 피드백 제공

지출을 입력하면 **AI 코치에게 자동으로 전송 → 즉시 피드백 생성**되는 구조입니다.  
또한 사용자가 직접 채팅으로 질문할 수 있으며, 빠른 액션으로  
“목표 추천”, “지출 상담”, “이번 주 소비 요약”을 즉시 호출할 수 있습니다.

UX 측면에서는 Gemini의 응답 지연을 고려해  
**typing indicator / 로딩 메시지 / 페이드 애니메이션을 추가**하여 자연스럽게 구성했습니다.

<table>
<tr>
<td align="center">채팅 화면</td>
</tr>
<tr>
<td><img width="200" alt="채팅 화면" src="https://github.com/user-attachments/assets/6a066b06-7ca4-4542-b29b-5d8c49cf78df" />
</td>
</tr>
</table>

---

### 6️⃣ 목표 설정(Goals) – 소비 습관 개선을 위한 사용자 목표 관리

사용자가 원하는 절약 목표를 설정하고  
코치 피드백과 연계하여 지속적으로 추적할 수 있는 기능입니다.

<table>
<tr>
<td align="center">목표 설정 화면</td>
</tr>
<tr>
<td><img width="200" alt="목표 설정 화면" src="https://github.com/user-attachments/assets/bf48d4ff-24ee-4e6f-9a59-945a16123e50" />
</td>
</tr>
</table>

---

## 🏆 프로젝트 성과 (Achievements)

### 🎖 대회 성과
- **창업경진대회 우수상 수상**

---

## 🚀 개발 기여도 (My Contributions – Frontend)

### ✔ 전체 앱 구조 설계
- React Native 기반 전체 구조 설계(앱 네비게이션, 상태 구조, 공용 컴포넌트)
- 파일 구조 및 네비게이션 구조(Main / Root / Onboarding Navigator) 구축

### ✔ 온보딩(닉네임–연령–직업–예산) 플로우 개발
- 단계별 입력 화면 구축 및 유효성 검증 로직 구현
- Zustand 기반 온보딩 상태(global state) 설계

### ✔ 홈 & 소비 요약 화면 개발
- 월별/주별 요약 카드 구현  
- 이번달 지출/남은예산/진행률 계산 로직 작성  
- DailyDetailList, EntrySheet 등 핵심 UI 개발

### ✔ 캘린더 뷰 개발
- React Native Calendars 기반  
- **일별 예산 대비 소비 상태**를 시각적으로 표시하는 커스텀 DayCell 구현

### ✔ AI 코치 챗봇 UI 구현
- ChatList, ChatBubble, QuickActionsBar 등 챗봇 컴포넌트 개발
- AI 응답 지연 대비 UX(로딩 인디케이터, 딜레이 최소화 UX) 설계

### ✔ 지출/수입 입력 시트 개발
- 바텀 시트 UI 제작
- 입력–기록–홈·코치 연동 데이터 흐름 구성

---

## 📚 배운 점 & 회고 (Learnings)

### 🧠 1. AI 기반 기능에서 UX의 중요성
Gemini API처럼 응답 지연이 발생하는 시스템에서는  
일반적인 UI보다 **사용자 기대를 관리하는 UX 설계가 훨씬 중요**하다는 점을 체감함.

### 🚀 4. 절약 행동을 돕는 서비스 UX에 대한 실무적 이해
거지방 문화의 장점을 기능적으로 분석하고,  
이를 AI 챗봇 기능과 결합하며  
**‘절약을 지속시키는 핵심 동기 구조’**에 대해 배울 수 있었음.

