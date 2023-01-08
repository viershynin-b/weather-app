import axios from "axios";

import * as Interfaces from "./Interfaces";
import { API_KEY_WEATHER } from "./GLOBAL_VARS";


interface techCityList extends Interfaces.ICityList {
  local_names?: { [key: string]: string };
}

export const getLocalWeather = async (
  lat: number,
  lon: number,
  enforcedCityName?: string,
  fetchMode?: string
): Promise<{
  success: boolean;
  data?: Interfaces.ILocalWeatherData;
  mode?: string | null;
}> => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY_WEATHER}`
    );
    if (res.status === 200) {
      const getIANATimezone = (utcOffsetSeconds: number) => {
        const utcOffsetHours = Math.abs(utcOffsetSeconds / 3600);
        const sign = utcOffsetSeconds < 0 ? "+" : "-";
        return `GMT ${sign}${utcOffsetHours}`;
      };

      const localTimeZone = getIANATimezone(res.data.timezone);

      return {
        success: true,
        data: {
          latitude: lat,
          longtitude: lon,
          cityName: enforcedCityName ? enforcedCityName : String(res.data.name),
          countryName: String(res.data.sys.country),
          actualTemp: String(res.data.main.temp),
          feelTemp: String(res.data.main.feels_like),
          humidity: String(res.data.main.humidity),
          pressure: String(res.data.main.pressure),
          temp_max: String(res.data.main.temp_max),
          temp_min: String(res.data.main.temp_min),
          weatherDesc: String(res.data.weather[0].description),
          icon: String(res.data.weather[0].icon),
          timeZone: localTimeZone,
          clouds: res.data.clouds.all,
          wind: res.data.wind.speed,
        },
        mode: fetchMode || null,
      };
    }
  } catch (e) {
    return { success: false };
  }
  return { success: false };
};

export const getCityCoordinates = async (
  city: string
): Promise<{
  success: boolean;
  data?: Interfaces.ICityList[];
}> => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY_WEATHER}`
    );
    if (res.status === 200) {
      res.data.map((location: techCityList) => {
        if (location.local_names) {
          delete location.local_names;
          return location;
        }
      });

      return {
        success: true,
        data: res.data,
      };
    }
  } catch (e) {
    return { success: false };
  }
  return { success: false };
};

interface IForecastResponse {
  dt: number;
  main: {
    temp: number;
  };
}

export const getHourlyLocalWeather = async (
  lat: number,
  lon: number
): Promise<{
  success: boolean;
  data?: {
    timeData: number;
    temp: number;
  }[];
}> => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY_WEATHER}`
    );
    if (res.status === 200) {
      return {
        success: true,
        data: res.data.list.map((el: IForecastResponse) => ({
          timeData: el.dt * 1000,
          temp: el.main.temp,
        })),
      };
    }
  } catch (e) {
    return { success: false };
  }
  return { success: false };
};
