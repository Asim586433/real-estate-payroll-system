CREATE TABLE `commissionRates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`baseRate` int NOT NULL,
	`minSaleAmount` int DEFAULT 0,
	`maxSaleAmount` int,
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `commissionRates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`zipCode` varchar(20),
	`baseCommissionRate` int NOT NULL DEFAULT 5,
	`employmentStatus` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`taxId` varchar(50),
	`bankAccount` varchar(100),
	`bankRoutingNumber` varchar(20),
	`hireDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`payrollPeriodId` int,
	`grossAmount` int NOT NULL,
	`federalTax` int DEFAULT 0,
	`stateTax` int DEFAULT 0,
	`localTax` int DEFAULT 0,
	`socialSecurity` int DEFAULT 0,
	`medicare` int DEFAULT 0,
	`netAmount` int NOT NULL,
	`paymentMethod` enum('direct_deposit','check','wire_transfer') NOT NULL DEFAULT 'direct_deposit',
	`paymentStatus` enum('pending','processed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`paymentDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payrollPeriods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`status` enum('open','closed','processed') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payrollPeriods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taxSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`federalTaxRate` int NOT NULL,
	`stateTaxRate` int DEFAULT 0,
	`localTaxRate` int DEFAULT 0,
	`socialSecurityRate` int DEFAULT 620,
	`medicareRate` int DEFAULT 145,
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `taxSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`propertyAddress` varchar(255) NOT NULL,
	`propertyCity` varchar(100),
	`propertyState` varchar(50),
	`propertyZip` varchar(20),
	`saleAmount` int NOT NULL,
	`commissionRate` int NOT NULL,
	`commissionAmount` int NOT NULL,
	`transactionDate` timestamp NOT NULL,
	`status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_payrollPeriodId_payrollPeriods_id_fk` FOREIGN KEY (`payrollPeriodId`) REFERENCES `payrollPeriods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;