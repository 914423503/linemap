var map = null;
(function() {
    var pathStr = "http://192.168.1.79:3000/";
    var bashPath = $("#bashPath").val();
    if(bashPath!=null && bashPath!=""){
        pathStr = bashPath;
    }
    var mapOption = {
        baseUrl:pathStr,
        lng:116.417492,
        lat:39.916927
    };
    var cntenMap = new CntenLomap(mapOption);
    cntenMap.init();
    var cntenPoint = new CntenPoint({
        lat:39.978214,
        lng:116.31889,
        src:'images/zhiRed.png',
        title:"测试",
        click:function(event,feature){
            alert(feature.cusData.title);
        }
    });
    cntenMap.drowPoint(cntenPoint);
})();