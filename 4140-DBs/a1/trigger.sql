CREATE OR REPLACE FUNCTION public.update_money_owed471() RETURNS trigger LANGUAGE 'plpgsql' COST 100 VOLATILE NOT LEAKPROOF AS $BODY$
declare new_cents_owed471 numeric;
c_id471 numeric;
previous_cents_owed471 numeric;
BEGIN RAISE NOTICE 'Begin';
SELECT client_id471 INTO c_id471
FROM order471
WHERE order471.Po_no471 = new.Po_no471;
RAISE NOTICE 'Client ID: %',
c_id471;
SELECT cents_owed471 INTO previous_cents_owed471
FROM client471
WHERE client471.id471 = c_id471;
RAISE NOTICE 'Previous Cents Owed: %',
previous_cents_owed471;
new_cents_owed471 = new.part_price_cents471 * new.quantity471;
RAISE NOTICE 'New Cents Owed: %',
new_cents_owed471;
UPDATE client471
SET cents_owed471 = previous_cents_owed471 + new_cents_owed471
WHERE client471.id471 = c_id471;
RAISE NOTICE 'Done';
RETURN NEW;
END;
$BODY$;