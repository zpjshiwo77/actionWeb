$(document).ready(function(){
	//变量的定义
	var iswiper;
	var ws;
	var iaudio;
	var nowMusic = 0;

	//页面初始化
	function pageInit(){
		loadInit();
		eventBind();
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
		swiperInit();
		wsInit();
		musicInit();
		updateTeam();
	}//end func

	//事件绑定
	function eventBind(){

	}//end func

	/**
	 * 更新队伍
	 */
	function updateTeam(){
		API.getTeamList(function(data){
			renderTeam(data);
		})
	}

	/**
	 * 渲染队伍
	 */
	function renderTeam(data){
		var cont = "";
		for (var i = 0; i < data.length; i++) {
			var team = data[i];
			cont += `<div class="team">
						<div class="name">${team.Name}</div>
						<div class="color" style="background-color: ${team.Color};"></div>
						<div class="score">${team.Count}</div>
					</div>`;
		}
		$(".rightBox").empty().append(cont);
	}

	/**
	 * ws初始化
	 */
	function wsInit(){
		ws = new WS({ link: 'ws://ws.be-xx.com/api/ws.ashx', channel: "2019012077",callback:dealInfo});
	}

	/**
	 * 处理信息
	 */
	function dealInfo(data){
		if(data == "prev"){
			iswiper.slidePrev(1000);
		}
		else if(data == "next"){
			iswiper.slideNext(1000);
		}
		else if(data == "play"){
			iaudio.play();
		}
		else if(data == "pause"){
			iaudio.pause();
		}
		else if(data == "nextSong"){
			nextSong();
		}
		else if(data == "prevSong"){
			prevSong();
		}
		else if(data == "updateTeam"){
			updateTeam();
		}
	}

	/**
	 * 滑动初始化
	 */
	function swiperInit(){
		iswiper = new Swiper('.swiper-container', {
			direction: 'vertical'
		});
		// iswiper.slideNext(1000);
	}

	/**
	 * 音乐初始化
	 */
	function musicInit(){
		iaudio = $("#iaudio")[0];
	}

	/**
	 * 下一首歌
	 */
	function nextSong(){
		nowMusic++;
		if(nowMusic < imusic.length){
			var music = imusic[nowMusic];
			iaudio.src = music.src;
			iaudio.play();
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
			iaudio.src = music.src;
			iaudio.play();
		}
		else nowMusic = 0;
	}
		
});//end ready