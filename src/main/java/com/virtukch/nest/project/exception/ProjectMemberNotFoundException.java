package com.virtukch.nest.project.exception;

public class ProjectMemberNotFoundException extends RuntimeException {
    public ProjectMemberNotFoundException(Long projectId, Long memberId) {
        super("해당 멤버는 프로젝트에 참여하고 있지 않습니다. projectId=" + projectId + ", memberId=" + memberId);
    }
}