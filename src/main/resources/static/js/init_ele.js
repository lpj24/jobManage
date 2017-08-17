$(function() {

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
    

})


