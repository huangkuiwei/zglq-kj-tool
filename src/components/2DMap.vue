<template>
  <div class="map-container">
    <div v-if="showNearList" class="nearList">
      <div v-for="(item,index) in nearList" @click="nearClick(item)" class="list-item" :class="{'active':item.act}" :key="index">
        <div class="name">{{ item.name }}</div>
        <div class="address">{{ item.address }}</div>
      </div>
    </div>
    <div id="container" style="width: 100%" :style="{height:height,width:width}"></div>
  </div>
</template>
<script>
  import AMapLoader from "@amap/amap-jsapi-loader";
  export default {
    props: {
      clickEvent: {
        type: Boolean,
      },
      height: {
        type: String,
        default: '100%'
      },
      
      width: {
        type: String,
        default: '100%'
      },
      projetList: {
        type: Array,
      },
      clickCallBack: {
        type: Function
      }
    },
    data() {
      return {
        showNearList: false,
        isMousedown: false,
        infoWindow: null,
        map: null,
        placeSearch: null,
        nearList: [],
        markers: [],
      };
    },
    mounted() {
      this.loadMap();
    },
    methods: {
      handleMousedown() {
        this.isMousedown = true
      },
      handleMouseup() {
        this.isMousedown = false
      },
      loadMap() {
        var _self = this;
        AMapLoader.load({
          key: _self.$GaoDeMapJsApiKey, // 申请好的Web端开发者Key，首次调用 load 时必填
          version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: ['AMap.PlaceSearch'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
          AMapUI: {
            // 是否加载 AMapUI，缺省不加载
            version: "1.1", // AMapUI 缺省 1.1
            plugins: [], // 需要加载的 AMapUI ui插件
          },
          Loca: {
            // 是否加载 Loca， 缺省不加载
            version: "2.0", // Loca 版本，缺省 1.3.2
          },
        }).then((AMap) => {
          _self.map = new AMap.Map("container", {
            viewMode: "2D", // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
            zoom: 6, //初始化地图层级
            center: [116.397428, 39.90923], //初始化地图中心点
            mapStyle: "amap://styles/d213d63b75486dc13f5ece73bc5fa86c", //设置地图的显示样式
          });
          _self.placeSearch = new AMap.PlaceSearch();
          // console.log(_self.placeSearch());
          if (this.projetList) {
            for (var i = 0; i < this.projetList.length; i++) {
              var marker = new AMap.Marker({
                position: [
                  this.projetList[i].longitude,
                  this.projetList[i].latitude,
                ],
                offset: new AMap.Pixel(-10, -10),
                map: _self.map,
                extData: {
                  projectName: this.projetList[i].projectName,
                  iuid: this.projetList[i].iuid,
                },
              });
              // 自定义点标记内容
              var markerContent = "<div class='mapMarker'></div>";
              marker.setContent(markerContent);
              marker.on("mouseover", _self.infoOpen);
              marker.on("click", _self.infoClose);
              this.markers.push(marker);
            }
            _self.map.setFitView(null, false, [150, 60, 100, 60]);
          }
          _self.infoWindow = new AMap.InfoWindow({
            isCustom: true, //使用自定义窗体
            //content: content.join("<br/>"),
            offset: new AMap.Pixel(16, -45),
          });
          if (this.clickEvent) {
            _self.map.on("click", _self.mapClick);
          }
        }).catch((e) => {
          console.log(e);
        });
      },
      infoClose(e) {
        this.infoWindow.close(this.map, e.target.getPosition());
      },
      infoOpen(e) {
        let project = e.target.getExtData();
        //实例化信息窗体
        var content = [];
        content.push("<div class='custom-info input-card content-window-card' style='width:200px'><div class='info-middle' style=''><span style='margin-left: 0; font-size: 14px;'>" + project.projectName + "</span>");
        content.push("<a href='/#/projectFile?projectId=" + project.iuid + "&projectName=" + project.projectName + "' style='display: block;color:#17E2DF;margin-top:10px'>进入项目</a></div></div>");
        this.infoWindow.setContent(content.join("<br/>"));
        this.infoWindow.open(this.map, e.target.getPosition());
      },
      mapClick(ev) {
        if (this.marker) {
          this.marker.setMap(null);
          this.marker = null;
        }
        let lngLat = [ev.lnglat.lng, ev.lnglat.lat]
        // console.log(this.placeSearch.searchNearBy);
        this.showNearList = false
        this.nearList = []
        this.placeSearch.searchNearBy('', lngLat, 2000, (s, r) => {
          if (s == 'complete') {
            this.setMapCenter(lngLat)
            this.showNearList = true
            this.nearList = r.poiList.pois.map(item => {
              return {
                location: item.location,
                name: item.name,
                address: item.address,
                act: false
              }
            })
          }
        })
        this.marker = new AMap.Marker({
          position: [ev.lnglat.lng, ev.lnglat.lat],
          offset: new AMap.Pixel(-10, -10),
          map: this.map,
        });
        var markerContent = "<div class='mapMarker'></div>";
        this.marker.setContent(markerContent);
        this.$emit("clickCallBack", [ev.lnglat.lng, ev.lnglat.lat]);
      },
      nearClick(item) {
        this.nearList.forEach(obj => {
          obj.act = false
        })
        item.act = true
        this.$emit("clickCallBack", [item.location.lng, item.location.lat]);
      },
      mapQueryByProjectName(name) {
        if (name && name.length > 0) {
          for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].w.extData.projectName.indexOf(name) === -1) {
              this.markers[i].setMap(null);
            }
          }
        } else {
          this.loadMap()
        }
      },
      setMapCenter(location) {
        this.map.setZoomAndCenter(15, location);
      },
    },
  };
</script>
<style>
  .map-container {
    position: relative;
  }

  .nearList {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 200px;
    overflow-y: scroll;
    max-height: 300px;
    z-index: 999;
    background-color: #fff;
  }

  .nearList .list-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #efefef;
  }

  .nearList .name {
    font-size: 14px;
    color: #333;
  }

  .nearList .address {
    margin-top: 3px;
    color: #999;
    font-size: 12px;
  }

  .nearList .list-item:hover .name {
    color: #409eff;
  }

  .nearList .list-item.active .name {
    font-weight: 500;
    color: #409eff !important;
  }

  .nearList .list-item:last-child {
    border-bottom: 0;
  }

  #container {
    min-width: 500px;
    min-height: 100px;
    /* cursor: pointer; */
  }

  .content-window-card {
    position: relative;
    box-shadow: none;
    bottom: -15px;
    left: 80px;
    width: auto;
    padding: 0;
  }

  div.info-middle {
    background-color: #1d2e4c;
    color: #aec9db;
    border-radius: 5px;
    font-size: 14px;
    padding: 13px 16px;
    line-height: 20px;
  }

  .mapMarker {
    background-image: url("../assets/2DMap/mapSmallMarker.png");
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
  }

  .mapMarker:hover {
    background-image: url("../assets/2DMap/mapBigMarker.png");
    background-repeat: no-repeat;
    width: 32px;
    height: 32px;
    position: relative;
    top: -5px;
    left: -5px;
  }
</style>
