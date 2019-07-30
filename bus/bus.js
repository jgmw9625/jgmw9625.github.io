var ID = 0;
var bus_item = document.getElementsByClassName('bus_item')[0];
// 公車之路線資料 api
var data ="";
var url1 = "https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taichung?$top=500&$format=JSON";
var xhr1 = new XMLHttpRequest();
xhr1.open('GET', url1, true);
xhr1.send();
xhr1.onload = function() {
    data = JSON.parse(this.responseText);     
    console.log(data);
    var List = "";
    for(var i = 0; i < data.length; i++){
        var item = document.createElement('div');
        item.className = 'bus_item_route';
        item.id = `id${data[i].RouteID}`;
        bus_item.appendChild(item);
        List = 
        `<li id='li${data[i].RouteID}'>
            <a href="bus_route.html?=${data[i].RouteID} ">路線 : ${data[i].RouteID}</a>
            <p>起點站 : ${data[i].DepartureStopNameZh}</p>
            <p>終點站 : ${data[i].DestinationStopNameZh}</p>
        </li>`
        item.innerHTML = List;
    }         
}   
// 查詢
var search = document.querySelector('.search');
document.querySelector('.bus_item1_button').addEventListener('click', searchBus, false);
var control = true;
function searchBus(){
    // searchinput = 輸入的路線號
    var searchinput = search.value;
    // 測試是否輸入正確
    //console.log(searchinput);
    var busitem = document.getElementsByClassName('bus_item')[0];
    var bus = document.getElementsByClassName('bus')[0];
    console.log(data);
    // 重新渲染
    if(control){
        control = false;
        bus.removeChild(busitem);
    }
        for(var i = 0; i < data.length; i++){
            if(searchinput == data[i].RouteID){
                var item = document.createElement('div');
                item.className = 'bus_item';
                bus.appendChild(item);
                List = 
                `<div class="bus_item_route">
                    <li id='li${data[i].RouteID}'>
                        <a href="bus_route.html?=${data[i].RouteID} ">${data[i].RouteID}</a>
                        <p>起點站 : ${data[i].DepartureStopNameZh}</p>
                        <p>終點站 : ${data[i].DestinationStopNameZh}</p>
                    </li>
                </div>`
                item.innerHTML = List;
                control = true;
            } 
        }  
    }