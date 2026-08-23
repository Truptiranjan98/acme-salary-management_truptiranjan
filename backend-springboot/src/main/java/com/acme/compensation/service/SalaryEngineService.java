package com.acme.compensation.service;

import com.acme.compensation.dto.*;
import com.acme.compensation.model.AuditLog;
import com.acme.compensation.model.Employee;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class SalaryEngineService {

    private final Map<String, Employee> employeeMap = new ConcurrentHashMap<>();
    private final List<AuditLog> auditLogs = Collections.synchronizedList(new ArrayList<>());

    private static final Map<String, Double> FX_RATES = Map.of(
            "USD", 1.0, "EUR", 1.08, "GBP", 1.28, "INR", 0.012, "SGD", 0.74,
            "AUD", 0.65, "CAD", 0.74, "JPY", 0.0066, "BRL", 0.18, "PLN", 0.25
    );

    private static final Map<String, double[]> PAY_BANDS_USD = Map.of(
            "L1", new double[]{35000, 50000, 65000},
            "L2", new double[]{55000, 75000, 95000},
            "L3", new double[]{80000, 105000, 130000},
            "L4", new double[]{115000, 145000, 175000},
            "L5", new double[]{150000, 190000, 230000},
            "L6", new double[]{200000, 255000, 310000},
            "L7", new double[]{270000, 345000, 420000}
    );

    @PostConstruct
    public void init() {
        seed10000Employees();
    }

    private void seed10000Employees() {
        Random random = new Random(42);
        String[] departments = {"Engineering", "Product", "Sales", "Marketing", "People (HR)", "Finance", "Legal", "Operations"};
        String[] levels = {"L1", "L2", "L3", "L4", "L5", "L6", "L7"};
        String[] currencies = {"USD", "EUR", "GBP", "INR", "SGD", "AUD", "CAD", "JPY", "BRL", "PLN"};

        for (int i = 1; i <= 10000; i++) {
            String id = String.format("ACM-%05d", i);
            String level = levels[random.nextInt(levels.length)];
            String dept = departments[random.nextInt(departments.length)];
            String curr = currencies[random.nextInt(currencies.length)];
            double fx = FX_RATES.getOrDefault(curr, 1.0);

            double[] band = PAY_BANDS_USD.get(level);
            double minBandUSD = band[0];
            double midBandUSD = band[1];
            double maxBandUSD = band[2];

            // Generate realistic base salary
            double baseUSD = minBandUSD + (random.nextDouble() * (maxBandUSD - minBandUSD) * 0.9);
            double baseLocal = baseUSD / fx;
            double bonusPct = 5.0 + (random.nextInt(4) * 5.0);
            double totalCompUSD = baseUSD * (1.0 + (bonusPct / 100.0));
            double compaRatio = Math.round((baseUSD / midBandUSD) * 100.0) / 100.0;

            String status = compaRatio < 0.85 ? "BELOW_BAND" : (compaRatio > 1.15 ? "ABOVE_BAND" : "IN_BAND");

            Employee emp = Employee.builder()
                    .id(id)
                    .firstName("Employee" + i)
                    .lastName("Talent")
                    .fullName("Employee " + i)
                    .email("employee." + i + "@acmeww.com")
                    .department(dept)
                    .role(dept + " Specialist")
                    .level(level)
                    .country("US")
                    .countryName("United States")
                    .city("Global Office")
                    .currency(curr)
                    .fxRateToUSD(fx)
                    .baseSalary(Math.round(baseLocal))
                    .baseSalaryUSD(Math.round(baseUSD))
                    .bonusPercentage(bonusPct)
                    .totalCompUSD(Math.round(totalCompUSD))
                    .minBandUSD(minBandUSD)
                    .maxBandUSD(maxBandUSD)
                    .targetMidpointUSD(midBandUSD)
                    .compaRatio(compaRatio)
                    .bandStatus(status)
                    .performanceRating(random.nextInt(5) + 1)
                    .tenureYears(Math.round(random.nextDouble() * 10.0 * 10.0) / 10.0)
                    .gender(random.nextBoolean() ? "Female" : "Male")
                    .updatedAt(LocalDateTime.now())
                    .build();

            employeeMap.put(id, emp);
        }
    }

    public List<Employee> getAllEmployees() {
        return new ArrayList<>(employeeMap.values());
    }

    public Employee getEmployeeById(String id) {
        return employeeMap.get(id);
    }

    public synchronized Employee adjustSalary(String id, SalaryAdjustmentRequest req) {
        Employee emp = employeeMap.get(id);
        if (emp == null) throw new NoSuchElementException("Employee not found");

        double prevSalaryLocal = emp.getBaseSalary();
        double prevSalaryUSD = emp.getBaseSalaryUSD();
        double newSalaryLocal = req.getNewSalaryLocal();
        double newSalaryUSD = newSalaryLocal * emp.getFxRateToUSD();
        double deltaUSD = newSalaryUSD - prevSalaryUSD;
        double pctChange = ((newSalaryLocal - prevSalaryLocal) / prevSalaryLocal) * 100.0;

        emp.setBaseSalary(newSalaryLocal);
        emp.setBaseSalaryUSD(newSalaryUSD);
        emp.setTotalCompUSD(newSalaryUSD * (1.0 + (emp.getBonusPercentage() / 100.0)));
        emp.setCompaRatio(Math.round((newSalaryUSD / emp.getTargetMidpointUSD()) * 100.0) / 100.0);
        emp.setBandStatus(emp.getCompaRatio() < 0.85 ? "BELOW_BAND" : (emp.getCompaRatio() > 1.15 ? "ABOVE_BAND" : "IN_BAND"));
        emp.setUpdatedAt(LocalDateTime.now());

        AuditLog log = AuditLog.builder()
                .id("AUD-" + UUID.randomUUID().toString().substring(0, 8))
                .employeeId(emp.getId())
                .employeeName(emp.getFullName())
                .department(emp.getDepartment())
                .level(emp.getLevel())
                .previousSalaryLocal(prevSalaryLocal)
                .newSalaryLocal(newSalaryLocal)
                .previousSalaryUSD(prevSalaryUSD)
                .newSalaryUSD(newSalaryUSD)
                .deltaUSD(deltaUSD)
                .percentageChange(Math.round(pctChange * 10.0) / 10.0)
                .reason(req.getReason())
                .notes(req.getNotes())
                .approvedBy(req.getActor())
                .timestamp(LocalDateTime.now())
                .build();

        auditLogs.add(0, log);
        return emp;
    }

    public List<AuditLog> getAuditLogs() {
        return new ArrayList<>(auditLogs);
    }

    public List<DepartmentMetric> getDepartmentMetrics() {
        double totalGlobalSpend = employeeMap.values().stream().mapToDouble(Employee::getBaseSalaryUSD).sum();

        return employeeMap.values().stream()
                .collect(Collectors.groupingBy(Employee::getDepartment))
                .entrySet().stream()
                .map(e -> {
                    List<Employee> list = e.getValue();
                    double spend = list.stream().mapToDouble(Employee::getBaseSalaryUSD).sum();
                    double avg = spend / list.size();
                    double avgCompa = list.stream().mapToDouble(Employee::getCompaRatio).average().orElse(1.0);
                    return DepartmentMetric.builder()
                            .department(e.getKey())
                            .headcount(list.size())
                            .totalSpendUSD(Math.round(spend))
                            .averageSalaryUSD(Math.round(avg))
                            .averageCompaRatio(Math.round(avgCompa * 100.0) / 100.0)
                            .budgetPercentage(Math.round((spend / totalGlobalSpend) * 1000.0) / 10.0)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<LevelBoxplotMetric> getLevelBoxplots() {
        return PAY_BANDS_USD.keySet().stream().sorted().map(level -> {
            List<Employee> list = employeeMap.values().stream()
                    .filter(emp -> emp.getLevel().equals(level))
                    .collect(Collectors.toList());

            List<Double> sorted = list.stream().map(Employee::getBaseSalaryUSD).sorted().collect(Collectors.toList());
            if (sorted.isEmpty()) return null;

            double[] band = PAY_BANDS_USD.get(level);
            double min = sorted.get(0);
            double max = sorted.get(sorted.size() - 1);
            double q1 = sorted.get((int) (sorted.size() * 0.25));
            double median = sorted.get((int) (sorted.size() * 0.50));
            double q3 = sorted.get((int) (sorted.size() * 0.75));

            int below = (int) list.stream().filter(e -> "BELOW_BAND".equals(e.getBandStatus())).count();
            int above = (int) list.stream().filter(e -> "ABOVE_BAND".equals(e.getBandStatus())).count();

            return LevelBoxplotMetric.builder()
                    .level(level)
                    .count(list.size())
                    .minUSD(min)
                    .q1USD(q1)
                    .medianUSD(median)
                    .q3USD(q3)
                    .maxUSD(max)
                    .bandMinUSD(band[0])
                    .bandMidUSD(band[1])
                    .bandMaxUSD(band[2])
                    .belowBandCount(below)
                    .aboveBandCount(above)
                    .inBandCount(list.size() - below - above)
                    .build();
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }
}
