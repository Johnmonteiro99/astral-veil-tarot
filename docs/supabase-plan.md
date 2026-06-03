# Astral Veil Supabase Foundation

## Purpose

Astral Veil will use Supabase for:

- User authentication
- Saved user progression
- Noctis Archive room unlocks
- Artifact/key unlocks
- Memory fragments
- Admin-managed journals
- Admin-managed room content
- Admin-managed Veilwalker data
- Image/file storage
- Future mobile app support for iOS and Android

## Branch Strategy

main = stable public website  
astral-veil-update = ongoing development  
feature/supabase-foundation = Supabase/Auth/Admin foundation work  

No Supabase work goes directly to main.

## Current Rule

The live website must continue working exactly as it does now while Supabase features are built gradually.

Supabase features should be added one piece at a time, tested locally, and only merged when stable.

## Supabase Project

Organization: Astral Veil  
Project: astral-veil-dev  

## Auth Language

Signup = Bind Your Thread  
Login = Return to Your Thread  
Account = Your Archive  
Logout = Sever Thread  

## First Milestones

1. Create Supabase project
2. Configure email authentication
3. Configure redirect URLs
4. Add Supabase environment notes
5. Connect frontend to Supabase without changing website behavior
6. Create auth page
7. Test signup/login/logout
8. Create profiles table
9. Add admin role
10. Create admin page
11. Add journals table
12. Add archive rooms table
13. Add storage for images
14. Later: save user progression

## First Tables Planned

profiles  
journals  
archive_rooms  
veilwalkers  
user_artifacts  
user_rooms  
user_fragments  

## Admin System Goal

Only admin users can create, edit, or publish:

- Journals
- Room content
- Veilwalker data
- Artifact clues
- Memory fragments
- Images

Admin access should be protected by both frontend checks and Supabase Row Level Security.

## User Progression Goal

Users will eventually be able to create accounts and save:

- Artifact unlocks
- Noctis room unlocks
- Memory fragments
- Rare encounters
- Future reading history

## Important Security Rule

The Supabase service role key must never be placed in frontend code or committed to GitHub.

Only the public anon key should be used in frontend code, and database access must be controlled with Row Level Security.