package com.atlassian.plugin.service;


import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.project.Project;
import com.atlassian.plugin.model.ProjectModel;

import java.util.List;

public interface ProjectService {
    List<ProjectModel>  getAllProjects() throws SearchException;

    ProjectModel getProjectById(Long id);
}
