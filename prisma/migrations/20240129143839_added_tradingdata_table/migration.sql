-- CreateTable
CREATE TABLE `Tradingdata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `before_trade_close` DOUBLE NULL,
    `after_trade_close` DOUBLE NULL,
    `close_fees` DOUBLE NULL,
    `after_trade_open` DOUBLE NULL,
    `before_trade_open` DOUBLE NULL,
    `open_fees` DOUBLE NULL,
    `leverage` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
