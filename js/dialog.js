//提示框自动消失
//调用时要阻止冒泡
var idx = 1;
function dialog(text) {
	$(".win-dialog-container").remove();
	var winDialogContainer = $("<div class='win-dialog-container fadeInUp'></div>");
	var winDialog = $("<div class='win-dialog'></div>");
	var winDialog_class_ID = "add-" + idx;
	winDialogContainer.addClass(winDialog_class_ID);
	var body = $("body");

	winDialog.text(text);
	winDialogContainer.append(winDialog);
	body.append(winDialogContainer);

	window.setTimeout(function() {
		$('.' + winDialog_class_ID).remove();
	}, 3000);
	idx++;
	
	return false;
}
$(document).on("click",function() {
	$('.win-dialog-container').remove();
});
//解决ios下document不触发点击的bug
$("body").children().click(function () {});