$(function() {

	//点击显示协议弹窗
	$(".agreement-btn").on("tap", function() {
		$(".agreement-winpop-container").show();
	});

	//点击关闭协议弹窗
	$(".agreement-long-btn").on("click", function() {
		$(".agreement-winpop-container").hide();
	});

	//表单验证
	var ValCheck = {
		flag: true,
		isSuccess: false, //判断极验验证是否成功
		countDown: 180, //180秒倒计时
		wechatId: $("#js-wechat-id"),
		userName: $("#js-user-name"),
		userNameVal: /^[\u4e00-\u9fa5a-zA-Z]{1,5}$/, //飞行员代号正则
		bingPhoneReg: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/, //手机号 正则
		maxSection: $("#js-max-section"),
		bindPhone: $(".phone-bind-input"),
		codeVal: $(".this-code-input"),
		signCheckbox: $('.sign-checkbox'),
		val: function() {
			if(this.wechatId.val() === "") {
				dialog("请填写您的微信号");
			} else if(this.userName.val() === "") {
				dialog("请填写飞行员代号");
			} else if(this.maxSection.text() === "请选择您所达到的最高段位") {
				dialog("请选择您所达到的最高段位");
			} else if(this.bindPhone.val() === "") {
				dialog("请填写手机号码");
			} else if(this.codeVal.val() === "") {
				dialog("请填写验证码");
				//dialog("验证码填写错误");
			} else if(!this.signCheckbox.prop("checked")) {
				dialog("请同意飞行员线上合作协议");
			}

			if(this.userName.val().length > 0 && this.userName.val().match(this.userNameVal) === null) {
				dialog("飞行员代号不能超过5个汉字");
			}
		},
		setTime: function(obj) {
			var _this = this;
			if(this.countDown === 0) {
				obj.prop("disabled", false);
				obj.html("发送验证码").removeClass("phone-bind-active-btn");
				this.countDown = 180;
				this.flag = true;
				return;
			} else {
				if(this.bindPhone.val() === "") {
					dialog("请填写手机号码");
					this.flag = false;
					return;
				} else {
					obj.prop("disabled", true);
					obj.html("已发送(" + this.countDown + 's' + ")").addClass("phone-bind-active-btn");
					this.countDown--;
					this.flag = false;
				}
			}
			setTimeout(function() {
				_this.setTime(obj);
			}, 1000);
		}
	};

	//提交申请
	$(".sign-btn").on("click", function(e) {
		ValCheck.val();
		e.stopPropagation();
	});

	//发送验证码
	$(".phone-bind-btn").on("click", function(e) {
		if(ValCheck.isSuccess) {
			if(ValCheck.bindPhone.val().match(ValCheck.bingPhoneReg) === null) {
				dialog("请输入有效的手机号码");
			} else if(ValCheck.flag) {
				ValCheck.setTime($(this));
			}
		}
		e.stopPropagation();
	});

	$.ajax({
		// 获取id，challenge，success（是否启用failback）
		url: "gt3-php-sdk-master/web/StartCaptchaServlet.php?t=" + (new Date()).getTime(), // 加随机数防止缓存
		type: "get",
		dataType: "json",
		success: function(data) {
			// 使用initGeetest接口
			// 参数1：配置参数
			// 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
			initGeetest({
				gt: data.gt,
				challenge: data.challenge,
				width: "4.2rem",
				product: "bind", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
				offline: !data.success // 表示用户后台检测极验服务器是否宕机，与SDK配合，用户一般不需要关注
			}, handlerPopup);
		}
	});

	// 代码详细说明
	var handlerPopup = function(captchaObj) {
		var phoneBindBtn = $(".phone-bind-btn");
		phoneBindBtn.click(function(e) {
			e.stopPropagation();
			// 调用之前先通过前端表单校验
			//验证成功回调
			captchaObj.onSuccess(function() {
				if(ValCheck.flag) {
					ValCheck.setTime(phoneBindBtn);
				}
				ValCheck.isSuccess = true;

			});

			// 先校验是否点击了验证码
			var validate = captchaObj.getValidate();
			if(!validate) {
				if(ValCheck.bindPhone.val().match(ValCheck.bingPhoneReg) === null) {
					dialog("请输入有效的手机号码");
				} else {
					captchaObj.verify();
					return;
				}
			}
		});
	};

});
(function($, doc) {
	$.init();
	$.ready(function() {
		/**
		 * 获取对象属性的值
		 * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
		 * @param {Object} obj 对象
		 * @param {String} param 属性名
		 */
		//级联示例
		var maxPicker = new $.PopPicker();
		maxPicker.setData([{
			value: "1",
			text: "最强王者50星以上"
		}, {
			value: "2",
			text: "最强王者30-50星"
		}, {
			value: "3",
			text: "最强王者1-30星"
		}, {
			value: "4",
			text: "最强王者1-10星"
		}]);
		var showFlyPickerButton = doc.getElementById('js-max-section');

		showFlyPickerButton.addEventListener('click', function(event) {
			maxPicker.show(function(items) {
				showFlyPickerButton.innerText = items[0].text;
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		}, false);
	});
})(mui, document);