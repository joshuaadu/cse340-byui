-- Insert new record to the account table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES ('Tony', 'Stark', 'tony@starkent', 'Iam1ronM@n');
-- Update record in the account table
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 2;
-- Delete record from the account table
DELETE FROM public.account
WHERE account_id = 2;
-- Update record in the inventory table
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory i
    JOIN public.classification cl ON i.classification_id = cl.classification_id
WHERE classification_name = 'Sport';
UPDATE public.inventory
SET inv_image = REPLACE(
        inv_image,
        '/images',
        '/images/vehicles'
    ),
    inv_thumbnail = REPLACE(
        inv_thumbnail,
        '/images',
        '/images/vehicles'
    );