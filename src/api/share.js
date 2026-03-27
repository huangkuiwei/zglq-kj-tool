import request from "@/utils/request";

export default {
  getShareInfo (iuid, applyiuid) {
    return request({
      method: "post",
      url: "/api/Home/GetSharecertification?IUID="+iuid+"&applyiuid="+applyiuid,
      errorMsgShow:false
    });
  },
  verifySharePassword(iuid,password){
    return request({
      method: "post",
      url: "/api/Home/GetSharecertificationPassword?IUID="+iuid+"&password="+password
    });
  },
  getShareList(iuid, applyiuid){
    return request({
      method: "post",
      url: "/api/Home/GetSharedetailsData?IUID="+iuid+"&applyiuid="+applyiuid
    })
  },
  getShareListByFolderId(iuid){
    return request({
      method: "post",
      url: "/api/Home/GetSharedetailsFilefolderData?IUID="+iuid
    })
  }
};
