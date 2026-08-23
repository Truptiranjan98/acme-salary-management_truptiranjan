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
public class AuditLog {
    private String id;
    private String employeeId;
    private String employeeName;
    private String department;
    private String level;
    private double previousSalaryLocal;
    private double newSalaryLocal;
    private double previousSalaryUSD;
    private double newSalaryUSD;
    private double deltaUSD;
    private double percentageChange;
    private String reason; // MERIT_INCREASE, PROMOTION, MARKET_CORRECTION, EQUITY_ADJUSTMENT, RETENTION, ANNUAL_REVIEW
    private String notes;
    private String approvedBy; // e.g. "Truptiranjan Biswal (HR Lead)"
    private LocalDateTime timestamp;
}
