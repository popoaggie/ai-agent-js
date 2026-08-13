export const currentTimeTool = {
  type: "function",
  function: {
    name: "get_current_time",
    description: "取得目前時間",
    parameters: {
      type: "object",
      properties: {},
    },
  },
};

export function getCurrentTime() {
  const now = new Date();

  return {
    currentTime: now.toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
    }),
  };
}