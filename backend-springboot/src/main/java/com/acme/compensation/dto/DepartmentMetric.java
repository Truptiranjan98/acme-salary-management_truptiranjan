package com.acme.compensation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentMetric {
    private String department;
    private int headcount;
    private double totalSpendUSD;
    private double averageSalaryUSD;
    private double medianSalaryUSD;
    private double averageCompaRatio;
    private double budgetPercentage;
}
