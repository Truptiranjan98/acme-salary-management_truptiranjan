package com.acme.compensation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    private String id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String department;
    private String role;
    private String level; // L1 - L7
    private String country;
    private String countryName;
    private String city;
    private String currency;
    private double fxRateToUSD;
    private double baseSalary;
    private double baseSalaryUSD;
    private double bonusPercentage;
    private double totalCompUSD;
    private double minBandUSD;
    private double maxBandUSD;
    private double targetMidpointUSD;
    private double compaRatio;
    private String bandStatus; // "IN_BAND", "BELOW_BAND", "ABOVE_BAND"
    private int performanceRating; // 1 - 5
    private double tenureYears;
    private String gender;
    private String hireDate;
    private LocalDateTime updatedAt;
}
