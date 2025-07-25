package com.virtukch.nest.common.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {

    private static final DateTimeFormatter DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy.MM.dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
    private static final DateTimeFormatter SIMPLE_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter KOREAN_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");


    private DateUtils() {
        throw new IllegalStateException("유틸리티 클래스는 인스턴스화할 수 없습니다.");
    }

    /**
     * LocalDate를 "yyyy.MM.dd" 형식의 문자열로 변환
     * @param date 변환할 날짜
     * @return 포맷된 날짜 문자열 (예: "2025.07.24")
     * @throws IllegalArgumentException date가 null인 경우
     */
    public static String formatDate(LocalDate date) {
        validateNotNull(date, "날짜는 null일 수 없습니다.");
        return date.format(DEFAULT_DATE_FORMATTER);
    }

    /**
     * LocalDateTime을 "yyyy.MM.dd HH:mm" 형식의 문자열로 변환
     * @param dateTime 변환할 날짜시간
     * @return 포맷된 날짜시간 문자열 (예: "2025.07.24 14:30")
     * @throws IllegalArgumentException dateTime이 null인 경우
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        validateNotNull(dateTime, "날짜시간은 null일 수 없습니다.");
        return dateTime.format(DATETIME_FORMATTER);
    }

    /**
     * null 체크 유틸리티 메서드
     * @param obj 체크할 객체
     * @param message 예외 메시지
     * @throws IllegalArgumentException obj가 null인 경우
     */
    private static void validateNotNull(Object obj, String message) {
        if (obj == null) {
            throw new IllegalArgumentException(message);
        }
    }
}
