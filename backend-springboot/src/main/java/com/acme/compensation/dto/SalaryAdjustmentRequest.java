package com.acme.compensation.dto;

import lombok.Data;

@Data
public class SalaryAdjustmentRequest {
    private double newSalaryLocal;
    private String reason;
    private String notes;
    private String actor = "Truptiranjan Biswal (HR Lead)";
}
