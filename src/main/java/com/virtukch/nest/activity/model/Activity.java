package com.virtukch.nest.activity.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activity")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    @Id
    private Long activityId;
    private Long memberId;
    private String activityDate;
    private String activityContent;
    private String activityUrl;
}