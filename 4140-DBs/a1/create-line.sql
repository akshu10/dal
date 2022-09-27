CREATE SCHEMA IF NOT EXISTS "public";
CREATE TABLE IF NOT EXISTS "public".line471 (
    Po_no471 varchar(50) NOT NULL,
    line_num471 integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    part_no471 varchar(50) NOT NULL,
    part_price_cents471 integer NULL,
    quantity471 integer NULL,
    CONSTRAINT line_pkey471 PRIMARY KEY (Po_no471, line_num471),
    CONSTRAINT FK_3 FOREIGN KEY (part_no471) REFERENCES "public".part471 (part_no471),
    CONSTRAINT FK_2_1 FOREIGN KEY (Po_no471) REFERENCES "public".order471 (Po_no471)
);
CREATE INDEX part_no_Fk_index471 ON "public".line471 (part_no471);
CREATE INDEX purchase_number_fk_index471 ON "public".line471 (Po_no471);