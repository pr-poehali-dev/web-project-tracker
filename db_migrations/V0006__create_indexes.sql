CREATE INDEX idx_projects_client ON projects(client);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_is_removed ON projects(is_removed);
CREATE INDEX idx_expenses_project ON project_expenses(project_id);
CREATE INDEX idx_comments_project ON comments(project_id);
CREATE INDEX idx_files_project ON project_files(project_id);