import { useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { AskUserMessage } from "@/components/AskUserMessage";
import { AskAssistantMessage } from "@/components/AskAssistantMessage";
import { AskSuggestions } from "@/components/AskSuggestions";
import type { ChatMessage } from "@/hooks/useHealthQuery";

type Props = {
  messages: ChatMessage[];
  ttsEnabled: boolean;
  onPickSuggestion: (q: string) => void;
};

/**
 * The scrolling conversation. Renders the empty-state suggestions until the
 * first question, then alternating user bubbles and MedVoice answers. Keeps the
 * latest turn in view as the answer streams in.
 */
export function AskThread({ messages, ttsEnabled, onPickSuggestion }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  if (messages.length === 0) {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <AskSuggestions onPick={onPickSuggestion} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
    >
      {messages.map((m) =>
        m.role === "user" ? (
          <AskUserMessage key={m.id} text={m.text} />
        ) : (
          <AskAssistantMessage key={m.id} message={m} ttsEnabled={ttsEnabled} />
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
});
