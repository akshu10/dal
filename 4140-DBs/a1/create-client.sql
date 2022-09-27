CREATE SCHEMA IF NOT EXISTS "public";
CREATE TABLE IF NOT EXISTS "public".client471 (
    id471 integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    client_city471 varchar(50) NOT NULL,
    cents_on_order471 integer NOT NULL,
    client_status471 text NOT NULL,
    client_name471 varchar(50) NOT NULL,
    client_comp_password471 text NOT NULL,
    cents_owed471 integer NOT NULL,
    client_address471 text NOT NULL,
    client_phone471 varchar(50) NOT NULL,
    client_country471 varchar(50) NOT NULL,
    client_postal471 varchar(50) NOT NULL,
    CONSTRAINT client_id_index471 PRIMARY KEY (id471)
);