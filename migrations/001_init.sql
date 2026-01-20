-- PHASE-2 : INITIAL DATABASE STRUCTURE
-- This file creates core tables only
-- No data insertion, no triggers

-- ================================
-- USERS
-- ================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  role TEXT DEFAULT 'student',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- STUDY SESSIONS (PHASE-3 READY)
-- ================================
CREATE TABLE IF NOT EXISTS study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  start_ts INTEGER NOT NULL,
  end_ts INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- DAILY TARGETS (PHASE-4 READY)
-- ================================
CREATE TABLE IF NOT EXISTS user_targets (
  user_id INTEGER PRIMARY KEY,
  daily_target_minutes INTEGER DEFAULT 480
);

-- ================================
-- DAILY REPORT SNAPSHOTS
-- ================================
CREATE TABLE IF NOT EXISTS daily_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  report_date TEXT NOT NULL,
  studied_seconds INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, report_date)
);
