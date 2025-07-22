package com.virtukch.nest.project.exception;

import com.virtukch.nest.project.model.ProjectParticipant;

public class ProjectMemberRemoveException extends  RuntimeException{
    public ProjectMemberRemoveException(ProjectParticipant.Part part, int filledCount, int targetCount) {
        super(part + " 파트에는 이미 " + filledCount + "명이 참여 중이라 " + targetCount + "명으로 축소할 수 없습니다.");
    }
}
