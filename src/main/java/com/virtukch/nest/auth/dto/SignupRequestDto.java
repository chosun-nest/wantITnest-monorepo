package com.virtukch.nest.auth.dto;

import java.util.List;
import lombok.Getter;

@Getter
public class SignupRequestDto {

    private String email;
    private String password;
    private String memberName;
    private Boolean memberIsStudent;
    private List<Long> departmentIdList;
    private List<Long> interestIdList;
    private List<Long> techStackIdList;
}
