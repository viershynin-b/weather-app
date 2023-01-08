import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as Interfaces from "../utils/Interfaces";
import { getLocalWeather } from "../utils/WeatherManagementApi";

export enum SliceStatusEnum {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
  INIT = "",
}

interface ItoastifySettings {
  type: string;
  message: string;
}

interface IinitialState {
  weatherData: Interfaces.ILocalWeatherData[];
  singleRequestStatus: SliceStatusEnum;
  bulkRequestStatus: SliceStatusEnum;
  toastifySettings: ItoastifySettings;
}

const initialState: IinitialState = {
  weatherData: [
    {
      cityName: "",
      countryName: "",
      actualTemp: "",
      feelTemp: "",
      weatherDesc: "",
      humidity: "",
      pressure: "",
      temp_max: "",
      temp_min: "",
      icon: "",
      latitude: 0,
      longtitude: 0,
      timeZone: "",
      clouds: 0,
      wind: 0,
    },
  ],
  singleRequestStatus: SliceStatusEnum.INIT,
  bulkRequestStatus: SliceStatusEnum.INIT,
  toastifySettings: {
    type: "",
    message: "",
  },
};

export const fetchSingleCityWeather = createAsyncThunk(
  "weather/fetchSingleCity",
  async (city: {
    lat: number;
    lon: number;
    enforcedCityName?: string;
    mode?: string;
  }): Promise<{
    data?: Interfaces.ILocalWeatherData | undefined;
    mode?: string | null | undefined;
  }> => {
    const { lat, lon, enforcedCityName, mode } = city;
    const weatherResponse = await getLocalWeather(
      lat,
      lon,
      enforcedCityName,
      mode
    );
    return { data: weatherResponse?.data, mode: weatherResponse?.mode };
  }
);

export const fetchAllWeather = createAsyncThunk(
  "weather/fetchAllCities",
  async (
    arr: Interfaces.ICityList[]
  ): Promise<Interfaces.ILocalWeatherData[]> => {
    const promisesArr: Promise<{
      success: boolean;
      data?: Interfaces.ILocalWeatherData;
    }>[] = [];

    const weatherArray: Interfaces.ILocalWeatherData[] = [];

    arr.forEach((el) => {
      const { lat, lon, name } = el;
      const promise = getLocalWeather(lat, lon, name);

      promisesArr.push(promise);
    });

    await Promise.allSettled(promisesArr).then((results) => {
      results.forEach((cityRes) => {
        if (cityRes.status === "fulfilled" && cityRes.value.data) {
          const cityData = {
            cityName: cityRes.value.data.cityName,
            countryName: cityRes.value.data.countryName,
            actualTemp: cityRes.value.data.actualTemp,
            feelTemp: cityRes.value.data.feelTemp,
            weatherDesc: cityRes.value.data.weatherDesc,
            humidity: cityRes.value.data.humidity,
            pressure: cityRes.value.data.pressure,
            temp_max: cityRes.value.data.temp_max,
            temp_min: cityRes.value.data.temp_min,
            icon: cityRes.value.data.icon,
            latitude: cityRes.value.data.latitude,
            longtitude: cityRes.value.data.longtitude,
            timeZone: cityRes.value.data.timeZone,
            clouds: cityRes.value.data.clouds,
            wind: cityRes.value.data.wind,
          };
          weatherArray.push(cityData);
        }
      });
    });
    return weatherArray;
  }
);

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setToastifySettings(state, action) {
      state.toastifySettings = action.payload;
    },
    deleteCity(state, action) {
      const cityList = localStorage.getItem("cityList");
      if (cityList) {
        let parsedList: Interfaces.ICityList[] = [];
        try {
          parsedList = JSON.parse(cityList);
          const reducedList = parsedList.filter(
            (el) => el.name !== action.payload
          );
          localStorage.setItem("cityList", JSON.stringify(reducedList));
          weatherSlice.caseReducers.setToastifySettings(state, {
            ...action,
            payload: {
              type: "info",
              message: `${action.payload} card deleted successfully`,
            },
          });
        } catch (error) {
          // notify
        }
      }
      state.weatherData = state.weatherData.filter(
        (el) => el.cityName !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSingleCityWeather.pending, (state) => {
      state.singleRequestStatus = SliceStatusEnum.PENDING;
    });
    builder.addCase(fetchSingleCityWeather.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.singleRequestStatus = SliceStatusEnum.FULFILLED;
        const idx = state.weatherData?.findIndex(
          (el) => el.cityName === action.payload.data?.cityName
        );
        if (idx !== -1) {
          state.weatherData.splice(idx, 1, action.payload.data);
          weatherSlice.caseReducers.setToastifySettings(state, {
            ...action,
            payload: {
              type: `${action.payload.mode === "update" ? "success" : "info"}`,
              message: `${action.payload.data.cityName} card ${
                action.payload.mode === "update"
                  ? "updated successfully"
                  : "already exists in your list"
              }`,
            },
          });
        } else {
          state.weatherData.push(action.payload.data);
          weatherSlice.caseReducers.setToastifySettings(state, {
            ...action,
            payload: {
              type: "success",
              message: `${action.payload.data.cityName} card added successfully`,
            },
          });
        }
      } else {
        state.singleRequestStatus = SliceStatusEnum.REJECTED;
        weatherSlice.caseReducers.setToastifySettings(state, {
          ...action,
          payload: {
            type: "error",
            message: `Error occured while adding new city, please, report to the tech support team`,
          },
        });
      }
    });
    builder.addCase(fetchSingleCityWeather.rejected, (state, action) => {
      state.singleRequestStatus = SliceStatusEnum.REJECTED;
      weatherSlice.caseReducers.setToastifySettings(state, {
        ...action,
        payload: {
          type: "error",
          message: `Error occured while adding new city, please, report to the tech support team`,
        },
      });
    });
    builder.addCase(fetchAllWeather.pending, (state) => {
      state.bulkRequestStatus = SliceStatusEnum.PENDING;
    });
    builder.addCase(fetchAllWeather.fulfilled, (state, action) => {
      state.bulkRequestStatus = SliceStatusEnum.FULFILLED;
      state.weatherData = action.payload;
    });
    builder.addCase(fetchAllWeather.rejected, (state, action) => {
      state.bulkRequestStatus = SliceStatusEnum.REJECTED;
      weatherSlice.caseReducers.setToastifySettings(state, {
        ...action,
        payload: {
          type: "error",
          message: `Error occured while refreshing the weather data for chosen locations, please, report to the tech support team`,
        },
      });
    });
  },
});

export const weatherActions = weatherSlice.actions;

export default weatherSlice.reducer;
