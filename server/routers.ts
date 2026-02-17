import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { 
  getEmployees, getEmployeeById, createEmployee, updateEmployee,
  getTransactions, getTransactionById, createTransaction, updateTransaction,
  getPayments, getPaymentById, createPayment, updatePayment,
  getPayrollPeriods, getPayrollPeriodById, createPayrollPeriod, updatePayrollPeriod,
  getCommissionRates, getTaxSettings
} from "./db";
import { calculateCommission, calculateTaxWithholdings, calculateNetPay, generatePaymentForEmployee, processPayment } from "./payroll";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  employees: router({
    list: publicProcedure.query(() => getEmployees()),
    getById: publicProcedure.input(z.number()).query(({ input }) => getEmployeeById(input)),
    create: protectedProcedure
      .input(z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        baseCommissionRate: z.number().default(500),
        hireDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return createEmployee({
          userId: ctx.user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          baseCommissionRate: input.baseCommissionRate,
          hireDate: input.hireDate,
          employmentStatus: "active",
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        baseCommissionRate: z.number().optional(),
        employmentStatus: z.enum(["active", "inactive", "suspended"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, ...data } = input;
        return updateEmployee(id, data);
      }),
  }),

  transactions: router({
    list: publicProcedure
      .input(z.object({ employeeId: z.number().optional() }).optional())
      .query(({ input }) => getTransactions(input?.employeeId)),
    getById: publicProcedure.input(z.number()).query(({ input }) => getTransactionById(input)),
    create: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        propertyAddress: z.string(),
        propertyCity: z.string().optional(),
        propertyState: z.string().optional(),
        propertyZip: z.string().optional(),
        saleAmount: z.number(),
        commissionRate: z.number(),
        transactionDate: z.date(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const commissionAmount = calculateCommission(input.saleAmount, input.commissionRate);
        return createTransaction({
          employeeId: input.employeeId,
          propertyAddress: input.propertyAddress,
          propertyCity: input.propertyCity,
          propertyState: input.propertyState,
          propertyZip: input.propertyZip,
          saleAmount: input.saleAmount,
          commissionRate: input.commissionRate,
          commissionAmount,
          transactionDate: input.transactionDate,
          status: "pending",
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "completed", "cancelled"]).optional(),
        saleAmount: z.number().optional(),
        commissionRate: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, ...data } = input;
        
        let updateData: any = { ...data };
        if (data.saleAmount && data.commissionRate) {
          updateData.commissionAmount = calculateCommission(data.saleAmount, data.commissionRate);
        }
        
        return updateTransaction(id, updateData);
      }),
  }),

  payments: router({
    list: publicProcedure
      .input(z.object({ employeeId: z.number().optional() }).optional())
      .query(({ input }) => getPayments(input?.employeeId)),
    getById: publicProcedure.input(z.number()).query(({ input }) => getPaymentById(input)),
    process: protectedProcedure
      .input(z.number())
      .mutation(async ({ input: paymentId, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return processPayment(paymentId);
      }),
  }),

  payroll: router({
    generatePayment: protectedProcedure
      .input(z.object({
        employeeId: z.number(),
        payrollPeriodId: z.number(),
        paymentMethod: z.enum(["direct_deposit", "check", "wire_transfer"]).default("direct_deposit"),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return generatePaymentForEmployee(input.employeeId, input.payrollPeriodId, input.paymentMethod);
      }),
    calculateTaxes: publicProcedure
      .input(z.number())
      .query(({ input: grossAmount }) => calculateTaxWithholdings(grossAmount)),
  }),

  payrollPeriods: router({
    list: publicProcedure.query(() => getPayrollPeriods()),
    getById: publicProcedure.input(z.number()).query(({ input }) => getPayrollPeriodById(input)),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return createPayrollPeriod({
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
          status: "open",
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["open", "closed", "processed"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, ...data } = input;
        return updatePayrollPeriod(id, data);
      }),
  }),

  settings: router({
    getCommissionRates: publicProcedure.query(() => getCommissionRates()),
    getTaxSettings: publicProcedure.query(() => getTaxSettings()),
  }),
});

export type AppRouter = typeof appRouter;
