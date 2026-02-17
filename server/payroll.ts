import { getEmployeeById, getTransactions, getTaxSettings, getPaymentById, createPayment, updatePayment, getPayrollPeriodById } from "./db";
import { Payment, InsertPayment } from "../drizzle/schema";

/**
 * Calculate commission for a transaction based on the sale amount and commission rate
 */
export function calculateCommission(saleAmount: number, commissionRate: number): number {
  // saleAmount is in cents, commissionRate is percentage * 100 (e.g., 5% = 500)
  return Math.round((saleAmount * commissionRate) / 10000);
}

/**
 * Calculate tax withholdings based on gross commission amount
 */
export async function calculateTaxWithholdings(grossAmount: number) {
  const taxSettings = await getTaxSettings();
  
  if (!taxSettings || taxSettings.length === 0) {
    // Default tax rates if not configured
    return {
      federalTax: Math.round(grossAmount * 0.12),
      stateTax: 0,
      localTax: 0,
      socialSecurity: Math.round(grossAmount * 0.062),
      medicare: Math.round(grossAmount * 0.0145),
    };
  }

  const settings = taxSettings[0];
  
  return {
    federalTax: Math.round((grossAmount * settings.federalTaxRate) / 10000),
    stateTax: Math.round((grossAmount * (settings.stateTaxRate ?? 0)) / 10000),
    localTax: Math.round((grossAmount * (settings.localTaxRate ?? 0)) / 10000),
    socialSecurity: Math.round((grossAmount * (settings.socialSecurityRate ?? 620)) / 10000),
    medicare: Math.round((grossAmount * (settings.medicareRate ?? 145)) / 10000),
  };
}

/**
 * Calculate net pay after all deductions
 */
export async function calculateNetPay(grossAmount: number): Promise<number> {
  const taxes = await calculateTaxWithholdings(grossAmount);
  const totalDeductions = 
    taxes.federalTax + 
    taxes.stateTax + 
    taxes.localTax + 
    taxes.socialSecurity + 
    taxes.medicare;
  
  return Math.max(0, grossAmount - totalDeductions);
}

/**
 * Generate a payment record for an employee based on their pending commissions
 */
export async function generatePaymentForEmployee(
  employeeId: number,
  payrollPeriodId: number,
  paymentMethod: "direct_deposit" | "check" | "wire_transfer" = "direct_deposit"
): Promise<Payment | null> {
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new Error("Employee not found");
  }

  // Get all pending transactions for this employee in the payroll period
  const transactions = await getTransactions(employeeId);
  
  // Filter transactions for the payroll period
  const period = await getPayrollPeriodById(payrollPeriodId);
  if (!period) {
    throw new Error("Payroll period not found");
  }

  const periodTransactions = transactions.filter(t => 
    t.transactionDate >= period.startDate && 
    t.transactionDate <= period.endDate &&
    t.status === "completed"
  );

  // Calculate gross commission
  const grossAmount = periodTransactions.reduce((sum, t) => sum + t.commissionAmount, 0);
  
  if (grossAmount === 0) {
    return null; // No commissions to pay
  }

  // Calculate taxes
  const taxes = await calculateTaxWithholdings(grossAmount);
  const netAmount = await calculateNetPay(grossAmount);

  // Create payment record
  const paymentData: InsertPayment = {
    employeeId,
    payrollPeriodId,
    grossAmount,
    federalTax: taxes.federalTax,
    stateTax: taxes.stateTax,
    localTax: taxes.localTax,
    socialSecurity: taxes.socialSecurity,
    medicare: taxes.medicare,
    netAmount,
    paymentMethod,
    paymentStatus: "pending",
  };

  await createPayment(paymentData);
  // Return the created payment data
  return {
    id: 0, // Will be assigned by database
    ...paymentData,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Payment;
}

/**
 * Process a payment (mark as processed and set payment date)
 */
export async function processPayment(paymentId: number): Promise<void> {
  await updatePayment(paymentId, {
    paymentStatus: "processed",
    paymentDate: new Date(),
  });
}

/**
 * Get payroll summary for a period
 */
export async function getPayrollSummary(payrollPeriodId: number) {
  const period = await getPayrollPeriodById(payrollPeriodId);
  if (!period) {
    throw new Error("Payroll period not found");
  }

  // This would typically query payments for the period
  // Implementation depends on your specific requirements
  return {
    periodId: payrollPeriodId,
    startDate: period.startDate,
    endDate: period.endDate,
    totalGrossCommissions: 0,
    totalTaxWithholdings: 0,
    totalNetPayments: 0,
  };
}
