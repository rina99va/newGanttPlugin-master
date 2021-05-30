package com.atlassian.plugin.rest;

import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.plugin.model.TaskModel;
import com.atlassian.plugin.service.ProjectService;
import com.atlassian.plugin.service.TaskService;
import org.springframework.web.bind.annotation.RequestParam;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/task")
public class TaskRest {

    private final TaskService taskService;
    private final ProjectService projectService;
//    private final Long projectId;

    @Inject
    public TaskRest(TaskService taskService, ProjectService projectService) {
        this.taskService = taskService;
        this.projectService = projectService;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/getAllTasks")
    public List<TaskModel> getAllTasks() throws SearchException {
        return taskService.getAllTasks();
    }
//    public Response getAllTasks(@QueryParam("id") Long id) throws SearchException {
////        return taskService.getAllTasks(id);
//        return Response.ok(taskService.getAllTasks(id)).build();
//    }

//    @GET
//    @Produces(MediaType.APPLICATION_JSON)
//    @Path("/getAllTasks")
//    public List<TaskModel> getAllTasks(@Context HttpServletRequest request) throws SearchException {
//        int id = Integer.parseInt(request.getParameter("id"));
//        long idL = id;
//        Long idLL = idL;
//        return taskService.getAllTasks(idL);
////        List<TaskModel> taskModels = new ArrayList<>();
////        return taskModels;
//    }
}
