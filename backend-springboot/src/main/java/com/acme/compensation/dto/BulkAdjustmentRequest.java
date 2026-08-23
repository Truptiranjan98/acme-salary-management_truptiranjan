package com.acme.compensation.dto;

import lombok.Data;
import java.util.List;

@Data
public class BulkAdjustmentRequest {
    private List<String> employeeIds;
    private double percentageIncrease;
    private String reason;
    private String notes;
    private String actor = "Truptiranjan Biswal (HR Lead)";
}
