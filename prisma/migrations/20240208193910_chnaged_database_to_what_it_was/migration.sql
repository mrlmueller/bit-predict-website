/*
  Warnings:

  - You are about to drop the `OpertationStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prediction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Preds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScrapedData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tradingdata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `OpertationStatus`;

-- DropTable
DROP TABLE `Prediction`;

-- DropTable
DROP TABLE `Preds`;

-- DropTable
DROP TABLE `ScrapedData`;

-- DropTable
DROP TABLE `Tradingdata`;

-- CreateTable
CREATE TABLE `opertationstatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prediction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pred` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scrapeddata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `btc_open` DOUBLE NULL,
    `btc_high` DOUBLE NULL,
    `btc_low` DOUBLE NULL,
    `btc_close` DOUBLE NULL,
    `btc_volume` DOUBLE NULL,
    `higher_lower` DOUBLE NULL,
    `moving_amount` DOUBLE NULL,
    `Sentiment` DOUBLE NULL,
    `interest_rate` DOUBLE NULL,
    `CPI` DOUBLE NULL,
    `yield_open` DOUBLE NULL,
    `yield_close` DOUBLE NULL,
    `btc_dom_open` DOUBLE NULL,
    `btc_dom_close` DOUBLE NULL,
    `gold_open` DOUBLE NULL,
    `gold_close` DOUBLE NULL,
    `Unemployment_Rate` DOUBLE NULL,
    `Block_Reward_BTC` DOUBLE NULL,
    `Days_Since_Last_Halving` DOUBLE NULL,
    `EMA200` DOUBLE NULL,
    `EMA50` DOUBLE NULL,
    `EMA20` DOUBLE NULL,
    `RSI` DOUBLE NULL,
    `AvgTone_event_1` DOUBLE NULL,
    `AvgTone_event_2` DOUBLE NULL,
    `AvgTone_event_3` DOUBLE NULL,
    `AvgTone_event_4` DOUBLE NULL,
    `AvgTone_event_5` DOUBLE NULL,
    `AvgTone_event_6` DOUBLE NULL,
    `AvgTone_event_7` DOUBLE NULL,
    `AvgTone_event_8` DOUBLE NULL,
    `AvgTone_event_9` DOUBLE NULL,
    `AvgTone_event_10` DOUBLE NULL,
    `AvgTone_event_11` DOUBLE NULL,
    `AvgTone_event_12` DOUBLE NULL,
    `AvgTone_event_13` DOUBLE NULL,
    `EventCode_event_1` INTEGER NULL,
    `EventCode_event_2` INTEGER NULL,
    `EventCode_event_3` INTEGER NULL,
    `EventCode_event_4` INTEGER NULL,
    `EventCode_event_5` INTEGER NULL,
    `EventCode_event_6` INTEGER NULL,
    `EventCode_event_7` INTEGER NULL,
    `EventCode_event_8` INTEGER NULL,
    `EventCode_event_9` INTEGER NULL,
    `EventCode_event_10` INTEGER NULL,
    `EventCode_event_11` INTEGER NULL,
    `EventCode_event_12` INTEGER NULL,
    `EventCode_event_13` INTEGER NULL,
    `GoldsteinScale_event_1` DOUBLE NULL,
    `GoldsteinScale_event_2` DOUBLE NULL,
    `GoldsteinScale_event_3` DOUBLE NULL,
    `GoldsteinScale_event_4` DOUBLE NULL,
    `GoldsteinScale_event_5` DOUBLE NULL,
    `GoldsteinScale_event_6` DOUBLE NULL,
    `GoldsteinScale_event_7` DOUBLE NULL,
    `GoldsteinScale_event_8` DOUBLE NULL,
    `GoldsteinScale_event_9` DOUBLE NULL,
    `GoldsteinScale_event_10` DOUBLE NULL,
    `GoldsteinScale_event_11` DOUBLE NULL,
    `GoldsteinScale_event_12` DOUBLE NULL,
    `GoldsteinScale_event_13` DOUBLE NULL,
    `NumArticles_event_1` INTEGER NULL,
    `NumArticles_event_2` INTEGER NULL,
    `NumArticles_event_3` INTEGER NULL,
    `NumArticles_event_4` INTEGER NULL,
    `NumArticles_event_5` INTEGER NULL,
    `NumArticles_event_6` INTEGER NULL,
    `NumArticles_event_7` INTEGER NULL,
    `NumArticles_event_8` INTEGER NULL,
    `NumArticles_event_9` INTEGER NULL,
    `NumArticles_event_10` INTEGER NULL,
    `NumArticles_event_11` INTEGER NULL,
    `NumArticles_event_12` INTEGER NULL,
    `NumArticles_event_13` INTEGER NULL,
    `NumMentions_event_1` INTEGER NULL,
    `NumMentions_event_2` INTEGER NULL,
    `NumMentions_event_3` INTEGER NULL,
    `NumMentions_event_4` INTEGER NULL,
    `NumMentions_event_5` INTEGER NULL,
    `NumMentions_event_6` INTEGER NULL,
    `NumMentions_event_7` INTEGER NULL,
    `NumMentions_event_8` INTEGER NULL,
    `NumMentions_event_9` INTEGER NULL,
    `NumMentions_event_10` INTEGER NULL,
    `NumMentions_event_11` INTEGER NULL,
    `NumMentions_event_12` INTEGER NULL,
    `NumMentions_event_13` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tradingdata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `before_trade_close` DOUBLE NULL,
    `after_trade_close` DOUBLE NULL,
    `close_fees` DOUBLE NULL,
    `after_trade_open` DOUBLE NULL,
    `before_trade_open` DOUBLE NULL,
    `open_fees` DOUBLE NULL,
    `leverage` DOUBLE NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
