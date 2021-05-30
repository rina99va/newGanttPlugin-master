package com.atlassian.plugin.action;

import com.atlassian.jira.web.action.JiraWebActionSupport;
import com.atlassian.plugin.service.AccessService;

public class ProjectAction extends JiraWebActionSupport {

    private final AccessService accessService;

    public ProjectAction(AccessService accessService) {
        this.accessService = accessService;
    }

    public boolean hasAccess() {
        return accessService.hasAccess();
    }

    @Override
    public String doDefault() throws Exception {
        return super.doDefault();
    }

    @Override
    protected String doExecute() throws Exception {
        return super.doExecute();
    }
}
