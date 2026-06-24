import { Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { ColorTokens } from "@/constants/colors";

type Props = { text: string; style?: object };

/**
 * Lightweight markdown renderer for MedVoice answers — enough to give the
 * ChatGPT/Claude look (headings, bullet/numbered lists, bold, italic, inline
 * code) without pulling in a heavy markdown library. The analysis model only
 * emits simple markdown, so we keep the parser small and predictable.
 */
export function AskMarkdown({ text, style }: Props) {
  const colors = useTheme();
  const styles = makeStyles(colors);
  const blocks = parseBlocks(text);

  return (
    <View style={style}>
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <Text key={i} style={[styles.heading, headingSize(block.level, styles)]}>
              {renderInline(block.text, styles)}
            </Text>
          );
        }
        if (block.type === "list") {
          return (
            <View key={i} style={styles.list}>
              {block.items.map((item, j) => (
                <View key={j} style={styles.listRow}>
                  <Text style={styles.bullet}>{block.ordered ? `${j + 1}.` : "•"}</Text>
                  <Text style={styles.listText}>{renderInline(item, styles)}</Text>
                </View>
              ))}
            </View>
          );
        }
        return (
          <Text key={i} style={styles.paragraph}>
            {renderInline(block.text, styles)}
          </Text>
        );
      })}
    </View>
  );
}

// ── Block parsing ──────────────────────────────────────────────────────────

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: number; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

function parseBlocks(raw: string): Block[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    const ordered = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || ordered) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      const itemText = (bullet ?? ordered)![1];
      const last = blocks[blocks.length - 1];
      if (last && last.type === "list" && last.ordered === isOrdered) {
        last.items.push(itemText);
      } else {
        blocks.push({ type: "list", ordered: isOrdered, items: [itemText] });
      }
      continue;
    }

    paragraph.push(trimmed);
  }
  flushParagraph();
  return blocks;
}

// ── Inline parsing (**bold**, *italic* / _italic_, `code`) ───────────────────

function renderInline(text: string, styles: ReturnType<typeof makeStyles>) {
  // Split on the inline tokens, keeping the delimiters so we can style them.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g);
  return parts.filter(Boolean).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={i} style={styles.bold}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <Text key={i} style={styles.code}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    if (
      (part.startsWith("*") && part.endsWith("*")) ||
      (part.startsWith("_") && part.endsWith("_"))
    ) {
      return (
        <Text key={i} style={styles.italic}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/**
 * Strip markdown markers so read-aloud doesn't speak asterisks or hashes.
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .trim();
}

function headingSize(level: number, styles: ReturnType<typeof makeStyles>) {
  if (level === 1) return styles.h1;
  if (level === 2) return styles.h2;
  return styles.h3;
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    paragraph: {
      fontFamily: "Georgia",
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 24,
      marginBottom: 10,
    },
    heading: { fontFamily: "Georgia", color: colors.textPrimary, marginBottom: 8, marginTop: 2 },
    h1: { fontSize: 20, fontWeight: "700", lineHeight: 26 },
    h2: { fontSize: 18, fontWeight: "700", lineHeight: 24 },
    h3: { fontSize: 16, fontWeight: "600", lineHeight: 22 },
    list: { marginBottom: 10, gap: 6 },
    listRow: { flexDirection: "row", gap: 8 },
    bullet: {
      fontFamily: "Georgia",
      fontSize: 15,
      color: colors.accentBlue,
      lineHeight: 24,
      minWidth: 16,
    },
    listText: { flex: 1, fontFamily: "Georgia", fontSize: 15, color: colors.textPrimary, lineHeight: 24 },
    bold: { fontWeight: "700", color: colors.textPrimary },
    italic: { fontStyle: "italic" },
    code: {
      fontFamily: "monospace",
      fontSize: 13,
      color: colors.accentBlue,
      backgroundColor: colors.bgDeep,
    },
  });
}
