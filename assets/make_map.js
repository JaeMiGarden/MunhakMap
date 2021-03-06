//기본 홈페이지의 맵을 만드는 js 모듈입니다

var mapContainer = document.getElementById('map');
var positions = [];
var mapOption = {
    center: new kakao.maps.LatLng(37.553916,126.938895),
    level:1
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

//마커를 묶을 클러스터 구현
var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    minLevel: 2 // 클러스터 할 최소 지도 레벨 
});

$(document).ready(function(){$.ajax({        
    async : false,
    type : "GET",
    url : "/api/totalBoard",
    success : function(res) {
        res.map((a)=>{
            var label = document.createElement('label');
            label.innerHTML = 
            `<img classs = "bd-placeholder-img card-img-top" src="../uploads/${a.image}"></img>
                <div class="popup-body">
                    <a href=/board/read/${a._id}>${a.title}</a>
                </div>`

            if(!a.latitude || !a.longitude){
                var latlng = new kakao.maps.LatLng(0.0,0.0);
                positions.push({
                    content: label,
                    latlng : latlng
                });
            }
            else {
                var latlng = new kakao.maps.LatLng(a.latitude, a.longitude);

                positions.push({
                    content: label,
                    latlng :latlng
                });
            } 
        })
    markerMaker();
}});
});

function markerMaker(){
    
    for (var i = 0; i < positions.length; i++) {
        var marker = new kakao.maps.Marker({
            map, // 마커를 표시할 지도
            position: positions[i].latlng // 마커의 위치
        });

        var infowindow = new kakao.maps.InfoWindow({
            content: positions[i].content // 인포윈도우에 표시할 내용
        });
        
        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(marker, infowindow));
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(marker, infowindow));
        clusterer.addMarker(marker);
    }            
}                

function makeOverListener(marker, infowindow){
    return function() {
        infowindow.open(map, marker);
    }
}

function makeOutListener(marker, infowindow){
    return function() {
        infowindow.close();
    }
}