-- Run against the FileStacker database while the old backend is stopped.
-- Supabase Auth stores the hashes used for sign-in in its own schema.
ALTER TABLE public.user_data DROP COLUMN IF EXISTS u_password;
