import { describe, it, expect } from "vitest";
import { calculateCommission, calculateTaxWithholdings, calculateNetPay } from "./payroll";

describe("Payroll Calculations", () => {
  describe("calculateCommission", () => {
    it("should calculate commission correctly for a sale", () => {
      // $100,000 sale at 5% commission = $5,000
      const saleAmount = 10000000; // in cents ($100,000)
      const commissionRate = 500; // 5% (500 = 5%)
      const result = calculateCommission(saleAmount, commissionRate);
      expect(result).toBe(500000); // $5,000 in cents
    });

    it("should handle different commission rates", () => {
      const saleAmount = 5000000; // $50,000
      const commissionRate = 300; // 3%
      const result = calculateCommission(saleAmount, commissionRate);
      expect(result).toBe(150000); // $1,500
    });

    it("should return 0 for zero sale amount", () => {
      const result = calculateCommission(0, 500);
      expect(result).toBe(0);
    });

    it("should handle high commission rates", () => {
      const saleAmount = 10000000; // $100,000
      const commissionRate = 1000; // 10%
      const result = calculateCommission(saleAmount, commissionRate);
      expect(result).toBe(1000000); // $10,000
    });
  });

  describe("calculateTaxWithholdings", () => {
    it("should calculate federal tax correctly", async () => {
      const grossAmount = 100000; // $1,000
      const taxes = await calculateTaxWithholdings(grossAmount);
      
      // Default federal tax rate is 12%
      expect(taxes.federalTax).toBe(12000); // $120
    });

    it("should calculate social security correctly", async () => {
      const grossAmount = 100000; // $1,000
      const taxes = await calculateTaxWithholdings(grossAmount);
      
      // Default social security rate is 6.2%
      expect(taxes.socialSecurity).toBe(6200); // $62
    });

    it("should calculate medicare correctly", async () => {
      const grossAmount = 100000; // $1,000
      const taxes = await calculateTaxWithholdings(grossAmount);
      
      // Default medicare rate is 1.45%
      expect(taxes.medicare).toBe(1450); // $14.50
    });

    it("should return all tax components", async () => {
      const grossAmount = 500000; // $5,000
      const taxes = await calculateTaxWithholdings(grossAmount);
      
      expect(taxes).toHaveProperty("federalTax");
      expect(taxes).toHaveProperty("stateTax");
      expect(taxes).toHaveProperty("localTax");
      expect(taxes).toHaveProperty("socialSecurity");
      expect(taxes).toHaveProperty("medicare");
      
      // All should be non-negative
      expect(taxes.federalTax).toBeGreaterThanOrEqual(0);
      expect(taxes.stateTax).toBeGreaterThanOrEqual(0);
      expect(taxes.localTax).toBeGreaterThanOrEqual(0);
      expect(taxes.socialSecurity).toBeGreaterThanOrEqual(0);
      expect(taxes.medicare).toBeGreaterThanOrEqual(0);
    });

    it("should handle zero gross amount", async () => {
      const taxes = await calculateTaxWithholdings(0);
      
      expect(taxes.federalTax).toBe(0);
      expect(taxes.socialSecurity).toBe(0);
      expect(taxes.medicare).toBe(0);
    });
  });

  describe("calculateNetPay", () => {
    it("should calculate net pay correctly", async () => {
      const grossAmount = 100000; // $1,000
      const netPay = await calculateNetPay(grossAmount);
      
      // With default rates: 12% federal + 6.2% SS + 1.45% medicare = 19.65%
      // Net should be approximately 80.35% of gross
      expect(netPay).toBeGreaterThan(0);
      expect(netPay).toBeLessThan(grossAmount);
    });

    it("should never return negative net pay", async () => {
      const grossAmount = 500000; // $5,000
      const netPay = await calculateNetPay(grossAmount);
      
      expect(netPay).toBeGreaterThanOrEqual(0);
    });

    it("should handle large amounts", async () => {
      const grossAmount = 100000000; // $1,000,000
      const netPay = await calculateNetPay(grossAmount);
      
      expect(netPay).toBeGreaterThan(0);
      expect(netPay).toBeLessThan(grossAmount);
    });

    it("should return zero for zero gross amount", async () => {
      const netPay = await calculateNetPay(0);
      expect(netPay).toBe(0);
    });
  });

  describe("Integration tests", () => {
    it("should calculate complete payroll for a transaction", async () => {
      // Scenario: $250,000 sale at 4% commission
      const saleAmount = 25000000; // $250,000 in cents
      const commissionRate = 400; // 4%
      
      const commission = calculateCommission(saleAmount, commissionRate);
      expect(commission).toBe(1000000); // $10,000
      
      const taxes = await calculateTaxWithholdings(commission);
      expect(taxes.federalTax).toBeGreaterThan(0);
      expect(taxes.socialSecurity).toBeGreaterThan(0);
      
      const netPay = await calculateNetPay(commission);
      expect(netPay).toBeGreaterThan(0);
      expect(netPay).toBeLessThan(commission);
      
      // Net pay should equal gross minus all taxes
      const totalTaxes = taxes.federalTax + taxes.stateTax + taxes.localTax + 
                        taxes.socialSecurity + taxes.medicare;
      expect(netPay).toBe(commission - totalTaxes);
    });

    it("should handle multiple transactions", async () => {
      const transactions = [
        { saleAmount: 10000000, commissionRate: 500 }, // $100k at 5%
        { saleAmount: 15000000, commissionRate: 400 }, // $150k at 4%
        { saleAmount: 5000000, commissionRate: 600 },  // $50k at 6%
      ];
      
      let totalCommission = 0;
      for (const trans of transactions) {
        const commission = calculateCommission(trans.saleAmount, trans.commissionRate);
        totalCommission += commission;
      }
      
      expect(totalCommission).toBe(1400000); // $14,000 total (5k + 6k + 3k)
      
      const taxes = await calculateTaxWithholdings(totalCommission);
      const netPay = await calculateNetPay(totalCommission);
      
      expect(netPay).toBeGreaterThan(0);
      expect(netPay).toBeLessThan(totalCommission);
    });
  });
});
