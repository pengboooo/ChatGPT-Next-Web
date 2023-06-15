export function prettyObject(msg: any) {
  const obj = msg;
  if (typeof msg !== "string") {
    if (typeof msg == "object" && msg.message) {
      msg = JSON.stringify(msg.message);
    } else {
      msg = JSON.stringify(msg, null, "  ");
    }
  }
  if (msg === "{}") {
    return obj.toString();
  }
  if (msg.startsWith("```json")) {
    return msg;
  }
  return ["```json", msg, "```"].join("\n");
}
