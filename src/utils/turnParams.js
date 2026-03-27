import { encrypt } from "./index";
// 模型传参加密，转义
export const turnEncryptParams = (path, type, editable, selectFile) => {
  let params =
    "path=" +
    (path ? path : "") +
    "&type=" +
    (type ? type : "1") +
    "&editable=" +
    (editable ? editable : "0") +
    "&selectFile=" +
    (selectFile ? selectFile : "0")
  return encrypt(encodeURIComponent(params));
};
