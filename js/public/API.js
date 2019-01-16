/**********************
*******2018.7.17*******
*******   page  *******
**********************/

var API = new importAPI();

function importAPI () {
	var _self = this;
	var requestDomain = "https://color.beats-digital.com/Api/Handler.ashx?method=";

	function _Ajax(opts){
	    icom.loadingShow();

	    $.ajax({
	        type: 'POST',
	        url: requestDomain + opts.API,
	        dataType: 'json',
	        async: true,
	        data: opts.data,
	        success: function(data){
	        	icom.loadingHide();
		        if (opts.Type) {
		            if (opts.onSuccess) opts.onSuccess(data);
		        } else {
		            if (data.errcode == 0) {
		                if (opts.onSuccess) opts.onSuccess(data.result);
		            } else {
		                alert(data.errmsg)
		            }
		        }
	        },
	        error: function(){
	        	alert("网络可能存在问题，请刷新试试！");
	        }
	    });
	}

	/**
	 * 获取队伍列表
	 */
	_self.getTeamList = function(onSuccess){
		_Ajax({
            API:"GetColor",
            data:{},
            onSuccess:onSuccess
        });
	}//end func

	/**
	 * 修改队伍名称
	 */
	_self.changeTeamName = function(data,onSuccess){
		_Ajax({
            API:"UpdateNameColor",
            data:data,
            onSuccess:onSuccess
        });
	}//end func

	/**
	 * 修改队伍分数
	 */
	_self.changeTeamScore = function(data,onSuccess){
		_Ajax({
            API:"UpdateCount",
            data:data,
            onSuccess:onSuccess
        });
	}//end func
}//end import