package com.virtukch.nest.project.exception;

public class ProjectNotFoundException extends RuntimeException {
    public ProjectNotFoundException(Long projectId) {
        super("프로젝트 게시글을 찾을 수 없습니다. ID: " + projectId);
    }
}
