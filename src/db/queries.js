export const QUERIES = {
  INSERT_USER:
    "INSERT OR IGNORE INTO users (telegram_id, name) VALUES (?, ?)",

  INSERT_STUDY_LOG:
    "INSERT INTO study_logs (telegram_id, subject_code, duration_minutes, study_date) VALUES (?, ?, ?, ?)",

  CREATE_TEST:
    "INSERT INTO tests (telegram_id, test_type) VALUES (?, ?)",

  FINISH_TEST:
    "UPDATE tests SET completed_at = CURRENT_TIMESTAMP WHERE id = ?",

  INSERT_ANSWER:
    "INSERT INTO test_answers (test_id, mcq_id, selected_option, is_correct, is_timeout) VALUES (?, ?, ?, ?, ?)",
};
