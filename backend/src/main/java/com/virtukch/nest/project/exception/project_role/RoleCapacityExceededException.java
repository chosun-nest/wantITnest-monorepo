package com.virtukch.nest.project.exception.project_role;

import lombok.Getter;

/**
 * 프로젝트 역할의 모집 인원을 초과했을 때 발생하는 예외
 */

@Getter
public class RoleCapacityExceededException extends RuntimeException {
  public RoleCapacityExceededException(Long roleId, String roleName,
                                       Integer requiredCount, Integer currentCount,
                                       Integer attemptedCount) {
    super(String.format(
            "역할 '%s'의 모집 인원을 초과했습니다. (모집인원: %d명, 현재인원: %d명, 추가시도: %d명)",
            roleName, requiredCount, currentCount, attemptedCount
    ));
  }

  public RoleCapacityExceededException(Long roleId, String roleName,
                                       Integer requiredCount, Integer currentCount) {
    this(roleId, roleName, requiredCount, currentCount, currentCount + 1);
  }
}