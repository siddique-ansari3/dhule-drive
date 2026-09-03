CREATE TABLE `bookingRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(24) NOT NULL,
	`vehicleId` int NOT NULL,
	`customerName` varchar(120) NOT NULL,
	`phone` varchar(24) NOT NULL,
	`pickupDate` varchar(10) NOT NULL,
	`returnDate` varchar(10) NOT NULL,
	`pickupTime` varchar(5) NOT NULL,
	`returnTime` varchar(5) NOT NULL,
	`pickupLocation` varchar(255) NOT NULL,
	`tripType` enum('self_drive','with_driver') NOT NULL DEFAULT 'self_drive',
	`notes` text,
	`quotedTotal` int NOT NULL,
	`status` enum('pending','confirmed','declined','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookingRequests_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookingRequests_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`brand` varchar(120) NOT NULL,
	`category` varchar(80) NOT NULL,
	`imageUrl` varchar(512) NOT NULL,
	`seats` int NOT NULL,
	`transmission` enum('manual','automatic') NOT NULL,
	`fuel` enum('petrol','diesel','cng','electric') NOT NULL,
	`dailyRate` int NOT NULL,
	`availability` enum('available','unavailable') NOT NULL DEFAULT 'available',
	`featured` boolean NOT NULL DEFAULT false,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
