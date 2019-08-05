var bus_item = document.getElementsByClassName('bus_item')[0];
var data ="", Text = "";;
var renderingBusRoute = function(data){
    for(var i = 0; i < data.length; i++){
        var item = document.createElement('div');
        item.className = 'bus_item_route';
        item.id = `id${data[i].RouteID}`;
        bus_item.appendChild(item);
        Text = 
        `<li id='li${data[i].RouteID}'>
            <p><a href="bus_route.html?=${data[i].RouteName.Zh_tw} ">路線 : ${data[i].RouteName.Zh_tw}</a></p>
            <p>起點 : ${data[i].DepartureStopNameZh}</p>
            <p>終點 : ${data[i].DestinationStopNameZh}</p>
        </li>`
        item.innerHTML = Text;
    }   
}
// 公車之路線資料 api
var url_BusRoute = "https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taichung?$top=500&$format=JSON";
var xhr1 = new XMLHttpRequest();
xhr1.open('GET', url_BusRoute, true);
xhr1.send();
xhr1.onload = function() {
    data = JSON.parse(this.responseText);     
    //console.log(data);
    renderingBusRoute(data);
}   
// 查詢
var bus_title_text = document.querySelector('.bus_title_text');
document.querySelector('.bus_title_button').addEventListener('click', searchBusRoute, false);
var control = true;
function searchBusRoute(){
    // bus_title_text_input = 輸入的路線號
    var bus_title_text_input = bus_title_text.value;
    // 測試是否輸入正確
    //console.log(bus_title_text_input);
    var busitem = document.getElementsByClassName('bus_item')[0];
    var bus = document.getElementsByClassName('bus')[0];
    console.log(data);
    // 重新渲染
    if(control){
        control = false;
        bus.removeChild(busitem);
    }
        for(var i = 0; i < data.length; i++){   
            if(bus_title_text_input == data[i].RouteName.Zh_tw){
                var item = document.createElement('div');
                item.className = 'bus_item';
                bus.appendChild(item);
                Text = 
                `<div class="bus_item_route">
                    <li id='li${data[i].RouteName.Zh_tw}'>
                    <p><a href="bus_route.html?=${data[i].RouteName.Zh_tw} ">路線 : ${data[i].RouteName.Zh_tw}</a></p>
                        <p>起點 : ${data[i].DepartureStopNameZh}</p>
                        <p>終點 : ${data[i].DestinationStopNameZh}</p>
                    </li>
                </div>`
                item.innerHTML = Text;
                control = true;
            }
            if(bus_title_text_input === ""){
                renderingBusRoute(data);
            }
        }  
    }

    // 參考http://ptx.transportdata.tw/PTX