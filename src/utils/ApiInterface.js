/*
	Api Interface  1.0
*/

/*
	基础类接口层
	frameID		嵌入三维显示服务的frame 的id。
	src			嵌入的三维显示服务的地址。含端口，不需要包含访问所需的参数。
*/
var BaseAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;

  this.fitView = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "FitView",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setMousePan = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "PanView",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setMouseRotate = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "RotateView",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.undoView = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "UndoView",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.redoView = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "RedoView",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.measureLocation = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "MeasureLocation",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.measureDistance = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "MeasureDistance",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.mapShowDom = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "ShowDom",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.mapHideDom = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "HideDom",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.mapShowDem = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "ShowDem",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.mapHideDem = function () {
    var data = {
      FirstName: "BaseApi",
      SecondName: "HideDem",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setSelectionScope = function (type) {
    var data = {
      FirstName: "BaseApi",
      SecondName: "SetSelectionScope",
      data: { type: type },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideAllUI = function () {
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage({ command: "onlyShowModel" }, "*");
  };

  this.setId = function (id) {
    var data = {
      FirstName: "BaseApi",
      SecondName: "SetId",
      data: { id: id },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};

/*
	场景类接口层
	frameID		嵌入三维显示服务的frame 的id。
	src			嵌入的三维显示服务的地址。含端口，不需要包含访问所需的参数。
*/
export const SceneAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;

  /*
		设置背景色。
		r,g,b,a		颜色的 r,g,b,a 分量。
	*/
  this.setBKColor = function (r, g, b, a) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "SetBKColor",
      data: {
        r: r,
        g: g,
        b: b,
        a: a,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setRenderMode = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "SetRenderMode",
      data: {
        mode: mode,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.showGrid = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ShowGrid",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideGrid = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "HideGrid",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.showACS = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ShowACS",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideACS = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "HideACS",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.showConstructions = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ShowConstructions",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideConstructions = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "HideConstructions",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.showVisibleEdges = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ShowVisibleEdges",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideVisibleEdges = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "HideVisibleEdges",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.showMonochrome = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ShowMonochrome",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideMonochrome = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "HideMonochrome",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.showHiddenEdges = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ShowHiddenEdges",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideHiddenEdges = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "HideHiddenEdges",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.showAmbientOcclusion = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ShowAmbientOcclusion",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideAmbientOcclusion = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "HideAmbientOcclusion",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.showShadows = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ShowShadows",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideShadows = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "HideShadows",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.showBackgroundMap = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ShowBackgroundMap",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.hideBackgroundMap = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "HideBackgroundMap",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.closeSkyBox = function (mode) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "CloseSkyBox",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setCameraOn = function () {
    var data = {
      FirstName: "SceneApi",
      SecondName: "CameraOn",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setCameraOff = function () {
    var data = {
      FirstName: "SceneApi",
      SecondName: "CameraOff",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setSkyBoxWithColor = function (
    topColor,
    skycolor,
    groudColor,
    bottomColor
  ) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "setSkyBoxWithColor",
      data: {
        top: { r: topColor.r, g: topColor.g, b: topColor.b },
        sky: { r: skycolor.r, g: skycolor.g, b: skycolor.b },
        ground: { r: groudColor.r, g: groudColor.g, b: groudColor.b },
        bottom: { r: bottomColor.r, g: bottomColor.g, b: bottomColor.b },
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setSkyBoxWidthDefaultImg = function (imgName) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "setSkyBoxWithDefaultImg",
      data: { imgName: imgName },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getScreenShot = function () {
    var data = {
      FirstName: "SceneApi",
      SecondName: "GetScreenShot",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getViewPoint = function () {
    var data = {
      FirstName: "SceneApi",
      SecondName: "GetViewPoint",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setViewPoint = function (viewpoint) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "SetViewPoint",
      data: { viewpoint: viewpoint },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.clipScene = function (faces) {
    var data = {
      FirstName: "SceneApi",
      SecondName: "ClipScene",
      data: { faces: faces },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.openClip = function () {
    var data = {
      FirstName: "SceneApi",
      SecondName: "OpenClip",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.closeClip = function () {
    var data = {
      FirstName: "SceneApi",
      SecondName: "CloseClip",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.ptsToLlhs = function (id, pts) {
    if (pts == undefined || pts.length <= 0) return;
    var points = new Array();
    for (var i = 0; i < pts.length; i++)
      points.push({ x: pts[i].x, y: pts[i].y, z: pts[i].z });
    var data = {
      FirstName: "SceneApi",
      SecondName: "PtsToLlhs",
      data: { pts: points, id: id },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.llhsToPts = function (id, llhs) {
    if (llhs == undefined || llhs.length <= 0) return;
    var pts = new Array();
    for (var i = 0; i < llhs.length; i++)
      pts.push({ lon: llhs[i].lon, lat: llhs[i].lat, height: llhs[i].height });
    var data = {
      FirstName: "SceneApi",
      SecondName: "LlhsToPts",
      data: { llhs: pts, id: id },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};

/*
	构件接口层。构件相关的接口
	frameID		嵌入三维显示服务的frame 的id。
	src			嵌入的三维显示服务的地址。含端口，不需要包含访问所需的参数。
*/
export const ElementAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;

  this.getNVs = function (ids) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "GetNVs",
      data: { ids: ids },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getAllGeometricElement3dNVs = function () {
    var data = {
      FirstName: "ElementApi",
      SecondName: "GetAllGeometricElement3dNVs",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setAddColor = function (ids, r, g, b) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "SetAddColor",
      data: { ids: ids, r: r, g: g, b: b },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.clearAddColor = function (ids) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "ClearAddColor",
      data: { ids: ids },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setAddAlpha = function (ids, alpha) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "SetAddAlpha",
      data: { ids: ids, alpha: alpha },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.clearAddAlpha = function (ids) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "ClearAddAlpha",
      data: { ids: ids },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.highLight = function (ids) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "HighLight",
      data: { ids: ids },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.clearHighLight = function (ids) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "ClearHighLight",
      data: { ids: ids },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setModelAddColor = function (r, g, b) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "SetModelAddColor",
      data: { r, g, b },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.clearModelAddColor = function () {
    var data = {
      FirstName: "ElementApi",
      SecondName: "ClearModelAddColor",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setModelAddAlpha = function (alpha) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "SetModelAddAlpha",
      data: { alpha: alpha },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.clearModelAddAlpha = function () {
    var data = {
      FirstName: "ElementApi",
      SecondName: "ClearModelAddAlpha",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setHighLightSetting = function (r, g, b) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "SetHighLightSetting",
      data: { r: r, g: g, b: b },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getSelElementId = function () {
    var data = {
      FirstName: "ElementApi",
      SecondName: "GetSelElementId",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getSelElement = function () {
    var data = {
      FirstName: "ElementApi",
      SecondName: "GetSelElement",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.zoomToElement = function (ids) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "ZoomToElement",
      data: { ids: ids },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getElementIdByCategories = function (categories) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "GetElementIdByCategories",
      data: { categories: categories },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getElementByCategories = function (categories) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "GetElementByCategories",
      data: { categories: categories },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getElementsRange = function (ids) {
    var data = {
      FirstName: "ElementApi",
      SecondName: "GetElementsRange",
      data: { ids: ids },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};

/*
	标签相关接口层。
	frameID		嵌入三维显示服务的frame 的id。
	src			嵌入的三维显示服务的地址。含端口，不需要包含访问所需的参数。
*/
var MarkAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;
  this.addLinkPoint = function (id, x, y, z) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "AddLinkPoint",
      data: { id: id, x: x, y: y, z: z },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.addLinkPointByElement = function (id, elementId, type) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "AddLinkPointByElement",
      data: { id: id, type: type, elementId: elementId },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.removeLinkPoint = function (id) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "RemoveLinkPoint",
      data: { id: id },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.addSimpleMark = function (id, pos, size, imgProps, txtProps) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "AddSimpleMark",
      data: {
        id: id,
        pos: { x: pos.x, y: pos.y, z: pos.z },
        size: { x: size.x, y: size.y },
        imgProps: {
          url: imgProps.url,
          size: { x: imgProps.size.x, y: imgProps.size.y },
          offset: { x: imgProps.offset.x, y: imgProps.offset.y },
        },
        txtProps: { txt: txtProps.txt },
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.addSimpleMarkByElemnet = function (
    id,
    elementId,
    size,
    imgProps,
    txtProps,
    type
  ) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "AddSimpleMarkByElemnet",
      data: {
        id: id,
        elementId: elementId,
        size: { x: size.x, y: size.y },
        imgProps: {
          url: imgProps.url,
          size: { x: imgProps.size.x, y: imgProps.size.y },
          offset: { x: imgProps.offset.x, y: imgProps.offset.y },
        },
        txtProps: { txt: txtProps.txt },
        type: type,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.removeSimpleMark = function (id) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "RemoveSimpleMark",
      data: { id: id },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.addRgn = function (id, pts, rgba) {
    var points = new Array();
    for (var i = 0; i < pts.length; i++)
      points.push({ x: pts[i].x, y: pts[i].y, z: pts[i].z });
    var data = {
      FirstName: "MarkApi",
      SecondName: "AddRgn",
      data: {
        id: id,
        pts: points,
        r: rgba.r,
        g: rgba.g,
        b: rgba.b,
        a: rgba.a,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.removeRgn = function (id) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "RemoveRgn",
      data: { id: id },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.addLine = function (id, pts, rgba) {
    var points = new Array();
    for (var i = 0; i < pts.length; i++)
      points.push({ x: pts[i].x, y: pts[i].y, z: pts[i].z });
    var data = {
      FirstName: "MarkApi",
      SecondName: "AddLine",
      data: {
        id: id,
        pts: points,
        r: rgba.r,
        g: rgba.g,
        b: rgba.b,
        a: rgba.a,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.removeLine = function (id) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "RemoveLine",
      data: { id: id },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.updateSimpleMarkPosition = function (id, pos) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "UpdateSimpleMarkPosition",
      data: { id: id, pos: { x: pos.x, y: pos.y, z: pos.z } },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.addAttributeMark = function (
    id,
    pos,
    size,
    nvs,
    lineColor,
    txtColor,
    txtHeight,
    nameWidth,
    valueWidth
  ) {
    var attributes = new Array();
    if (nvs == undefined || nvs.length <= 0) return;
    for (i = 0; i < nvs.length; i++) {
      attributes.push({ name: nvs[i].name, value: nvs[i].value });
    }

    if (txtHeight <= 0) return;

    var data = {
      FirstName: "MarkApi",
      SecondName: "AddAttributeMark",
      data: {
        id: id,
        pos: { x: pos.x, y: pos.y, z: pos.z },
        size: { x: size.x, y: size.y },
        nvs: nvs,
        lineColor: lineColor,
        txtColor: txtColor,
        txtHeight: txtHeight,
        nameWidth: nameWidth,
        valueWidth: valueWidth,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.updateAttributeMarkPosition = function (id, pos) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "UpdateAttributeMarkPosition",
      data: { id: id, pos: { x: pos.x, y: pos.y, z: pos.z } },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.updateAttributeMarkNVs = function (id, nvs) {
    var data = {
      FirstName: "MarkApi",
      SecondName: "UpdateAttributeMarkNVs",
      data: { id: id, nvs: nvs },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};

/*
	地图以及实景相关接口层。
	frameID		嵌入三维显示服务的frame 的id。
	src			嵌入的三维显示服务的地址。含端口，不需要包含访问所需的参数。
*/
var MapAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;

  this.openMap = function () {
    var data = {
      FirstName: "MapApi",
      SecondName: "OpenMap",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.closeMap = function () {
    var data = {
      FirstName: "MapApi",
      SecondName: "CloseMap",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.openDem = function () {
    var data = {
      FirstName: "MapApi",
      SecondName: "OpenDem",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.closeDem = function () {
    var data = {
      FirstName: "MapApi",
      SecondName: "CloseDem",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setMap = function (mapName) {
    var data = {
      FirstName: "MapApi",
      SecondName: "SetMap",
      data: { name: mapName },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.addRealityData = function (url) {
    var data = {
      FirstName: "MapApi",
      SecondName: "AddRealityData",
      data: { url: url },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.removeRealityData = function (url) {
    var data = {
      FirstName: "MapApi",
      SecondName: "RemoveRealityData",
      data: { url: url },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};

/*
	模型接口层。构件相关的接口
	frameID		嵌入三维显示服务的frame 的id。
	src			嵌入的三维显示服务的地址。含端口，不需要包含访问所需的参数。
*/
var ModelAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;

  this.getAllModels = function () {
    var data = {
      FirstName: "ModelApi",
      SecondName: "GetAllModels",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getAllCategories = function () {
    var data = {
      FirstName: "ModelApi",
      SecondName: "GetAllCategories",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.getDisplayedExtent = function () {
    var data = {
      FirstName: "ModelApi",
      SecondName: "GetDisplayedExtent",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.expandDisplayedExtents = function (xMin, xMax, yMin, yMax, zMin, zMax) {
    var data = {
      FirstName: "ModelApi",
      SecondName: "ExpandDisplayedExtents",
      data: {
        xMin: xMin,
        xMax: xMax,
        yMin: yMin,
        yMax: yMax,
        zMin: zMin,
        zMax: zMax,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};

/*
	事件相关接口。
	frameID		嵌入三维显示服务的frame 的id。
	src			嵌入的三维显示服务的地址。含端口，不需要包含访问所需的参数。
*/
var EventAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;

  this.openSelChangeEvent = function () {
    var data = {
      FirstName: "EventApi",
      SecondName: "OpenSelChangeEvent",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.openSelChangeEvent2 = function () {
    var data = {
      FirstName: "EventApi",
      SecondName: "OpenSelChangeEvent2",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.closeSelChangeEvent = function () {
    var data = {
      FirstName: "EventApi",
      SecondName: "CloseSelChangeEvent",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.pickPoint = function () {
    var data = {
      FirstName: "EventApi",
      SecondName: "PickPoint",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.pickLine = function () {
    var data = {
      FirstName: "EventApi",
      SecondName: "PickLine",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};

var CameraAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;

  this.setByPosAtUp = function (pos, at, up) {
    var data = {
      FirstName: "CameraApi",
      SecondName: "SetByPosAtUp",
      data: {
        pos: { x: pos.x, y: pos.y, z: pos.z },
        at: { x: at.x, y: at.y, z: at.z },
        up: { x: up.x, y: up.y, z: up.z },
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setCameraOn = function () {
    var data = {
      FirstName: "SceneApi",
      SecondName: "CameraOn",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.setCameraOff = function () {
    var data = {
      FirstName: "SceneApi",
      SecondName: "CameraOff",
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};

var ScriptAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;

  this.createMovedObjByElement = function (id, elementIds) {
    var data = {
      FirstName: "ScriptApi",
      SecondName: "CreateMovedObjByElement",
      data: {
        id: id,
        elementIds: elementIds,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.createMovedObjByFile = function (id, fileName) {
    var data = {
      FirstName: "ScriptApi",
      SecondName: "CreateMovedObjByFile",
      data: {
        id: id,
        fileName: fileName,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.deleteMovedObjs = function (ids) {
    var data = {
      FirstName: "ScriptApi",
      SecondName: "DeleteMovedObjs",
      data: {
        ids: ids,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.moveMovedObj = function (id, dx, dy, dz) {
    var data = {
      FirstName: "ScriptApi",
      SecondName: "MoveMovedObj",
      data: {
        id: id,
        dx: dx,
        dy: dy,
        dz: dz,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.rotateMovedObj = function (id, pos, axis, angle) {
    var data = {
      FirstName: "ScriptApi",
      SecondName: "RotateMovedObj",
      data: {
        id: id,
        pos: { x: pos.x, y: pos.y, z: pos.z },
        axis: { x: axis.x, y: axis.y, z: axis.z },
        angle: angle,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.rotateAndMoveMovedObj = function (id, dx, dy, dz, pos, axis, angle) {
    var data = {
      FirstName: "ScriptApi",
      SecondName: "RotateAndMoveMovedObj",
      data: {
        id: id,
        pos: { x: pos.x, y: pos.y, z: pos.z },
        axis: { x: axis.x, y: axis.y, z: axis.z },
        angle: angle,
        dx: dx,
        dy: dy,
        dz: dz,
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};

var GeometryAPI = function (frameID, src) {
  this._bwFrameID = frameID;
  this._src = src;

  this.addPipe = function (id, centerPts, radius, r, g, b) {
    if (centerPts == undefined || centerPts.length <= 1) return;

    var pts = new Array();
    for (var i = 0; i < centerPts.length; i++) {
      pts.push({ x: centerPts[i].x, y: centerPts[i].y, z: centerPts[i].z });
    }

    var data = {
      FirstName: "GeometryApi",
      SecondName: "AddPipe",
      data: {
        id: id,
        pts: pts,
        radius: radius,
        color: { r: r, g: g, b: b },
      },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.removeGeometry = function (id) {
    var data = {
      FirstName: "GeometryApi",
      SecondName: "RemoveGeometry",
      data: { id: id },
    };
    this.SendCommand("ApiInterface", data);
  };

  this.SendCommand = function (command, data) {
    var requestData = {
      command: command,
      data: data,
    };
    document
      .getElementById(this._bwFrameID)
      .contentWindow.postMessage(requestData, this._src);
  };
};
