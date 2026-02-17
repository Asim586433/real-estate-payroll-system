import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zipCode", { length: 20 }),
  baseCommissionRate: int("baseCommissionRate").notNull().default(5), // percentage * 100 (5% = 500)
  employmentStatus: mysqlEnum("employmentStatus", ["active", "inactive", "suspended"]).default("active").notNull(),
  taxId: varchar("taxId", { length: 50 }),
  bankAccount: varchar("bankAccount", { length: 100 }),
  bankRoutingNumber: varchar("bankRoutingNumber", { length: 20 }),
  hireDate: timestamp("hireDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const commissionRates = mysqlTable("commissionRates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  baseRate: int("baseRate").notNull(), // percentage * 100
  minSaleAmount: int("minSaleAmount").default(0),
  maxSaleAmount: int("maxSaleAmount"),
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull().references(() => employees.id),
  propertyAddress: varchar("propertyAddress", { length: 255 }).notNull(),
  propertyCity: varchar("propertyCity", { length: 100 }),
  propertyState: varchar("propertyState", { length: 50 }),
  propertyZip: varchar("propertyZip", { length: 20 }),
  saleAmount: int("saleAmount").notNull(), // in cents
  commissionRate: int("commissionRate").notNull(), // percentage * 100
  commissionAmount: int("commissionAmount").notNull(), // in cents
  transactionDate: timestamp("transactionDate").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const taxSettings = mysqlTable("taxSettings", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  federalTaxRate: int("federalTaxRate").notNull(), // percentage * 100
  stateTaxRate: int("stateTaxRate").default(0),
  localTaxRate: int("localTaxRate").default(0),
  socialSecurityRate: int("socialSecurityRate").default(620), // 6.2%
  medicareRate: int("medicareRate").default(145), // 1.45%
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull().references(() => employees.id),
  payrollPeriodId: int("payrollPeriodId").references(() => payrollPeriods.id),
  grossAmount: int("grossAmount").notNull(), // in cents
  federalTax: int("federalTax").default(0),
  stateTax: int("stateTax").default(0),
  localTax: int("localTax").default(0),
  socialSecurity: int("socialSecurity").default(0),
  medicare: int("medicare").default(0),
  netAmount: int("netAmount").notNull(), // in cents
  paymentMethod: mysqlEnum("paymentMethod", ["direct_deposit", "check", "wire_transfer"]).default("direct_deposit").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "processed", "failed", "cancelled"]).default("pending").notNull(),
  paymentDate: timestamp("paymentDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const payrollPeriods = mysqlTable("payrollPeriods", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  status: mysqlEnum("status", ["open", "closed", "processed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;
export type CommissionRate = typeof commissionRates.$inferSelect;
export type InsertCommissionRate = typeof commissionRates.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type TaxSetting = typeof taxSettings.$inferSelect;
export type InsertTaxSetting = typeof taxSettings.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type PayrollPeriod = typeof payrollPeriods.$inferSelect;
export type InsertPayrollPeriod = typeof payrollPeriods.$inferInsert;