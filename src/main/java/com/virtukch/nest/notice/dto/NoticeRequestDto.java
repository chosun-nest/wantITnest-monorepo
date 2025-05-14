package com.virtukch.nest.notice.dto;

import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class NoticeRequestDto {
    private List<Map<String, Object>> notices;
}
