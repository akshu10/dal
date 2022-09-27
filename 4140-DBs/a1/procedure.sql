CREATE OR REPLACE PROCEDURE get_part_price(
        IN part_number471 varchar,
        OUT part_price_cents471 numeric
    ) AS $$ BEGIN
SELECT current_price_cents471 INTO $2
from part471
WHERE part471.part_no471 = $1;
END;
$$ LANGUAGE plpgsql;
DO $$
DECLARE output_var471 numeric;
BEGIN CALL get_part_price('QD2-00350', output_var471);
RAISE NOTICE 'Procedure Output = %',
output_var471;
END;
$$;