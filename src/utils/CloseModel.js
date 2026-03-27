import { Message } from "element-ui";
export function getHundred() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(100);
    }, 2000);
  });
}

export function closemodelCallback(data) {
  if (data) {
    Message.success("模型已关闭！");
  } else {
    Message.error("模型关闭失败！");
  }
}

export function closemodel(url, callback) {
  const loading = Message.warning("模型正在关闭中,请稍等...", 0);
  var iframe = document.getElementById("CloseModel");
  if (iframe == null) {
    iframe = document.createElement("iframe");
    iframe.id = "CloseModel";
  }
  iframe.src = url;
  iframe.hidden = true;
  document.body.appendChild(iframe);
  iframe.onload = function () {
    window.addEventListener(
      "message",
      async (msg) => {
        if (msg.data.command = "beforeImodelClose") {
          console.log('模型端返回beforeImodelClose');
          var CloseModelIframe = document.getElementById("CloseModel");
          closemodelCallback(msg.data ? msg.data.data : true);

          if (CloseModelIframe != null) {
            setTimeout(() => {
              document.body.removeChild(CloseModelIframe);
              console.log('释放iframe');
            }, 1000);
          }
        }
      },
      { once: true }
    );
  };
}
