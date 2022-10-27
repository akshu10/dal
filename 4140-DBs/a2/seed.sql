INSERT INTOset schema 'public';
-- Seed Part table
INSERT INTO part471 (
        part_no471,
        name471,
        description471,
        current_price_cents471,
        qoh471
    )
VALUES (
        'QD2-00001',
        'Part 1',
        'Part1 description',
        3499,
        10
    ),
    (
        'QD2-00002',
        'Part 2',
        'Part2 description',
        2000,
        20
    ),
    (
        'QD2-00003',
        'Part 3',
        'Part3 description',
        750,
        30
    ),
    (
        'QD2-00004',
        'Part 4',
        'Part4 description',
        5500,
        30
    ),
    (
        'QD2-00005',
        'Part 5',
        'Part5 description',
        6550,
        10
    );
-- Seed Client table 
INSERT INTO client471 (
        client_city471,
        client_status471,
        client_name471,
        client_country471,
        cents_on_order471
    )
values ('City1', 'Active', 'Client 1', 'CA', 0),
    ('City2', 'Active', 'Client 2', 'CA', 0),
    ('City3', 'Active', 'Client 3', 'CA', 0),
    ('City4', 'Active', 'Client 4', 'CA', 0);