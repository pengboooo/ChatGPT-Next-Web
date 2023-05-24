export function prettyObject(msg: any) {
  if (typeof msg !== "string") {
    msg = JSON.stringify(msg, null, "  ");
  } else if (msg.includes("account/api-keys")) {
    msg = JSON.stringify(
      "填写的KEY有误，请检查key前后是否有空格或者输入错误！",
      null,
      "  ",
    );
  }
  console.log(msg);
  const prettyMsg = ["```json", msg, "```"].join("\n");
  return prettyMsg;
}
