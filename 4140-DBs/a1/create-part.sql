CREATE SCHEMA IF NOT EXISTS "public";
CREATE TABLE IF NOT EXISTS "public".part471 (
    part_no471 varchar(50) NOT NULL,
    description471 text NULL,
    QoH471 integer NOT NULL,
    name471 text NOT NULL,
    current_price_cents471 integer NOT NULL,
    CONSTRAINT part_number_index471 PRIMARY KEY (part_no471)
);