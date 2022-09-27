CREATE SCHEMA IF NOT EXISTS "public";
CREATE TABLE IF NOT EXISTS "public".order471 (
    Po_no471 varchar(50) NOT NULL,
    client_id471 integer NOT NULL,
    status471 varchar(50) NOT NULL,
    request_date471 timestamp(6) NULL,
    CONSTRAINT purchase_number_index471 PRIMARY KEY (Po_no471),
    CONSTRAINT FK_2 FOREIGN KEY (client_id471) REFERENCES "public".client471 (id471)
);
CREATE INDEX client_id_fk_index471 ON "public".order471 (client_id471);