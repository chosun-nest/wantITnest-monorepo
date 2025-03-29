package com.virtukch.nest.tech_stack.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tech_stack")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TechStack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long techStackId;
    private Long memberId;
    private String techName;
}