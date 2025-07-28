package com.virtukch.nest.project.exception;

import com.virtukch.nest.common.dto.ApiResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.project")
public class ProjectExceptionHandler {

    /**
     * 프로젝트 도메인의 모든 예외를 처리하는 통합 핸들러
     */
    @ExceptionHandler(ProjectException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleProjectException(ProjectException ex) {
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponseDto.failure(ex.getErrorCodeValue(), ex.getMessage()));
    }
}