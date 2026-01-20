-- PHASE-3 STUDY SYSTEM TABLES
-- SAFE ADDITIVE MIGRATION

CREATE TABLE IF NOT EXISTS study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user
ON study_sessions (telegram_id);

CREATE TABLE IF NOT EXISTS daily_study_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  study_date TEXT NOT NULL,
  studied_seconds INTEGER NOT NULL DEFAULT 0,
  UNIQUE (telegram_id, study_date)
);
