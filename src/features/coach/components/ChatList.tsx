import React, { useEffect, useRef } from 'react';
import { ChatItem, SearchHit } from '../model/types';
import { FlatList, View } from 'react-native';
import DateHeader from './DateHeader';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import ChatBubble from './ChatBubble';

export default function ChatList({
  items,
  hits,
  currentHit,
  onReadyIndexRef,
}: {
  items: ChatItem[];
  hits: SearchHit[];
  currentHit: number;
  onReadyIndexRef?: (ref: React.RefObject<FlatList<ChatItem> | null>) => void;
}) {
  const listRef = useRef<FlatList<ChatItem>>(null);

  useEffect(() => {
    onReadyIndexRef?.(listRef);
  }, [onReadyIndexRef]);

  // 현재 히트로 스크롤
  useEffect(() => {
    if (!hits.length) return;
    const target = hits[currentHit]?.itemIndex;
    if (typeof target === 'number')
      listRef.current?.scrollToIndex({
        index: target,
        animated: true,
        viewPosition: 0.3,
      });
  }, [hits, currentHit]);

  return (
    <FlatList
      ref={listRef}
      data={items}
      keyExtractor={it => it.id}
      renderItem={({ item }) => {
        if (item.type === 'date') return <DateHeader date={item.date} />;
        const hitRanges =
          hits.find(h => h.messageId === item.message.id)?.ranges ?? [];
        return (
          <View
            style={{
              paddingHorizontal: moderateScale(13),
            }}
          >
            <ChatBubble
              text={item.message.text}
              time={item.message.time}
              sender={item.message.sender}
              highlightedParts={hitRanges}
            />
          </View>
        );
      }}
      contentContainerStyle={{ paddingVertical: moderateVerticalScale(6) }}
      onScrollToIndexFailed={() => {}}
    />
  );
}
