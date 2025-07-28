package com.virtukch.nest.project.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 프로젝트 도메인의 모든 에러 코드를 정의하는 Enum
 */
@Getter
public enum ProjectErrorCode {
    
    // ========== 프로젝트 관련 ==========
    PROJECT_NOT_FOUND("PROJECT_NOT_FOUND", "프로젝트를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    NO_PROJECT_AUTHORITY("NO_PROJECT_AUTHORITY", "프로젝트에 대한 권한이 없습니다.", HttpStatus.FORBIDDEN),
    INVALID_PROJECT_TITLE("INVALID_PROJECT_TITLE", "유효하지 않은 프로젝트 제목입니다.", HttpStatus.BAD_REQUEST),
    CANNOT_DELETE_PROJECT("CANNOT_DELETE_PROJECT", "프로젝트를 삭제할 수 없습니다.", HttpStatus.BAD_REQUEST),
    CANNOT_REMOVE_CREATOR("CANNOT_REMOVE_CREATOR", "프로젝트 작성자는 제거할 수 없습니다.", HttpStatus.BAD_REQUEST),
    PROJECT_MEMBER_NOT_FOUND("PROJECT_MEMBER_NOT_FOUND", "프로젝트 멤버를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    INVALID_STATUS_TRANSITION("INVALID_STATUS_TRANSITION", "유효하지 않은 상태 전환입니다.", HttpStatus.BAD_REQUEST),
    INVALID_TOTAL_MEMBER_COUNT("INVALID_TOTAL_MEMBER_COUNT", "유효하지 않은 총 멤버 수입니다.", HttpStatus.BAD_REQUEST),
    
    // ========== 프로젝트 지원 관련 ==========
    APPLICATION_NOT_FOUND("APPLICATION_NOT_FOUND", "지원서를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    APPLICATION_NOT_EDITABLE("APPLICATION_NOT_EDITABLE", "대기 중인 지원서만 수정할 수 있습니다.", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_APPLICATION_ACCESS("UNAUTHORIZED_APPLICATION_ACCESS", "본인의 지원서만 수정할 수 있습니다.", HttpStatus.FORBIDDEN),
    ALREADY_PROCESSED_APPLICATION("ALREADY_PROCESSED_APPLICATION", "이미 처리된 지원서입니다.", HttpStatus.BAD_REQUEST),
    DUPLICATE_APPLICATION("DUPLICATE_APPLICATION", "이미 지원한 프로젝트입니다.", HttpStatus.BAD_REQUEST),
    PROJECT_OWNER_CANNOT_APPLY("PROJECT_OWNER_CANNOT_APPLY", "프로젝트 작성자는 지원할 수 없습니다.", HttpStatus.BAD_REQUEST),
    PROJECT_OWNER_ONLY_ACCESS("PROJECT_OWNER_ONLY_ACCESS", "프로젝트 작성자만 접근할 수 있습니다.", HttpStatus.FORBIDDEN),
    PROJECT_CAPACITY_EXCEEDED("PROJECT_CAPACITY_EXCEEDED", "프로젝트 전체 모집 정원이 가득 찼습니다.", HttpStatus.BAD_REQUEST),
    PROJECT_RECRUITMENT_CLOSED("PROJECT_RECRUITMENT_CLOSED", "모집이 마감된 프로젝트입니다.", HttpStatus.BAD_REQUEST),
    
    // ========== 프로젝트 역할 관련 ==========
    PROJECT_ROLE_NOT_FOUND("PROJECT_ROLE_NOT_FOUND", "프로젝트 역할을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    ROLE_CAPACITY_EXCEEDED("ROLE_CAPACITY_EXCEEDED", "역할 모집 정원을 초과했습니다.", HttpStatus.BAD_REQUEST);
    
    private final String code;
    private final String message;
    private final HttpStatus status;
    
    ProjectErrorCode(String code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}