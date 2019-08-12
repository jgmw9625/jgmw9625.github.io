// 抓網址?= 之後的ID
var urlcut = {
    getParameterByName : function(url){
        var regex, results;
        if (!url){  
            url = decodeURI(window.location.href);
        }
        regex = new RegExp('=([0-9 a-z A-Z \u4e00-\u9fa5]+)');
        results = regex.exec(url);
        //console.log(results)
        return results[1];
    }
}
var a;
var URLRouteID = urlcut.getParameterByName();
//console.log(URLRouteID);
var text = "", data = "", control = false;
var Busroute_Content = document.querySelector('.Busroute_Content');
var Busroute_Content_Bustext = document.getElementsByClassName('Busroute_Content_Bustext')[0];
var Busroute_Content_Bus1text = document.getElementsByClassName('Busroute_Content_Bus1text')[0];
var url_busStopOfRoute = `https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/Taichung/${URLRouteID}?$top=300&$format=JSON`;
var url_busRealTimeNearstop = `https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/City/Taichung/${URLRouteID}?$top=300&$format=JSON`;
var url_busEstimatedTimeOfArrival = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Taichung/${URLRouteID}?$top=1000&$format=JSON`;
var Busstop, item_bustime;
// 公車路線渲染
function renderingRoute(data){
    //console.log('公車路線', data);
    for(var i = 0; i < data.length; i++){
        if(data[i].RouteName.Zh_tw == URLRouteID){
            for(var j = 0; j < data[i].Stops.length; j++ ){
                switch(data[i].Direction){
                    case 0: var item_line = document.createElement('div');
                            item_line.className = "item_line_go";
                            Busroute_Content_Bustext.appendChild(item_line);
                            var item = document.createElement('div');
                            item.className = `id${data[i].Stops[j].StopID}0`;
                            Busroute_Content_Bustext.appendChild(item);
                            text =
                            `
                            <div class="Busroute_Content_Bus ${data[i].Stops[j].StopID}${data[i].Direction}${data[i].Stops[j].StopSequence}"></div>
                            <ul>
                            <li>${data[i].Stops[j].StopName.Zh_tw}</li>
                            </ul>
                            `
                            item.innerHTML = text;
                            break;
                    case 1: var item_line = document.createElement('div');
                            item_line.className = "item_line_back";
                            Busroute_Content_Bus1text.appendChild(item_line);
                            var item = document.createElement('div');
                            item.className = `id${data[i].Stops[j].StopID}1`;
                            Busroute_Content_Bus1text.appendChild(item);
                            text =
                            `
                            <div class="Busroute_Content_Bus1 ${data[i].Stops[j].StopID}${data[i].Direction}${data[i].Stops[j].StopSequence}"></div>
                            <ul>
                                <li>${data[i].Stops[j].StopName.Zh_tw}</li>
                            </ul>
                            `
                            item.innerHTML = text;
                            break;
                }
                if(data.length == 1){
                    document.querySelector('#backroute').classList.add('hide');
                }
            }
        }     
    }
}
// 公車路線 api && 渲染
function busStopOfRoute(url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = a = function(){
        if(this.readyState === 4 && this.status === 200){
            data = JSON.parse(this.responseText);
            //console.log("路線:", data);
            renderingRoute(data);
            return data;
        }
    }
}

// 當前公車位置
function busRealTimeNearstop(url){
    var xhr1 = new XMLHttpRequest();
    xhr1.open('GET', url, true);
    xhr1.send();
    xhr1.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            xhr1.onload = function(){
                var data1 = JSON.parse(this.responseText);
                //console.log("當前公車位置", data1); // 測試數據是否正確
                for(var i = 0; i < data1.length; i++){
                    if(data1[i].RouteName.Zh_tw == URLRouteID && data1[i].StopSequence != 1){
                        switch(data1[i].Direction){
                            case 0: var item = document.getElementsByClassName(`${data1[i].StopID}0${data1[i].StopSequence}`)[0];
                                    item.className += ` bus_site`;
                                    item.innerHTML = "";
                                    //console.log(data1[i]);
                                    switch(data1[i].A2EventType){
                                        case 0: text =
                                                `<i class="fa fa-bus" style="font-size:36px;"></i>`
                                                item.innerHTML += text;
                                                break;
                                        case 1: text =
                                                `<i class="fa fa-bus" style="font-size:36px;"></i>`
                                                item.innerHTML += text;
                                                break;
                                    }
                                    break;
                            case 1: var item = document.getElementsByClassName(`${data1[i].StopID}1${data1[i].StopSequence}`)[0];
                                    item.className += ` bus_site`;
                                    item.innerHTML = "";
                                    //console.log(data1[i]);
                                    switch(data1[i].A2EventType){
                                        case 0: text =
                                                `<i class="fa fa-bus" style="font-size:36px;"></i>`
                                                item.innerHTML += text;
                                                break;
                                        case 1: text =
                                                `<i class="fa fa-bus" style="font-size:36px;"></i>`
                                                item.innerHTML += text;
                                                break;
                                    }
                                    break;
                        }
                    }
                }
            }
        }
    }
}
// 公車預估到站時間
function busEstimatedTimeOfArrival(url){
    var xhr2 = new XMLHttpRequest();
    xhr2.open('GET', url, true);
    xhr2.send();
    xhr2.onload = function(){
        var data2 = JSON.parse(this.responseText);
        //console.log("預估到站時間", data2); // 測試數據是否正確
        for(var i = 0; i < data2.length; i++){
            if(data2[i].EstimateTime != null && data2[i].RouteName.Zh_tw == URLRouteID && data2[i].StopSequence != 1){
                var EstimateTime = data2[i].EstimateTime/60;
                Busstop = document.getElementsByClassName(`${data2[i].StopID}${data2[i].Direction}${data2[i].StopSequence}`)[0];
                if(Busstop != undefined){
                    Busstop.innerHTML = "";
                    item_bustime = document.createElement('p');
                    item_bustime.className = `id${data2[i].StopID}`;
                    Busstop.appendChild(item_bustime);
                    text =
                    `${EstimateTime}分`
                    item_bustime.innerHTML = text;
                } 
            }
            if(data2[i].EstimateTime == null && data2[i].RouteName.Zh_tw == URLRouteID){
                Busstop = document.getElementsByClassName(`${data2[i].StopID}${data2[i].Direction}${data2[i].StopSequence}`)[0];
                Busstop.innerHTML = "";
                item_bustime = document.createElement('p');
                Busstop.appendChild(item_bustime);
                text =
                `過站`
                item_bustime.innerHTML = text;
                }    
            
        }
    }
    control = true;
}
busStopOfRoute(url_busStopOfRoute);
var setIntervalbusStopOfRoute;
var Busroute_Top_Btn = document.getElementById('Busroute_Top_Btn');
var Busroute_Top_Btn_off = document.getElementById('Busroute_Top_Btn_off');

// button => 公車動態
function busNowTimeBtn(){
    Busroute_Top_Btn.classList.add('hide');
    Busroute_Top_Btn_off.classList.remove('hide');
    setTimeout(function(){
        busRealTimeNearstop(url_busRealTimeNearstop);
    },300)
    busEstimatedTimeOfArrival(url_busEstimatedTimeOfArrival);
    setIntervalbusStopOfRoute = setInterval(function(){
        // 第二次後重新渲染路線
        if(control == true ){
            //window.clearInterval(setIntervalbusStopOfRoute);
            // 重新渲染路線
            Busroute_Content_Bustext.innerHTML ="";
            Busroute_Content_Bus1text.innerHTML = "";
            renderingRoute(data);
        }
        setTimeout(function(){
            busRealTimeNearstop(url_busRealTimeNearstop);
        },300)
        busEstimatedTimeOfArrival(url_busEstimatedTimeOfArrival);
        console.log('HI');
        }
    , 1000 * 10)
}
function busNowTimeBtnOff(){
    window.clearInterval(setIntervalbusStopOfRoute);
    Busroute_Top_Btn.classList.remove('hide');
    Busroute_Top_Btn_off.classList.add('hide');
    Busroute_Content_Bustext.innerHTML ="";
    Busroute_Content_Bus1text.innerHTML = "";
    renderingRoute(data);
}
