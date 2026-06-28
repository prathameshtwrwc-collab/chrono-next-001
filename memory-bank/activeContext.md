# Active Context

# Active Context

## Project Status

Current Project:

Sleep Wellness & Chronotype Intelligence Platform

Owner:

WelcomeCure HealthTech

Development Status:

Active Development

---

# Current Objective

Primary Goal:

Convert the existing React + Vite application into a production-ready Next.js platform while preserving the approved UI and preparing the system for real functionality.

The current focus is functionality, architecture, and data flow.

Not redesign.

---

# Current Phase

Phase:

Foundation & Infrastructure

---

# Completed

Business Model Defined

Organization Hierarchy Defined

User Flows Defined

Role Permissions Defined

Database Architecture Defined

Assessment Architecture Defined

Reporting Architecture Defined

System Architecture Defined

Technology Stack Selected

Memory Bank Established

---

# In Progress

Next.js Migration

Route Validation

Dashboard Preservation

Navigation Validation

Component Preservation

Folder Structure Cleanup

---

# Pending

Supabase Project Setup

Database Creation

Database Migrations

Clerk Authentication

Role Based Access Control

Organization Management

Assessment Engine

Chronotype Scoring

Report Generation

PDF Generation

Referral System

Analytics Engine

Member Dashboard Integration

Admin Dashboard Integration

Super Admin Dashboard Integration

---

# Current User Hierarchy

Super Admin
↓
Organizations
↓
Admins
↓
Members

---

# Current Authentication Strategy

Provider:

Clerk

Roles:

superadmin

admin

member

Authentication is planned but not fully integrated.

---

# Current Database Strategy

Provider:

Supabase PostgreSQL

Schema documented in:

databaseSchema.md

Schema should be finalized before implementation.

---

# Current Organization Strategy

Organizations receive:

Unique Organization Account

Unique Organization Code

Unique Assessment Link

Admin Access

Analytics Access

Members entering through organization links automatically become organization members.

---

# Current Member Strategy

Three member types:

Organization Members

Direct Members

Referral Members

Organization assignment rules already defined.

---

# Current Assessment Strategy

Assessment First

Login Later

Preferred User Flow:

Details
↓
Assessment
↓
Result
↓
Report
↓
Optional Login

This remains the approved flow.

---

# Current Dashboard Strategy

Existing dashboards are approved.

Dashboard structure must remain intact.

Charts, cards, tables, analytics sections, and layouts should be preserved even when using mock data.

Only data sources should change.

---

# Current Technical Stack

Frontend:

Next.js

TypeScript

TailwindCSS

shadcn/ui

Framer Motion

Authentication:

Clerk

Database:

Supabase PostgreSQL

Storage:

Supabase Storage

Hosting:

Vercel

---

# Current Risks

Accidental UI Redesign

Incorrect Organization Mapping

Incorrect Permission Logic

Hardcoded Assessment Logic

Poor Database Relationships

Breaking Existing Dashboard Layouts

---

# Immediate Priorities

1. Validate Next.js Migration

2. Finalize Database Schema

3. Setup Supabase

4. Setup Clerk

5. Implement Role Permissions

6. Implement Organization Management

7. Implement Assessment Flow

8. Implement Chronotype Logic

9. Implement Report Generation

10. Connect Dashboards To Real Data

---

# Important Reminder

The platform is not a simple assessment website.

It is a:

Sleep Wellness Platform

Chronotype Intelligence Platform

Corporate Wellness Platform

Research Analytics Platform

White Label SaaS Platform

All implementation decisions should align with this vision.
