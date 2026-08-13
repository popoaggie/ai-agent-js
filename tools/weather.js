import { OPENWEATHER_API_KEY } from "../config.js";

export const weatherTool = {
  type: "function",
  function: {
    name: "get_weather",
    description: "查詢指定城市的即時天氣資訊",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "城市名稱，例如 Taipei、Kaohsiung、Pingtung",
        },
      },
      required: ["city"],
    },
  },
};

const cityMap = {
  台北: "Taipei,TW",
  新北: "New Taipei,TW",
  桃園: "Taoyuan,TW",
  台中: "Taichung,TW",
  台南: "Tainan,TW",
  高雄: "Kaohsiung,TW",
  屏東: "Pingtung,TW",
  花蓮: "Hualien,TW",
  台東: "Taitung,TW",
  宜蘭: "Yilan,TW",
  新竹: "Hsinchu,TW",
  苗栗: "Miaoli,TW",
  彰化: "Changhua,TW",
  南投: "Nantou,TW",
  雲林: "Yunlin,TW",
  嘉義: "Chiayi,TW",
  基隆: "Keelung,TW",
};

export async function getWeather({ city }) {
  try {
    const queryCity = cityMap[city] || city;

    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(queryCity)}` +
      `&appid=${OPENWEATHER_API_KEY}` +
      `&units=metric` +
      `&lang=zh_tw`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return {
        city,
        queryCity,
        error: "查詢失敗",
        apiResponse: data,
      };
    }

    return {
      city: data.name,
      queryCity,
      weather: data.weather[0].description,
      temperature: data.main.temp,
      humidity: data.main.humidity,
    };
  } catch (error) {
    return {
      city,
      error: "天氣查詢發生錯誤",
      message: error.message,
    };
  }
}