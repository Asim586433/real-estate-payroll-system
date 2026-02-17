import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Sample data
const sampleEmployees = [
  { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@realestate.com', phone: '555-0101', baseCommissionRate: 500, hireDate: '2022-01-15' },
  { firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@realestate.com', phone: '555-0102', baseCommissionRate: 550, hireDate: '2021-06-20' },
  { firstName: 'Jessica', lastName: 'Williams', email: 'jessica.williams@realestate.com', phone: '555-0103', baseCommissionRate: 480, hireDate: '2023-03-10' },
  { firstName: 'David', lastName: 'Martinez', email: 'david.martinez@realestate.com', phone: '555-0104', baseCommissionRate: 520, hireDate: '2022-09-01' },
  { firstName: 'Emily', lastName: 'Thompson', email: 'emily.thompson@realestate.com', phone: '555-0105', baseCommissionRate: 510, hireDate: '2023-01-05' },
  { firstName: 'Robert', lastName: 'Anderson', email: 'robert.anderson@realestate.com', phone: '555-0106', baseCommissionRate: 540, hireDate: '2021-11-12' },
  { firstName: 'Amanda', lastName: 'Davis', email: 'amanda.davis@realestate.com', phone: '555-0107', baseCommissionRate: 490, hireDate: '2022-07-18' },
  { firstName: 'Christopher', lastName: 'Brown', email: 'christopher.brown@realestate.com', phone: '555-0108', baseCommissionRate: 530, hireDate: '2023-02-14' },
  { firstName: 'Lisa', lastName: 'Wilson', email: 'lisa.wilson@realestate.com', phone: '555-0109', baseCommissionRate: 500, hireDate: '2022-05-22' },
  { firstName: 'James', lastName: 'Taylor', email: 'james.taylor@realestate.com', phone: '555-0110', baseCommissionRate: 560, hireDate: '2021-08-30' },
  { firstName: 'Michelle', lastName: 'Garcia', email: 'michelle.garcia@realestate.com', phone: '555-0111', baseCommissionRate: 495, hireDate: '2022-12-01' },
  { firstName: 'Daniel', lastName: 'Rodriguez', email: 'daniel.rodriguez@realestate.com', phone: '555-0112', baseCommissionRate: 525, hireDate: '2023-04-11' },
];

const sampleCommissionRates = [
  { name: 'Standard Rate', description: 'Standard commission rate for residential properties', baseRate: 500, minSaleAmount: 0, maxSaleAmount: null },
  { name: 'Premium Rate', description: 'Higher rate for high-value properties', baseRate: 600, minSaleAmount: 50000000, maxSaleAmount: null },
  { name: 'Starter Rate', description: 'Lower rate for new agents', baseRate: 400, minSaleAmount: 0, maxSaleAmount: 25000000 },
  { name: 'Commercial Rate', description: 'Rate for commercial properties', baseRate: 550, minSaleAmount: 0, maxSaleAmount: null },
];

const sampleTaxSettings = [
  { name: 'Federal Tax 2024', federalTaxRate: 1200, stateTaxRate: 500, localTaxRate: 200, socialSecurityRate: 620, medicareRate: 145 },
];

const samplePayrollPeriods = [
  { name: 'January 2024', startDate: '2024-01-01', endDate: '2024-01-31', status: 'closed' },
  { name: 'February 2024', startDate: '2024-02-01', endDate: '2024-02-29', status: 'closed' },
  { name: 'March 2024', startDate: '2024-03-01', endDate: '2024-03-31', status: 'closed' },
  { name: 'April 2024', startDate: '2024-04-01', endDate: '2024-04-30', status: 'closed' },
  { name: 'May 2024', startDate: '2024-05-01', endDate: '2024-05-31', status: 'closed' },
  { name: 'June 2024', startDate: '2024-06-01', endDate: '2024-06-30', status: 'closed' },
];

const propertyAddresses = [
  { address: '123 Oak Street', city: 'San Francisco', state: 'CA', zip: '94102' },
  { address: '456 Maple Avenue', city: 'Los Angeles', state: 'CA', zip: '90001' },
  { address: '789 Pine Road', city: 'San Diego', state: 'CA', zip: '92101' },
  { address: '321 Elm Drive', city: 'San Jose', state: 'CA', zip: '95101' },
  { address: '654 Cedar Lane', city: 'Oakland', state: 'CA', zip: '94601' },
  { address: '987 Birch Court', city: 'Berkeley', state: 'CA', zip: '94704' },
  { address: '147 Spruce Way', city: 'Fremont', state: 'CA', zip: '94536' },
  { address: '258 Willow Place', city: 'Sunnyvale', state: 'CA', zip: '94086' },
  { address: '369 Ash Boulevard', city: 'Santa Clara', state: 'CA', zip: '95050' },
  { address: '741 Chestnut Street', city: 'Hayward', state: 'CA', zip: '94541' },
  { address: '852 Walnut Avenue', city: 'Palo Alto', state: 'CA', zip: '94301' },
  { address: '963 Hickory Road', city: 'Mountain View', state: 'CA', zip: '94040' },
  { address: '159 Poplar Drive', city: 'Sunnyvale', state: 'CA', zip: '94087' },
  { address: '357 Sycamore Lane', city: 'Cupertino', state: 'CA', zip: '95014' },
  { address: '486 Magnolia Court', city: 'Santa Monica', state: 'CA', zip: '90401' },
];

const saleAmounts = [
  250000, 350000, 450000, 550000, 650000, 750000, 850000, 950000,
  1050000, 1150000, 1250000, 1350000, 1450000, 1550000, 1650000,
  1750000, 1850000, 1950000, 2050000, 2150000,
];

try {
  console.log('Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await connection.execute('DELETE FROM payments');
  await connection.execute('DELETE FROM transactions');
  await connection.execute('DELETE FROM employees');
  await connection.execute('DELETE FROM payrollPeriods');
  await connection.execute('DELETE FROM commissionRates');
  await connection.execute('DELETE FROM taxSettings');

  // Insert commission rates
  console.log('Inserting commission rates...');
  for (const rate of sampleCommissionRates) {
    await connection.execute(
      'INSERT INTO commissionRates (name, description, baseRate, minSaleAmount, maxSaleAmount, isActive) VALUES (?, ?, ?, ?, ?, 1)',
      [rate.name, rate.description, rate.baseRate, rate.minSaleAmount, rate.maxSaleAmount]
    );
  }

  // Insert tax settings
  console.log('Inserting tax settings...');
  for (const tax of sampleTaxSettings) {
    await connection.execute(
      'INSERT INTO taxSettings (name, federalTaxRate, stateTaxRate, localTaxRate, socialSecurityRate, medicareRate, isActive) VALUES (?, ?, ?, ?, ?, ?, 1)',
      [tax.name, tax.federalTaxRate, tax.stateTaxRate, tax.localTaxRate, tax.socialSecurityRate, tax.medicareRate]
    );
  }

  // Insert payroll periods
  console.log('Inserting payroll periods...');
  for (const period of samplePayrollPeriods) {
    await connection.execute(
      'INSERT INTO payrollPeriods (name, startDate, endDate, status) VALUES (?, ?, ?, ?)',
      [period.name, period.startDate, period.endDate, period.status]
    );
  }

  // Insert employees
  console.log('Inserting employees...');
  const employeeIds = [];
  for (const emp of sampleEmployees) {
    const [result] = await connection.execute(
      'INSERT INTO employees (userId, firstName, lastName, email, phone, baseCommissionRate, employmentStatus, hireDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [1, emp.firstName, emp.lastName, emp.email, emp.phone, emp.baseCommissionRate, 'active', emp.hireDate]
    );
    employeeIds.push(result.insertId);
  }

  // Insert transactions
  console.log('Inserting transactions...');
  const transactionIds = [];
  const startDate = new Date('2024-01-01');
  let currentDate = new Date(startDate);
  
  for (let i = 0; i < 60; i++) {
    const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
    const property = propertyAddresses[Math.floor(Math.random() * propertyAddresses.length)];
    const saleAmount = saleAmounts[Math.floor(Math.random() * saleAmounts.length)] * 100; // Convert to cents
    const commissionRate = 500 + Math.floor(Math.random() * 100); // 5% to 6%
    const commissionAmount = Math.round((saleAmount * commissionRate) / 10000);
    
    const [result] = await connection.execute(
      'INSERT INTO transactions (employeeId, propertyAddress, propertyCity, propertyState, propertyZip, saleAmount, commissionRate, commissionAmount, transactionDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [employeeId, property.address, property.city, property.state, property.zip, saleAmount, commissionRate, commissionAmount, currentDate, 'completed']
    );
    transactionIds.push(result.insertId);
    
    // Increment date by 1-2 days
    currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 2) + 1);
  }

  // Insert payments
  console.log('Inserting payments...');
  for (let periodId = 1; periodId <= 6; periodId++) {
    for (const employeeId of employeeIds) {
      // Calculate gross commission for the period
      const [rows] = await connection.execute(
        'SELECT SUM(commissionAmount) as total FROM transactions WHERE employeeId = ? AND MONTH(transactionDate) = ? AND YEAR(transactionDate) = 2024 AND status = "completed"',
        [employeeId, periodId]
      );
      
      const grossAmount = rows[0]?.total || 0;
      
      if (grossAmount > 0) {
        // Calculate taxes (simplified)
        const federalTax = Math.round(grossAmount * 0.12);
        const stateTax = Math.round(grossAmount * 0.05);
        const localTax = Math.round(grossAmount * 0.02);
        const socialSecurity = Math.round(grossAmount * 0.062);
        const medicare = Math.round(grossAmount * 0.0145);
        const netAmount = grossAmount - federalTax - stateTax - localTax - socialSecurity - medicare;
        
        const paymentStatus = Math.random() > 0.2 ? 'processed' : 'pending';
        const paymentDate = paymentStatus === 'processed' ? new Date(2024, periodId - 1, 28) : null;
        
        await connection.execute(
          'INSERT INTO payments (employeeId, payrollPeriodId, grossAmount, federalTax, stateTax, localTax, socialSecurity, medicare, netAmount, paymentMethod, paymentStatus, paymentDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [employeeId, periodId, grossAmount, federalTax, stateTax, localTax, socialSecurity, medicare, netAmount, 'direct_deposit', paymentStatus, paymentDate]
        );
      }
    }
  }

  console.log('✓ Database seeding completed successfully!');
  console.log(`✓ Inserted ${sampleCommissionRates.length} commission rates`);
  console.log(`✓ Inserted ${sampleTaxSettings.length} tax settings`);
  console.log(`✓ Inserted ${samplePayrollPeriods.length} payroll periods`);
  console.log(`✓ Inserted ${employeeIds.length} employees`);
  console.log(`✓ Inserted 60 transactions`);
  console.log('✓ Inserted payments for all employees and periods');

  await connection.end();
} catch (error) {
  console.error('Error seeding database:', error);
  process.exit(1);
}
