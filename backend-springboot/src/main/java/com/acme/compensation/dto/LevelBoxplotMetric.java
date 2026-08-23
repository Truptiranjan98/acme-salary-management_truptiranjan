package com.acme.compensation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LevelBoxplotMetric {
    private String level;
    private int count;
    private double minUSD;
    private double q1USD;
    private double medianUSD;
    private double q3USD;
    private double maxUSD;
    private double bandMinUSD;
    private double bandMidUSD;
    private double bandMaxUSD;
    private double avgCompaRatio;
    private int belowBandCount;
    private int aboveBandCount;
    private int inBandCount;
}
