var loadedData

$(() => {
        const uri = new URL(window.location.href)
        const projectId = uri.searchParams.get("projectId")

        makeRequest(projectId)
    }
)

function goToTaskPage() {
    window.location.href="http://localhost:2990/jira/secure/newGanttPlugin3!default.jspa?projectId=" + projectId
}

function reverse() {
    // console.log(loadedData)
    // loadedData.tasks.reverse()
    // loadedData.resourceAssignments.reverse()
    // drawGantt(loadedData)
    loadedData.tasks.sort(function (a, b) {
        return a.id - b.id
    })

    loadedData.resourceAssignments.sort(function (a, b) {
        return a.id - b.id
    })

    drawGantt(loadedData)
}

function sort() {
    loadedData.tasks.sort(function (a, b) {
         return b.id - a.id
    })
    loadedData.resourceAssignments.sort(function (a, b) {
        return b.id - a.id
    })
    drawGantt(loadedData)
}

// function byAuthor() {
//     loadedData.tasks.sort(function (a, b) {
//         var authorA = a.author.toLowerCase();
//         var authorB = b.author.toLowerCase();
//
//         if (authorA < authorB) return -1;
//         if (authorB < authorA) return 1;
//         return 0
//     })
// }

function makeRequest(projectId) {
    jQuery.ajax(
        {
            dataType: "json",
            type: 'get',
            data: { "projectId": projectId },
            url: AJS.contextPath() + '/rest/gantt/1.0/task/getAllTasks',
            async:false
        }
    ).done(function(data) {

        const allData = getDataNormal(data, -1)

        loadedData = allData

        drawGantt(allData)
    });
}

function drawGantt(allData) {
        const gantt = $("#gantt").dxGantt({
            taskTitlePosition: "outside",
            taskStatusPosition: "outside",
            taskAuthorPosition: "outside",
            scaleType: "months",
            tasks: {
                dataSource: allData.tasks
            },
            resources: {
                dataSource: resources
            },
            resourceAssignments: {
                dataSource: allData.resourceAssignments
            },
            validation: {
                autoUpdateParentTasks: true,
                validateDependencies: true
            },
            editing: {
                enabled: true
            },
            loadPanel: {
                enabled: true
            },
            toolbar: {
                items: [
                "undo",
                "redo",
                "separator",
                "collapseAll",
                "expandAll",
                "separator",
                "zoomIn",
                "zoomOut",
                    // {
                    //     widget: "dxButton",
                    //     options: {
                    //         text: "addTask",
                    //         icon: "add new task",
                    //         stylingMode: "text",
                    //         onClick: function () {
                    //             popupInstance.show();
                    //         }
                    // }
            ]
            },

            columns: [{
                dataField: "title",
                caption: "Название",
                width: 300,
            }, {
                dataField: "start",
                caption: "Дата начала"
            }, {
                dataField: "end",
                caption: "Срок Исполнения"
            }],
            taskListWidth: 600,
            taskTooltipContentTemplate: getTaskTooltipContentTemplate
        }).dxGantt("instance");

        $("#scaleType").dxSelectBox({
            items: [
                "auto",
                "minutes",
                "hours",
                "days",
                "weeks",
                "months",
                "quarters",
                "years"
            ],
            value: "months",
            onValueChanged: function (e) {
                gantt.option("scaleType", e.value);
            }
        });

        $("#titlePosition").dxSelectBox({
            items: [
                "inside",
                "outside",
                "none"
            ],
            value: "outside",
            onValueChanged: function (e) {
                gantt.option("taskTitlePosition", e.value);
            }
        });

        $("#showResources").dxCheckBox({
            text: "Show Statuses",
            value: true,
            onValueChanged: function (status) {
                gantt.option("showResources", status.value);
            }
        });

        $("#customizeTaskTooltip").dxCheckBox({
            text: "Customize Task Tooltip",
            value: true,
            onValueChanged: function (e) {
                e.value ? gantt.option("taskTooltipContentTemplate", getTaskTooltipContentTemplate)
                    : gantt.option("taskTooltipContentTemplate", undefined);
            }
        });

        function getTaskTooltipContentTemplate(task, container) {
            var timeEstimate = Math.abs(task.start - task.end) / 36e5;
            var timeLeft = Math.floor((100 - task.progress) / 100 * timeEstimate);

            var $customTooltip = $(document.createElement("div"))
                .addClass("custom-task-edit-tooltip");

            $(document.createElement("div"))
                .addClass("custom-tooltip-title")
                .text(task.author)
                .appendTo($customTooltip);
            $(document.createElement("div"))
                .addClass("custom-tooltip-row")
                .text("Estimate: " + timeEstimate + " hours")
                .appendTo($customTooltip);
            $(document.createElement("div"))
                .addClass("custom-tooltip-row")
                .text("Left: " + timeLeft + " hours")
                .appendTo($customTooltip);

            return $customTooltip;
        }


        $(document.querySelectorAll('.dx-treelist-text-content').forEach(function(item){$(item).html($(item).text())}))
        }

