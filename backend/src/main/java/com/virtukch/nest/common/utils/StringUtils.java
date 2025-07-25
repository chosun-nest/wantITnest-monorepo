package com.virtukch.nest.common.utils;

public class StringUtils {

    private StringUtils() {
        throw new IllegalStateException("유틸리티 클래스는 인스턴스화할 수 없습니다.");
    }

    /**
     * 마크다운 문법을 제거하여 일반 텍스트로 변환
     * @param markdownText 마크다운 형식의 텍스트
     * @return 마크다운 문법이 제거된 일반 텍스트
     */
    public static String removeMarkdownSyntax(String markdownText) {
        if (markdownText == null || markdownText.trim().isEmpty()) {
            return "";
        }

        String text = markdownText;

        // 코드 블록 제거 (먼저 처리해야 다른 문법과 충돌 방지)
        text = text.replaceAll("```[\\s\\S]*?```", " ");

        // 인라인 코드 제거
        text = text.replaceAll("`([^`]+)`", "$1");

        // 이미지 제거 (링크보다 먼저 처리)
        text = text.replaceAll("!\\[([^\\]]*)\\]\\([^)]+\\)", "$1");

        // 링크를 텍스트만 남기고 제거
        text = text.replaceAll("\\[([^\\]]+)\\]\\([^)]+\\)", "$1");

        // 볼드/이탤릭 강조 제거
        text = text.replaceAll("\\*\\*([^*]+)\\*\\*", "$1"); // **볼드**
        text = text.replaceAll("\\*([^*]+)\\*", "$1");       // *이탤릭*
        text = text.replaceAll("__([^_]+)__", "$1");         // __볼드__
        text = text.replaceAll("_([^_]+)_", "$1");           // _이탤릭_

        // 헤더 제거
        text = text.replaceAll("^#{1,6}\\s*", "");

        // 인용문 제거
        text = text.replaceAll("^>\\s*", "");

        // 리스트 마커 제거
        text = text.replaceAll("^\\s*[-*+]\\s*", "");        // 순서 없는 리스트
        text = text.replaceAll("^\\s*\\d+\\.\\s*", "");      // 순서 있는 리스트

        // 수평선 제거
        text = text.replaceAll("^\\s*[-*_]{3,}\\s*$", "");

        // 여러 줄바꿈을 하나의 공백으로 변환
        text = text.replaceAll("\\s+", " ");

        // 앞뒤 공백 제거
        return text.trim();
    }

    /**
     * 텍스트 미리보기 생성 (마크다운 제거 + 길이 제한)
     */
    public static String generateTextPreview(String text, int maxLength) {
        String cleanText = removeMarkdownSyntax(text);
        return cleanText.length() <= maxLength ? cleanText : cleanText.substring(0, maxLength) + "...";
    }
}
