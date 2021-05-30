package com.atlassian.plugin.service.impl;

import com.atlassian.activeobjects.external.ActiveObjects;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.plugin.service.AccessService;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Objects;

@Named
public class AccessServiceImpl implements AccessService {

    private final String USER_GROUP = "plugin-users";

    @ComponentImport
    private final UserManager userManager;

    @Inject
    public AccessServiceImpl(UserManager userManager) {
        this.userManager = userManager;
    }

    @Override
    public boolean hasAccess() {
        return userManager.getRemoteUser() != null;
    }

    @Override
    public boolean isUser() {
        return userManager.isUserInGroup(userManager.getRemoteUserKey(), USER_GROUP);
    }
}
