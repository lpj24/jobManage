$(function() {

	
	var utils = {
		getSession: function(key) {
			var returnResult = window.sessionStorage.getItem(key);
			if(returnResult === null) {
				return [];
			}else{
				return JSON.parse(returnResult);
			}
			
		},
		
		setSession: function(key, value) {
			window.sessionStorage.setItem(key, JSON.stringify(value));
		},
		appendSession: function(key, value) {
			var returnResult = window.sessionStorage.getItem(key);
			if(returnResult === null) {
				window.sessionStorage.setItem(key, JSON.stringify(value));
			}else{
				returnResult = JSON.parse(returnResult);
				returnResult = returnResult.concat(value);
				window.sessionStorage.setItem(key, JSON.stringify(returnResult));
			}

		},
		
		clearSession: function() {
			window.sessionStorage.clear();
		}
	}

	$(".updateJob").text("更新前1天");

	if($("#updateAllRecordNum").text() <= 0) {
		$("#updateAllRecord").attr("disabled", "disabled");
	}else{
		$("#updateAllRecord").attr("disabled", false);
	}
	
	var updateBatchList = utils.getSession("batchList");
	$("#batchNum").text(updateBatchList.length);
	
	
	$(".executeDay").change(function() {
		var jobDays = $(this).val();
		var rowIndex = this.parentNode.parentNode.rowIndex;
		$(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(7) > button" ).text("更新前" + jobDays + "天");
	})
	var trList = $("#allJobTable").children("tr");
	$("#allJobTable tr").each(function() {
		var renewable = $(this).children("td").eq(5).text();
		if(parseInt(renewable) === 0) {
			$(this).children("td").eq(7).children(".updateJob").attr('disabled',"true");
			$(this).children("td").eq(7).children(".updateJob").text('禁用');
		}else{
			var executeDay = $(this).children("td").eq(6).children(".executeDay").val();
			$(this).children("td").eq(7).children(".updateJob").text('更新前' + executeDay + "天");
		}
	})
	

	$(".updateJob").on("click", function() {
        rowIndex = this.parentNode.parentNode.rowIndex;
        var jobName = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(0)" ).text();
        var jobPath = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(1)" ).text();
        var jobDoc = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(2)" ).text();
        var jobTable = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(3)" ).text();
        var jobType = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(4)" ).text();
        var renewable = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(5)" ).text();
        var jobDay = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(6) > select" ).val();
        var btn = $(this);
        btn.attr("disabled", true);
        btn.text("更新中……");
		$.ajax({
			method: 'post',
			url: '/hbgj/v1/dayJob',
			dataType:"json",
			data: {
				"tableName": jobTable, 
				"jobName": jobName,
				"jobPath": jobPath,
				"jobType": jobType,
				"executeDay": jobDay,
			}
		}).done(function(data) {
			setTimeout(function() {
				btn.attr("disabled", false);
				btn.text("更新前" + jobDay + "天")
			}, 1000);
			
		})
	});
	
	//批量更新记录
	
	$(".batchUpdate").on("click", function() {
		var batchList = new Array();
        rowIndex = this.parentNode.parentNode.rowIndex;
        var jobName = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(0)" ).text();
        var jobPath = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(1)" ).text();
        var jobDoc = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(2)" ).text();
        var jobTable = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(3)" ).text();
        var jobType = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(4)" ).text();
        var renewable = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(5)" ).text();
        var jobDay = $(".table-hover tr:eq(" + rowIndex + ")" + " td:eq(6) > select" ).val();
        var batchObj = {
        		jobName: jobName,
        		jobPath: jobPath,
        		jobDoc: jobDoc,
        		jobTable: jobTable,
        		jobType: jobType,
        		renewable: renewable,
        		jobDay: jobDay
        }
        batchList.push(batchObj);
        utils.appendSession("batchList", batchList)
        $("#batchNum").text(utils.getSession("batchList").length);
	});
	
	$("#batchQuery").on("click", function() {
//		$("#allJobTable tr:not(:first)").html("");
		var i = 0
		var newBatchList = utils.getSession("batchList");
		$(".table-hover tr:eq(" + 0 + ")" + " th:eq(4)" ).text("");
		$(".table-hover tr:eq(" + 0 + ")" + " th:eq(5)").text("");
		$(".table-hover tr:eq(" + 0 + ")" + " th:eq(6)").text("");
		for(i; i< newBatchList.length; i++) {
			var j = i + 1;
			if($(".table-hover tr:eq(" + j + ")" + " td:eq(0)" ).html() === undefined) {
				var td1 = "<td>" + newBatchList[i].jobName +"</td>"
				var td2 = "<td>" + newBatchList[i].jobPath +"</td>"
				var td3 = "<td>" + newBatchList[i].jobDoc +"</td>"
				var td4 = "<td>" + newBatchList[i].jobTable +"</td>"
				var td5 = "<td style='display:none;'>" + newBatchList[i].jobType +"</td>"
				var td6 = "<td style='display:none;'>" + newBatchList[i].renewable +"</td>"
				
				
				$(".table-hover tr:eq(" + j + ")" + " td:eq(6)" ).html("");
				$(".table-hover tr:eq(" + j + ")" + " td:eq(7)").html("");
				$(".table-hover tr:eq(" + j + ")" + " td:eq(8)").html("");
				
				$(".table-hover").append("<tr>" + td1 + td2 + td3 + td4 + td5 + td6 + "</tr>")
			}else {
				$(".table-hover tr:eq(" + j + ")" + " td:eq(0)" ).html(newBatchList[i].jobName);
				$(".table-hover tr:eq(" + j + ")" + " td:eq(1)" ).html(newBatchList[i].jobPath);
				$(".table-hover tr:eq(" + j + ")" + " td:eq(2)" ).html(newBatchList[i].jobDoc);
				$(".table-hover tr:eq(" + j + ")" + " td:eq(3)" ).html(newBatchList[i].jobTable);
				$(".table-hover tr:eq(" + j + ")" + " td:eq(4)" ).html(newBatchList[i].jobType);
				$(".table-hover tr:eq(" + j + ")" + " td:eq(5)" ).html(newBatchList[i].renewable);
				
				$(".table-hover tr:eq(" + j + ")" + " td:eq(6)" ).html("");
				$(".table-hover tr:eq(" + j + ")" + " td:eq(7)").html("");
				$(".table-hover tr:eq(" + j + ")" + " td:eq(8)").html("");
			}


		}
		
		$("#updateAllRecordNum").text($("#batchNum").text());
		if($("#updateAllRecordNum").text() >= 1) {
			$("#updateAllRecord").attr("disabled", false);
		}

		$("#allJobTable tr:gt(" + (i) + ")").remove();
	})
	
	//点击更新全部记录
	$("#updateAllRecord").on("click", function() {
		var updateAllRecordList = [];
		var jobDay = $("#updateAllRecordDay").val();
		$("#allJobTable tr:gt(0)").each(function() {
			var jobName = $(this).children("td").eq(0).text();
			var jobPath = $(this).children("td").eq(1).text();
			var jobDoc = $(this).children("td").eq(2).text();
			var jobTable = $(this).children("td").eq(3).text();
			var jobType = $(this).children("td").eq(4).text();
			var renewable = $(this).children("td").eq(5).text();
			var newRecordObj = {
	        		"jobName": jobName,
	        		"jobPath": jobPath,
	        		"jobDoc": jobDoc,
	        		"jobTable": jobTable,
	        		"jobType": jobType,
	        		"renewable": renewable,
	        		"jobDay": jobDay
			}

			if(renewable == 1) {
				updateAllRecordList.push(newRecordObj);
			} 
			 
		})

		$.ajax({
			method: 'post',
	  		url: '/hbgj/v1/updateAllRecord',
			dataType:"json",
			contentType : 'application/json;charset=utf-8',
			data: JSON.stringify(updateAllRecordList),
			beforeSend: function() {
				$("#updateAllRecord").button('loading');
			},
			complete: function() {
				$("#updateAllRecord").button('reset');
//				utils.clearSession();
			},
			error: function() {
				$("#updateAllRecord").button('reset');
			}
		})
	})
	
	
	//双击记录条更新某个时间段的所有数据, 如更新2017-08-01至2017-08-10之间所有的数据
	$("tr:gt(0)").hover(function() {
		$(this).attr("style", "cursor:pointer");
	});
	
	
	$("tr:gt(0)").dblclick(function() {
        var jobTable = $(".table-hover tr:eq(" + this.rowIndex + ")" + " td:eq(3)" ).text();
        var jobDoc = $(".table-hover tr:eq(" + this.rowIndex + ")" + " td:eq(2)" ).text();
        var jobId = $(".table-hover tr:eq(" + this.rowIndex + ")" + " td:eq(6)" ).text();
        alert(jobId);
		$('#myModal').modal('show');
		$('.modal-title').text("更新" + jobTable + "表(" + jobDoc + ")" + "以下时间段所有的数据");
		$('#moreJobId').val(jobId);
	})
	
	
		
    $('.queryDate').datetimepicker({
        format: 'yyyy-mm-dd',
        minView: "month",
        language: 'zh-CN',
        autoclose: 1,
        todayBtn: true,
        pickerPosition: 'bottom-left'
    });


    var today = moment().format('YYYY-MM-DD');
    var lastDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    $('.queryDate').datetimepicker('setEndDate', today);

    $("#startDate_val").val(lastDate);
    $("#endDate_val").val(today);
    
    // 将要更新时间段的任务
    $("#joinMoreTimeJob").click(function() {
    	$.ajax({
			method: 'post',
			url: '/hbgj/v1/addMoreTimeJob',
			dataType:"json",
			data: {
				"jobId": $('#moreJobId').val(), 
				"startDate": $("#startDate_val").val(),
				"endDate": $("#endDate_val").val()
			}
		});
    	
    	$('#myModal').modal('toggle');
    })
})


