const uri = new URL(window.location.href)
const projectId = uri.searchParams.get("projectId")

 $(() => getAllTasks(projectId))


function getAllTasks(projectId) {
    jQuery.ajax({
                    type: "GET",
                    data: { "projectId": projectId },
                    url: "/jira/rest/gantt/1.0/task/getAllTasks",
                    dataType: "json",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(errorThrown)
                    },
                    success: function (data) {
                        fillTableForTasks(data)
                    }
                })
}

function buildGantt() {
    window.location.href="http://localhost:2990/jira/secure/newGanttPlugin2!default.jspa?projectId=" + projectId
}

function fillTableForTasks(tasks) {
    var dataGrid = $("#gridContainer-tasks").dxDataGrid({
        dataSource: tasks,
        columnsAutoWidth: true,
        showBorders: true,
        // focusedRowEnabled: true,
        // focusedRowKey: 1,
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: "Поиск..."
        },
        headerFilter: {
            visible: true
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data" && e.rowIndex % 2 === 0) {
                e.rowElement.css("background-color", "#bfbfbf58");
            }
        },
        columns: [
            {
                caption: "ID задачи",
                dataField: "id",
                width: 80,
                allowHeaderFiltering: true,
                allowSearch: false
            },{
                caption: "Статус задачи",
                dataField: "status",
                width: 200,
                allowHeaderFiltering: true,
                allowSearch: false
            }, {
                caption: "Название задачи",
                dataField: "title",
                width: 200,
                allowHeaderFiltering: false,
                headerFilter: {
                    allowSearch: true
                }
            }, {
                caption: "Дата создания",
                dataField: "start",
                width: 200,
                headerFilter: {
                    allowSearch: false
                }
            }, {
                caption: "Дата завершения",
                dataField: "end",
                width: 200,
                headerFilter: {
                    allowSearch: false
                }
            }, {
                caption: "Автор",
                dataField: "author",
                width: 80,
                headerFilter: {
                    allowSearch: false
                }
            }, {
                caption: "Связанные задачи",
                dataField: "issueLinks",
                width: 80,
                headerFilter: {
                    allowSearch: false
                }
            }
            // }, {
            //     type: "buttons",
            //     buttons: [{
            //         text: "Подробнее",
            //         onClick: function (e) {
            //             var bookId = e.row.data.id
            //             window.location.href = '/confluence/library/book-info.action?id=' + bookId;
            //         }
            //     }]
            // }
        ]
    }).dxDataGrid('instance');


    // console.log(tasks)
    // console.log(books1)

    var applyFilterTypes = [{
        key: "auto",
        name: "Immediately"
    }, {
        key: "onClick",
        name: "On Button Click"
    }];

    var applyFilterModeEditor = $("#useFilterApplyButton").dxSelectBox({
        items: applyFilterTypes,
        value: applyFilterTypes[0].key,
        valueExpr: "key",
        displayExpr: "name",
        onValueChanged: function (data) {
            dataGrid.option("filterRow.applyFilter", data.value);
        }
    }).dxSelectBox("instance");

    // $("#notShowAttributes").dxCheckBox({
    //     text: "Отключить показ атрибутов",
    //     value: true,
    //     onValueChanged: function (data) {
    //                 dataGrid.clearFilter();
    //                 dataGrid.option("filterRow.visible", data.value);
    //                 applyFilterModeEditor.option("disabled", !data.value);
    //             }
    // })

    // $("#filterRow").dxCheckBox({
    //     text: "Filter Row",
    //     value: true,
    //     onValueChanged: function (data) {
    //         dataGrid.clearFilter();
    //         dataGrid.option("filterRow.visible", data.value);
    //         applyFilterModeEditor.option("disabled", !data.value);
    //     }
    // });
    //
    // $("#headerFilter").dxCheckBox({
    //     text: "Header Filter",
    //     value: true,
    //     onValueChanged: function (data) {
    //         dataGrid.clearFilter();
    //         dataGrid.option("headerFilter.visible", data.value);
    //     }
    // });
}