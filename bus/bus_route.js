// 抓網址?= 之後的ID
var urlcut = {
    getParameterByName : function(url){
        var regex, results;
        if (!url){
            url = window.location.href;
        }
        regex = new RegExp('(=([^\w]+)$)');
        //console.log(regex)
        results = regex.exec(url);
        //console.log(results)
        return results[2];
    }
}
var URLRouteID = urlcut.getParameterByName();
var List = "", data = "", control = false;
var Busroute_Content = document.querySelector('.Busroute_Content');
var Busroute_Content_Bus = document.getElementsByClassName('Busroute_Content_Bus')[0];
var Busroute_Content_Bus1 = document.getElementsByClassName('Busroute_Content_Bus1')[0];
var Busroute_Content_Bustext = document.getElementsByClassName('Busroute_Content_Bustext')[0];
var Busroute_Content_Bus1text = document.getElementsByClassName('Busroute_Content_Bus1text')[0];
var url_busStopOfRoute = `https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/Taichung/${URLRouteID}?$top=300&$format=JSON`;
var url_busRealTimeNearstop = `https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/City/Taichung/${URLRouteID}?$top=300&$format=JSON`;
var url_busEstimatedTimeOfArrival = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Taichung/${URLRouteID}?$top=1000&$format=JSON`;
// 公車路線 api && 渲染
function busStopOfRoute(url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            data = JSON.parse(this.responseText);
            //console.log("路線:", data);
            renderingRoute(data);
        }
    }
}
// 公車路線渲染
function renderingRoute(data){
    for(var i = 0; i < data.length; i++){
        if(data[i].SubRouteID == URLRouteID && data[i].RouteID == URLRouteID){
            for(var j = 0; j < data[i].Stops.length; j++ ){
                switch(data[i].Direction){
                    case 0: var item = document.createElement('div');
                            item.className = `Direction${data[i].Direction} id${data[i].Stops[j].StopID}0`;
                            Busroute_Content_Bus.appendChild(item);
                            var item2 = document.createElement('div');
                            item2.className = `id${data[i].Stops[j].StopID}0`;
                            Busroute_Content_Bustext.appendChild(item2);
                            List =
                            `<ul>
                                <li>${data[i].Stops[j].StopName.Zh_tw}</li>
                            </ul>`
                            item2.innerHTML = List;
                            //item.innerHTML = List;
                            break;
                    case 1: var item = document.createElement('div');
                            item.className = `Direction${data[i].Direction} id${data[i].Stops[j].StopID}1`;
                            Busroute_Content_Bus1.appendChild(item);
                            var item2 = document.createElement('div');
                            item2.className = `id${data[i].Stops[j].StopID}1`;
                            Busroute_Content_Bus1text.appendChild(item2);
                            List =
                            `<ul>
                                <li>${data[i].Stops[j].StopName.Zh_tw}</li>
                            </ul>`
                            item2.innerHTML = List;
                            //item.innerHTML = List;
                            break;
                }
            }
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
                    if(data1[i].SubRouteID == URLRouteID && data1[i].StopSequence != 1){
                        switch(data1[i].Direction){
                            case 0: var item = document.getElementsByClassName(`id${data1[i].StopID}0`)[0];
                                    item.className += ` bus_site`;
                                    //console.log(data1[i]);
                                    switch(data1[i].A2EventType){
                                        case 0: List =
                                                `<li>已離站</li>`
                                                item.innerHTML += List;
                                                break;
                                        case 1: List =
                                                `<li>進站中</li>`
                                                item.innerHTML += List;
                                                break;
                                    }
                                    break;
                            case 1: var item = document.getElementsByClassName(`id${data1[i].StopID}1`)[0];
                                    item.className += ` bus_site`;
                                    //console.log(data1[i]);
                                    switch(data1[i].A2EventType){
                                        case 0: List =
                                                `<li>已離站</li>`
                                                item.innerHTML += List;
                                                break;
                                        case 1: List =
                                                `<li>進站中</li>`
                                                item.innerHTML += List;
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
            if(data2[i].EstimateTime != null && data2[i].RouteID == URLRouteID){
                var EstimateTime = data2[i].EstimateTime/60;
                var Busstop = document.querySelector(`.id${data2[i].StopID}${data2[i].Direction}`);
                if(Busstop != undefined){
                    //Busstop.removeChild();
                    var item_bustime = document.createElement('p');
                    item_bustime.className = `id${data2[i].StopID}`;
                    Busstop.appendChild(item_bustime);
                    List =
                    `${EstimateTime}分鐘`
                    item_bustime.innerHTML = List;
                }    
            }
            else{
                var Busstop = document.querySelector(`.id${data2[i].StopID}${data2[i].Direction}`);
                var item_bustime = document.createElement('p');
                Busstop.appendChild(item_bustime);
                List =
                `過站`
                item_bustime.innerHTML = List;
            }
        }
    }
    control = true;
}
busStopOfRoute(url_busStopOfRoute);
var setIntervalbusStopOfRoute;
var Busroute_Top_Btn = document.getElementsByClassName('Busroute_Top_Btn')[0];
var Busroute_Top_Btn_off = document.getElementsByClassName('Busroute_Top_Btn_off')[0];
// button => 公車動態
function busNowTimeBtn(){
    Busroute_Top_Btn.className = 'Busroute_Top_Btn hide';
    Busroute_Top_Btn_off.className = 'Busroute_Top_Btn_off';
    busRealTimeNearstop(url_busRealTimeNearstop);
    busEstimatedTimeOfArrival(url_busEstimatedTimeOfArrival);
    setIntervalbusStopOfRoute = setInterval(function(){
        // 第二次後重新渲染路線
        if(control == true ){
            //window.clearInterval(setIntervalbusStopOfRoute);
            // 重新渲染路線
            Busroute_Content_Bus.innerHTML ="<br>";
            Busroute_Content_Bus1.innerHTML = "<br>";
            Busroute_Content_Bustext.innerHTML = "<h1>去程路線</h1><br>";
            Busroute_Content_Bus1text.innerHTML = "<h1>反程路線</h1><br>";
            renderingRoute(data);
        }
        busRealTimeNearstop(url_busRealTimeNearstop);
        busEstimatedTimeOfArrival(url_busEstimatedTimeOfArrival);
        console.log('HI');
        }
    , 1000 * 300)
}
function busNowTimeBtnOff(){
    window.clearInterval(setIntervalbusStopOfRoute);
    Busroute_Top_Btn.className = 'Busroute_Top_Btn';
    Busroute_Top_Btn_off.className = 'Busroute_Top_Btn_off hide';
    Busroute_Content_Bus.innerHTML ="<br>";
    Busroute_Content_Bus1.innerHTML = "<br>";
    Busroute_Content_Bustext.innerHTML = "<h1>去程路線</h1><br>";
    Busroute_Content_Bus1text.innerHTML = "<h1>反程路線</h1><br>";
    renderingRoute(data);
}