/**
 author: "admin"
 end: "2021-05-24 00:00:00.0"
 id: 10000
 start: "2021-05-23 15:06:56.0"
 status: "In Progress"
 title: "Запустить эту хрень"
 */

function getDataNormal(jsonArray, parentId) {
    const tasks = []
    const resourceAssignments = []

    const resourcesMapping = {
            'New': 1,
            'Completed': 2,
            'In Progress': 3,
            '': 4,
            'admin': 5
    }

    for (const item of jsonArray) {
        const now = new Date()
        const afterWeek = new Date()
        afterWeek.setDate(now + 7)

        const safeDate = ((s) => {
            if (!s) return undefined
            try {
                return new Date(s)
            } catch (e) {
                return new Date()
            }
        })

        var start = safeDate(item.start)
        var end = safeDate(item.end)
        if (!start && end) {
            start = new Date()
            start.setTime(end.getTime() - 7)
        } else if (start && !end) {
            end = new Date()
            end.setDate(start.getDate() + 7)
        } else if (!start && !end) {
            start = new Date()
            end = new Date()
            end.setDate(start.getTime() + 7)
        }

        console.log(start + " " + end)

        tasks.push(
            {
                'id': item.id,
                'parentId': item.parentId ? item.parentId : parentId,
                'title': item.title ? item.title : '',
                'start': start,
                'end': end,
                'progress': item.progress ? item.progress : 0,
                'author': item.author,
                'status': item.status
            }
        )

        resourceAssignments.push(
            {
                'id': item.id,
                'taskId': item.id,
                'resourceId': resourcesMapping[item.status]
            }
        )

        if (item.childs) {
            const childs = getData(item.childs, item.id)

            tasks.push(childs.tasks)
            resourceAssignments.push(childs.resourceAssignments)
        }
    }

    return {
        'tasks': tasks,
        'resourceAssignments': resourceAssignments
    }
}

var resources = [
    {
        'id': 1,
        'text': 'New'
    }, {
        'id': 2,
        'text': 'Completed'
    }, {
        'id': 3,
        'text': 'In Progress'
    }, {
        'id': 4,
        'text': ''
    }, {
        'id': 5,
        'text': 'admin'
    }]

var dependencies = [{
    "id": 1,
    "predecessorId": 3,
    "successorId": 4,
    "type": 0
}, {
    "id": 2,
    "predecessorId": 4,
    "successorId": 5,
    "type": 0
}, {
    "id": 3,
    "predecessorId": 5,
    "successorId": 6,
    "type": 0
}]

function addTask() {
    jQuery.ajax(
        {
            dataType: "json",
            url: `http://localhost:8080/rest/api/2/issue/createmeta`,
            type: 'post',
            // data: {"projectId": projectId},
            responseType: 'json',
            headers: {
                // Authorization: authorization,
                'Content-Type': 'application/json'
            },
            json: {
                update: {},
                fields: {
                    project:
                        {
                            "id": projectId
                        },
                    summary: "New Task",
                    description: "Creating of an issue using IDs for projects and issue types using the REST API",
                    issuetype: {
                        "id": projectId
                    }
                }
            }
        })
}


// var statuses = [
//     {
//         'id': 1,
//         'text': 'New'
//     }, {
//         'id': 2,
//         'text': 'Completed'
//     }, {
//         'id': 3,
//         'text': 'In Progress'
//     }, {
//         'id': 4,
//         'text': ''
//     }]
//
// var authors = [
//     {
//         'id': 1,
//         'text': 'admin'
//     }
// ]

function downloadPDF() {
    const { jsPDF } = window.jspdf;

    var pdf = new jsPDF();

    // var sizeY = $('#gantt').innerHeight();
    // var sizeX = $('#gantt').innerWidth();

    // canvas.height = $('#gantt').innerHeight();
    // canvas.width = $('#gantt').innerWidth();

    html2canvas($('#gantt'), {
        onrendered: function (canvas) {
            var img = canvas.toDataURL("image/jpeg", 1.0);
            // $('#ganttToPDF').html("");
            // $('#ganttToPDF').append(canvas);
            pdf.addImage(img, 'JPEG', 0, 0, 210, 70);
            pdf.save("gantt.pdf")
        }
    });
}






