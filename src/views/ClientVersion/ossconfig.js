// const OSS = require('ali-oss');

// 初始化OSS客户端。请将以下参数替换为您自己的配置信息。
const client = (config) => {
  return new OSS(config);
}

// 简单上传
export const put = async (ObjName, fileObj) => {
  console.log(ObjName, fileObj);
  try {
    let result = await client.put(`${ObjName}`, fileObj)
    // ObjName为文件名字,可以只写名字，就直接储存在 bucket 的根路径，如需放在文件夹下面直接在文件名前面加上文件夹名称    
    return result;
  } catch (e) {
    console.log(e)
    return ''
  }
}


// 分片上传
export const multiPut = async (ObjName, fileObj, progressHandle, ossConfig) => {
  try {
    const res = await client(ossConfig).multipartUpload(ObjName, fileObj, {
      // 获取分片上传进度、断点和返回值。
      progress: (p, cpt, res) => {
        // console.log(p, cpt, res);
        progressHandle && progressHandle(p);
      },
      // 设置并发上传的分片数量。
      parallel: 4,
      // 设置分片大小。默认值为1 MB，最小值为100 KB。
      partSize: 1024 * 1024,
    });
  return res;
  } catch (e) {
    console.log(e)
    return ''
  }

  // bucket: string;
  // name: string;
  // etag: string;
  // data: object;
  // res: NormalSuccessResponse;

}









// 上传成功之后，转换真实的地址
export const signatureUrl = async (ObjName) => {
  try {
    let result = await client.signatureUrl(`${ObjName}`);
    if (result) {
      let startIndex = result.indexOf('clientApp');
      let endIndex = result.indexOf('?');
      result = result.slice(startIndex, endIndex);
    }
    return result;
  } catch (e) {
    console.log(e);
    return '';
  }
}

export const getFileNameUUID = () => {
  function rx() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${+new Date()}_${rx()}${rx()}`;
}