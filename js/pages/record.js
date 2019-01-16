$(document).ready(function(){
	//变量的定义
	var loginBox = $("#loginBox");
	var choseBox = $("#choseBox");
	var pptBox = $("#pptBox");
	var musicBox = $("#musicBox");
	var changeNameBox = $("#changeNameBox");
	var changeScoreBox = $("#changeScoreBox");

	var ws;
	var nowMusic = 0;

	//页面初始化
	function pageInit(){
		loadInit();
		eventBind();
		getTeamList();
	}//end func
	pageInit();

	//加载图片
	function loadInit(){
		var loader = new PxLoader();
		loader.addImage('images/templete/test.jpg');
		
		icom.loadingShow();
		loader.addCompletionListener(function() {
			pageShow();
			icom.loadingHide();
			loader=null;
		});
		loader.start();	
	}//end func

	//页面显示
	function pageShow(){

	}//end func

	//事件绑定
	function eventBind(){
		$("#enter").on("click",enterRoom);

		$("#choseBox .btn").on("click",enterPage);

		$("#pptBox .btn").on("click",changePPT);

		$("#musicBox .btn").on("click",changeMusic);

		$("#changeNameBox .box").on("click",".btn",changeTeamName);
		$("#changeNameBox .back").on("click",function(){
			changePage(changeNameBox,choseBox);
		});

		$("#changeScoreBox .box").on("click",".btn",changeTeamScore);
		$("#changeScoreBox .back").on("click",function(){
			changePage(changeScoreBox,choseBox);
		});
	}//end func

	/**
	 * 获取队伍列表
	 */
	function getTeamList(){
		API.getTeamList(function(data){
			renderTeam(data);
			renderScore(data);
		})
	}

	/**
	 * 渲染队伍
	 */
	function renderTeam(data){
		var cont = "";
		var colors = ["rgb(0,151,72)","rgb(22,65,102)","rgb(234,136,192)","rgb(134,82,160)","rgb(246,122,70)","rgb(214,184,75)","#ffffff","#333333"];
		var teamnames = ["绿队","蓝队","粉队","紫队","橙队","黄队","白队","黑队"];
		for (var i = 0; i < data.length; i++) {
			var team = data[i];
			cont += `<div class="block">
						<div class="color" style="background-color: ${team.Color};"></div>
						<input type="text" value="${team.Name}">
						<div class="btn" data-id="${team.ID}" data-val="${team.Color}">修改</div>
					</div>`;
		}
		changeNameBox.find(".box").empty().append(cont);
	}

	/**
	 * 渲染分数
	 * @param {*} data 
	 */
	function renderScore(data){
		var cont = "";
		for (var i = 0; i < data.length; i++) {
			var team = data[i];
			cont += `<div class="block">
						<div class="btn" data-id="${team.ID}" data-val="-5">-5</div>
						<div class="btn" data-id="${team.ID}" data-val="-1">-1</div>
						<div class="color" style="background-color: ${team.Color};"></div>
						<div class="name">${team.Name}</div>
						<div class="socre">${team.Count}</div>
						<div class="btn" data-id="${team.ID}" data-val="1">+1</div>
						<div class="btn" data-id="${team.ID}" data-val="5">+5</div>
					</div>`;
		}
		changeScoreBox.find(".box").empty().append(cont);
	}

	/**
	 * 修改队伍名称
	 */
	function changeTeamName(){
		var that = $(this);
		var data = {
			ID:that.attr("data-id"),
			Name:that.siblings("input").val(),
			Color:that.attr("data-val")
		}

		API.changeTeamName(data,function(){
			alert("修改成功");
			ws.Send("updateTeam");
		})
	}

	/**
	 * 修改队伍分数
	 */
	function changeTeamScore(){
		var that = $(this);
		var nameBox = that.siblings(".name");
		var socreBox = that.siblings(".socre");
		var socre = parseInt(socreBox.text())+parseInt(that.attr("data-val"));
		socre = socre < 0 ? 0 : socre;
		var data = {
			ID:that.attr("data-id"),
			Count:socre
		};

		confirm("你确定要给"+nameBox.text()+""+that.text()+"分吗？",function(bool){
			if(bool){
				API.changeTeamScore(data,function(){
					socreBox.html(socre);
					alert("成功");
					ws.Send("updateTeam");
				});
			}
		})
	}

	/**
	 * 加入房间
	 */
	function enterRoom(){
		var roomId = $("#psw").val();
		if(roomId == "2019012077"){
			ws = new WS({ link: 'ws://ws.be-xx.com/api/ws.ashx', channel: roomId,callback:dealInfo});
			changePage(loginBox,choseBox);
		}
		else alert("别来捣乱了~");
	}

	/**
	 * 处理信息
	 */
	function dealInfo(data){
		if(data == "updateTeam"){
			getTeamList();
		}
	}

	/**
	 * 进入页面
	 */
	function enterPage(){
		var box = $(this).attr("data-val");
		changePage(choseBox,$("#"+box));
		if(box == "changeNameBox" || box == "changeScoreBox") getTeamList();
	}

	/**
	 * 改变页面
	 * @param {*} prev 
	 * @param {*} next 
	 */
	function changePage(prev,next){
		prev.fadeOut();
		next.fadeIn();
	}

	/**
	 * 修改ppt
	 */
	function changePPT(){
		var val = $(this).attr("data-val");
		if(val == "back"){
			changePage(pptBox,choseBox);
		}
		else{
			ws.Send(val);
		}
	}

	/**
	 * 修改歌曲
	 */
	function changeMusic(){
		var val = $(this).attr("data-val");
		if(val == "back"){
			changePage(musicBox,choseBox);
		}
		else if(val == "prev"){
			prevSong();
			ws.Send("prevSong");
		}
		else if(val == "control"){
			if($(this).text() == "播放"){
				$(this).html("暂停")
				ws.Send("play");
			}
			else{
				$(this).html("播放")
				ws.Send("pause");
			}
		}
		else if(val == "next"){
			nextSong();
			ws.Send("nextSong");
		}
	}

	/**
	 * 下一首歌
	 */
	function nextSong(){
		nowMusic++;
		if(nowMusic < imusic.length){
			var music = imusic[nowMusic];
			$("#musicBox p").html(music.name);
			$("#musicBox .control").html("暂停")
		}
		else nowMusic = imusic.length - 1;
	}

	/**
	 * 上一首歌
	 */
	function prevSong(){
		nowMusic--;
		if(nowMusic >= 0){
			var music = imusic[nowMusic];
			$("#musicBox p").html(music.name);
			$("#musicBox .control").html("暂停")
		}
		else nowMusic = 0;
	}
});//end ready