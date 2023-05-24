export function prettyObject(msg: any) {
  console.log("【这是返回的错误信息】", msg);
  if (typeof msg !== "string") {
    if (typeof msg == "object" && msg.message) {
      msg = JSON.stringify(msg.message);
    } else {
      msg = JSON.stringify(msg, null, "  ");
    }
  }

  const prettyMsg = ["```json", msg, "```"].join("\n");
  return prettyMsg;
}
