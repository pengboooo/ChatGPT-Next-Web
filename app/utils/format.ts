export function prettyObject(msg: any) {
  console.log("【这是返回的错误信息】", msg);
  if (typeof msg !== "string") {
    if (msg.includes("account/api-keys")) {
      msg = JSON.stringify(
        "填写的KEY有误，请检查key前后是否有空格或者输入错误！",
      );
    } else {
      msg = JSON.stringify(msg, null, "  ");
    }
  }

  const prettyMsg = ["```json", msg, "```"].join("\n");
  return prettyMsg;
}
