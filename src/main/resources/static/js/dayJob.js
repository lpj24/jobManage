$(function() {
	
	$(".updateJob").text("更新前1天");
	
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
			method: 'PATCH',
			url: '/v1/dayJob',
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
	})
})