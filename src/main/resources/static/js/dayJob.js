$(function() {
	
	$(".updateJob").text("更新前1天");

	if($("#updateAllRecordNum").text() <= 0) {
		$("#updateAllRecord").attr("disabled", "disabled");
	}
	
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
	
	//昨日未更新记录
	$("#last_update").on("click", function() {
		$("#updateAllRecordNum").text($("#lastNum").text())
		if($("#updateAllRecordNum").text() >= 1) {
			$("#updateAllRecord").attr("disabled", false);
		}
		
	})
	
	//批量更新记录
	var batchList = new Array()
	$(".batchUpdate").on("click", function() {
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
        
        $("#batchNum").text(batchList.length);
	});
	
	$("#batchQuery").on("click", function() {
//		$("#allJobTable tr:not(:first)").html("");
		var i = 0
		
		$(".table-hover tr:eq(" + 0 + ")" + " th:eq(4)" ).text("");
		$(".table-hover tr:eq(" + 0 + ")" + " th:eq(5)").text("");
		$(".table-hover tr:eq(" + 0 + ")" + " th:eq(6)").text("");
		for(i; i< batchList.length; i++) {
			var j = i + 1;
			
			$(".table-hover tr:eq(" + j + ")" + " td:eq(0)" ).text(batchList[i].jobName);
			$(".table-hover tr:eq(" + j + ")" + " td:eq(1)" ).text(batchList[i].jobPath);
			$(".table-hover tr:eq(" + j + ")" + " td:eq(2)" ).text(batchList[i].jobDoc);
			$(".table-hover tr:eq(" + j + ")" + " td:eq(3)" ).text(batchList[i].jobTable);
			$(".table-hover tr:eq(" + j + ")" + " td:eq(4)" ).text(batchList[i].jobType);
			$(".table-hover tr:eq(" + j + ")" + " td:eq(5)" ).text(batchList[i].renewable);

			
			$(".table-hover tr:eq(" + j + ")" + " td:eq(6)" ).text("");
			$(".table-hover tr:eq(" + j + ")" + " td:eq(7)").text("");
			$(".table-hover tr:eq(" + j + ")" + " td:eq(8)").text("");
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
			},
			error: function() {
				$("#updateAllRecord").button('reset');
			}
		})
	})
	
})