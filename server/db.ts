import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, employees, InsertEmployee, transactions, InsertTransaction, payments, InsertPayment, commissionRates, taxSettings, payrollPeriods, InsertPayrollPeriod } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployees() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(employees).orderBy(employees.createdAt);
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result[0];
}

export async function createEmployee(data: InsertEmployee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(employees).values(data);
  return result;
}

export async function updateEmployee(id: number, data: Partial<InsertEmployee>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(employees).set(data).where(eq(employees.id, id));
}

export async function getTransactions(employeeId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (employeeId) {
    return db.select().from(transactions).where(eq(transactions.employeeId, employeeId)).orderBy(transactions.transactionDate);
  }
  return db.select().from(transactions).orderBy(transactions.transactionDate);
}

export async function getTransactionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
  return result[0];
}

export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(transactions).values(data);
}

export async function updateTransaction(id: number, data: Partial<InsertTransaction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(transactions).set(data).where(eq(transactions.id, id));
}

export async function getPayments(employeeId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (employeeId) {
    return db.select().from(payments).where(eq(payments.employeeId, employeeId)).orderBy(payments.createdAt);
  }
  return db.select().from(payments).orderBy(payments.createdAt);
}

export async function getPaymentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
  return result[0];
}

export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(payments).values(data);
}

export async function updatePayment(id: number, data: Partial<InsertPayment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(payments).set(data).where(eq(payments.id, id));
}

export async function getCommissionRates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(commissionRates).where(eq(commissionRates.isActive, 1));
}

export async function getTaxSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(taxSettings).where(eq(taxSettings.isActive, 1));
}

export async function getPayrollPeriods() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payrollPeriods).orderBy(payrollPeriods.startDate);
}

export async function getPayrollPeriodById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(payrollPeriods).where(eq(payrollPeriods.id, id)).limit(1);
  return result[0];
}

export async function createPayrollPeriod(data: InsertPayrollPeriod) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(payrollPeriods).values(data);
}

export async function updatePayrollPeriod(id: number, data: Partial<InsertPayrollPeriod>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(payrollPeriods).set(data).where(eq(payrollPeriods.id, id));
}
