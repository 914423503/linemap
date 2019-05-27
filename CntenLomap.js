/**
 * Created by Administrator on 2019-04-12.
 */
var CntenLomap = function(mapOption){
    mapOption.ImgUrl={
        //本地地图
        mapDz: mapOption.baseUrl+'gis/list?T=beijing_e_19&L={z}&X={x}&Y={y}',
        mapWx: mapOption.baseUrl+'gis/list?T=hainan_e_19&L={z}&X={x}&Y={y}',
        //在线地图
        //	mapDz: 'http://mt{0-3}.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil', //电子地图
        //  mapWx: 'http://mt{0-3}.google.cn/vt/lyrs=s@142&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil', //卫星地图
    }
    mapOption.flag = {
        mapDz: true
    };
    mapOption.mapZoomLevel = 11;
    mapOption.resolutionValue = 0.100220972;
    if(!mapOption.lng){
        mapOption.lng = 116.417492;
    };
    if(!mapOption.lat){
        mapOption.lat = 39.916927;
    };
    /*鹰眼*/
    var overviewMap = new ol.control.OverviewMap({ view: new ol.View({ projection: 'EPSG:4326' }) });

    /*比例尺*/
    var scaleLineControl = new ol.control.ScaleLine();
    var url = mapOption.ImgUrl.mapDz;
    /*底图*/
    var baseLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({ url: url, wrapX: false })
    });
    /*父级图层 iconVector*/
    var iconSource = new ol.source.Vector({
        wrapX: false
    });
    var iconVector = new ol.layer.Vector({
        source: iconSource
    });

    /*新建图标图层 iconVector*/
    this.circleSource = new ol.source.Vector({
        wrapX: false
    });
    this.circleVector = new ol.layer.Vector({
        source: this.circleSource
    });
    this.init = function(){
        if(!mapOption.baseUrl){
            alert("请设置底图服务器");
            return;
        }
        /****************************地图map加载***************************************/
        map = new ol.Map({
            interactions: ol.interaction.defaults({
                doubleClickZoom: false
            }),
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }).extend([overviewMap, scaleLineControl]),
            layers: [baseLayer, iconVector, this.circleVector],
            allOverlays: true,
            target: document.getElementById("map"),

            view: new ol.View({
                center: [ mapOption.lng,  mapOption.lat],
                projection: 'EPSG:4326',
                zoom: mapOption.mapZoomLevel,
                maxZoom: 17,
                minZoom: 11
            })
        });

        /****************************鼠标点击事件******************************************/
        map.on('singleclick', function(evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature) {
                    return feature;
                });
            if(feature){
                if(feature.cusData.click && $.isFunction(feature.cusData.click)){
                    feature.cusData.click(evt,feature);
                }
            }
        });
        /****************************鼠标移动事件：触到要素变鼠标指针******************************************/
        map.on('pointermove', function(e) {

        });
        /****************************地图放大缩小 改变分辨率与层级时触发的事件******************************************/
        map.getView().on('change:resolution', function() {

        });
    };

    this.drowPoint = function(point){
        //画点
        this.circleSource.addFeature(point.feature);
        point.feature.cusData = point;
    };
};
CntenLomap.CLASS_NAME = "CntenLomap";


var CntenPoint = function(option){
    this.lat = option.lat;
    this.lng = option.lng;
    this.src = option.src;
    this.styles = option.styles;
    this.title = option.title;
    this.click = option.click;

    var x2 = Number(Convert_BD09_To_GCJ02_lng(this.lat, this.lng));
    var y2 = Number(Convert_BD09_To_GCJ02_lat(this.lat, this.lng));
    var geom = new ol.geom.Point(ol.proj.transform([x2, y2], 'EPSG:4326', 'EPSG:4326'));
    this.feature = new ol.Feature({ geometry: geom, iconName: this.title, iconType: 65, iconLng: this.lng, iconLat: this.lat });
    var iconStyles = createPointStyles(this.src, undefined,this.title,this.feature.getGeometry());
    this.feature.setStyle(iconStyles);
    if(this.styles){
        this.feature.setStyle(this.styles);
    }

};
CntenPoint.CLASS_NAME = "CntenPoint";




/****************************百度坐标与谷歌坐标的转换***********************************************/
function Convert_BD09_To_GCJ02_lat(lat, lng) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng - 0.0065;
    var y = lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var lat = z * Math.sin(theta);
    return lat;
}
function Convert_BD09_To_GCJ02_lng(lat, lng) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng - 0.0065;
    var y = lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var lng = z * Math.cos(theta);
    return lng;
}

function createPointStyles(src, img,title,geometry) {
    var textstyle = new ol.style.Style({
        geometry: geometry,
        text: new ol.style.Text({
            text: title,
            font: 'bold 16px SimHei,sans-serif',
            fill: new ol.style.Fill({
                color: '#3295f0'
            }),
            offsetX: 15,
            textAlign: 'left',
            stroke: new ol.style.Stroke({
                color: '#efefef',
                width: 1
            })
        })
    });
   var imageStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.96],
            crossOrigin: 'anonymous',
            src: src,
            img: img,
            imgSize: img ? [img.width, img.height] : undefined
        }))
    });
    return [textstyle,imageStyle];
}
