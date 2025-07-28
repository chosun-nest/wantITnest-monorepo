package com.virtukch.nest.project.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 프로젝트 도메인의 통합 예외 클래스
 */
@Getter
public class ProjectException extends RuntimeException {
    
    private final ProjectErrorCode errorCode;
    
    public ProjectException(ProjectErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
    
    public ProjectException(ProjectErrorCode errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.errorCode = errorCode;
    }
    
    public HttpStatus getHttpStatus() {
        return errorCode.getStatus();
    }
    
    public String getErrorCodeValue() {
        return errorCode.getCode();
    }
}