$(function() {
	$("input:button, button").button();
	$("#btnGo").button("disable");
	$("#tabpane").tabs();
	$("#preview_pane").tabs();
	$("#m_preview_pane").tabs();
	
	$("#dp_end").datepicker({
		showAnim: 'fadeIn',
		autoSize: false,
		dateFormat: 'yy-mm-dd',
		minDate: 0
	});
	$("#error_pane").hide();
	
	$("#result_pane").dialog("destroy");
	$("#result_pane").dialog({
		height: 280,
		width: 495,
		modal: true,
		autoOpen: false,
		hide: 'explode',
		resizable: false,
		draggable: false
	});

	$("#closebtn").click(function() { $("#result_pane").dialog("close"); });
	
	$("#accordion").accordion({heightStyle: "content"});
});

$(window).load(function() {
	setTimeout(function(){
		$("#btnGo").button("enable");
		$("#btnGo").val('立即前往 » ');
	}, 0);
});


// 送出表單資料
function gen_short_url(){
	var url = encodeURIComponent($('#origin_url').val());
	var pass = encodeURIComponent($('#password').val());
	var comment = encodeURIComponent($('#comment').val());
	var dp_end = encodeURIComponent($('#dp_end').val());
	var allowed_url = encodeURIComponent($('#allowed_url').val());
	var cp_name = encodeURIComponent($('#cp_name').val());
	
	//utm
	var utm_source = encodeURIComponent($('#utm_source').val()),
		utm_medium = encodeURIComponent($('#utm_medium').val()),
		utm_term   = encodeURIComponent($('#utm_term').val()),
		utm_content= encodeURIComponent($('#utm_content').val()),
		utm_campaign = encodeURIComponent($('#utm_campaign').val());
	
	if(url.length == 0 || url.length <= 5){
		show_error_message('這個網址好像有問題?');
		return;
	}
	alert(url);
	alert(pass);
	alert(comment);
	alert(dp_end);
	alert(allowed_url);
	alert(cp_name);
	alert(utm_source);
	alert(utm_medium);
	alert(utm_term);
	alert(utm_content);
	alert(utm_campaign);
	
	
	/*$.ajax({
		type: "POST",
		url: "ajax.php?func=gen",
		dataType: "json",
		data: "url=" + url + "&password=" + pass + "&comment=" + comment + "&dp_end=" + dp_end + '&allowed_url=' + allowed_url + '&cp=' + cp_name 
				+ '&utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_term=' + utm_term + '&utm_content=' + utm_content 
				+ '&utm_campaign=' + utm_campaign,
		success: function(json){
			var status_code = json[0];
			
			if(status_code ==0){
				show_error_message(json[2]);
			}else{
				
				$("#result_pane").dialog("open");		
				$("#short_url").text(json[1]);
				$('#qr_img').attr('src', 'qr/' + json[1].substring(json[1].lastIndexOf('/')+1) + '.jpg');
				$('#qr_img_url').val( 'http://' + window.location.hostname + window.location.pathname + 'qr/' + json[1].substring(json[1].lastIndexOf('/')+1) + '.jpg');
				$('#password').val('');
				$('#comment').val('');
				$('#dp_end').val('');
				$('#allowed_url').val('');

			}
		}
	});*/
}


$(document).ready(function() {
	
	$('#target_thumb_pic').load(function(){	
	
		var thumbnail_width = $('#target_thumb_pic').width() * 1;
		var thumbnail_height = $('#target_thumb_pic').height() * 1;
		
		
		
		var thumb_max_width = 165;
		var thumb_max_height = 165;
		var resize_per = 1;
		
		

		// 取縮圖比例：以較長的邊作為計算依據
		
		if (thumbnail_width >= thumbnail_height){		// 圖片較寬
			resize_per = (thumbnail_width > thumb_max_width) ? thumb_max_width / thumbnail_width : thumbnail_width / thumb_max_width;
		}else if (thumbnail_height > thumbnail_width){	// 圖片較長
			resize_per = (thumbnail_height > thumb_max_height) ? thumb_max_height / thumbnail_height : thumbnail_height / thumb_max_height;    
		}
		
		// 如果縮圖比原始範圍大，等比縮圖
		if (thumbnail_width > thumb_max_width) {
			$("#target_thumb_pic").width(thumbnail_width*resize_per + 'px');
			$("#target_thumb_pic").height(thumbnail_height*resize_per + 'px');
		}else if (thumbnail_height > thumb_max_height) {
			$("#target_thumb_pic").width(thumbnail_width*resize_per + 'px');
			$("#target_thumb_pic").height(thumbnail_height*resize_per + 'px');
		}
		
	});
	
	$('#target_thumb_pic').error(function(){
		$("#target_thumb_pic").attr("src", 'images/preview.gif');
		
	});
	
	$('a#copy_btn').zclip({
		path:'./script/jquery/js/zericlipborad/ZeroClipboard.swf',
		copy:function(){return $('#short_url').text();}
	});

});

