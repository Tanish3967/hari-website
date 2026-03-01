-- Run this in the Supabase SQL Editor to add the missing columns for the medicines table

ALTER TABLE public.medicines
ADD COLUMN frequency text,
ADD COLUMN duration text;