function show_error_message(message){
	$("#error_pane").show('drop', {}, 'normal', callback);
	$("#errormsg").text(message);
}

function callback(){
	setTimeout(
		function(){
			$("#error_pane:visible").fadeOut('slow');
		}, 3000);
}

function auth_check(){
	var url = encodeURIComponent($('#url_key').val());
	var pass = encodeURIComponent($('#pass').val());
	
	$.ajax({
		type: "POST",
		url: "ajax.php?func=auth",
		dataType: "json",
		data: "url=" + url + "&pass=" + pass,
		success: function(json){
			var status_code = json[0];
			
			if(status_code == 0){
				show_error_message('喔喔!! 這個密碼不對囉!!');
			}else{
				location.href=json[1];
			}
			
			return;
		}
	});
}

function go_url(url, safe_url_flag, utm_source, utm_medium, utm_term, utm_content, utm_campaign){
	var url_parameters = '';
	utm_source = (utm_source);
	utm_medium = (utm_medium);
	utm_term = (utm_term);
	utm_content = (utm_content);
	utm_campaign = (utm_campaign);
	
	if(utm_source.trim().length > 0) {
		console.log("OKK");
		if (url.indexOf('?') == -1)
			url += '?utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_term=' + utm_term + '&utm_content=' + utm_content + '&utm_campaign=' + utm_campaign;
		else
			url += '&utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_term=' + utm_term + '&utm_content=' + utm_content + '&utm_campaign=' + utm_campaign;
	}
	

	if (safe_url_flag == '0'){
		location.href = url;
	}else if(safe_url_flag == '1' || safe_url_flag == '3'){
		if (confirm('這是一個危險的網站，你確定要去嗎？')) location.href = url;
	}else if(safe_url_flag == '2'){
		if (confirm('我們無法確認這個網站是否安全，你確定要去嗎？')) location.href = url;
	}
}

function font_adjust(url){
	if(url.value.length >= 24 && url.value.length < 48){
		url.style.fontSize = '21px';
	}else if(url.value.length >= 48){
		url.style.fontSize = '16px';
	}
}

jQuery(document).ready(function($){
	$("a").mouseover(function(e){
		this.myTitle = this.title;
		
		if(this.myTitle.length == 0) return;
		
		this.myHref = this.href;
		this.myHref = (this.myHref.length > 50 ? this.myHref.toString().substring(0,50)+"..." : this.myHref);
		this.title = "";
		var floattitle = "<div id='floattitle'><p>"+this.myTitle+"</p></div>";
		$('body').append(floattitle);
		$('#floattitle').css({"opacity":"0.9","top":(e.pageY+20)+"px","left":(e.pageX+10)+"px"}).show('fast');
		
	}).mouseout(function(){this.title = this.myTitle;$('#floattitle').remove();
	}).mousemove(function(e){$('#floattitle').css({"top":(e.pageY+20)+"px","left":(e.pageX+10)+"px"});
	});

	
	$("img[class='notify_icon']").mouseover(function(e){
		this.myTitle = this.title;
		
		if(this.myTitle.length == 0) return;

		this.title = "";
		var floattitle = "<div id='floattitle'><p>"+this.myTitle+"</p></div>";
		$('body').append(floattitle);
		$('#floattitle').css({"opacity":"0.9","top":(e.pageY+20)+"px","left":(e.pageX+10)+"px"}).show('fast');
		
	}).mouseout(function(){this.title = this.myTitle;$('#floattitle').remove();
	}).mousemove(function(e){$('#floattitle').css({"top":(e.pageY+20)+"px","left":(e.pageX+10)+"px"});
	});
	
	
	$("img[class='security_flag']").mouseover(function(e){
		this.myTitle = this.title;
		
		if(this.myTitle.length == 0) return;

		this.title = "";
		var floattitle = "<div id='floattitle'><p>"+this.myTitle+"</p></div>";
		$('body').append(floattitle);
		$('#floattitle').css({"opacity":"0.9","top":(e.pageY+20)+"px","left":(e.pageX+10)+"px"}).show('fast');
		
	}).mouseout(function(){this.title = this.myTitle;$('#floattitle').remove();
	}).mousemove(function(e){$('#floattitle').css({"top":(e.pageY+20)+"px","left":(e.pageX+10)+"px"});
	});
	
});
