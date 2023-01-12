import { useAppSelector } from "../store/hooks";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import urlSlug from "url-slug";

import CityDetailsPage from "../components/Weather/CityDetailsPage";
import { getHourlyLocalWeather } from "../utils/WeatherManagementApi";
import * as Interfaces from "../utils/Interfaces";

export interface IDetailedForecast {
  temp: number;
  timeData: number;
}

const DetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const weatherList = useAppSelector(
    (state: RootState) => state.weather.weatherData
  );

  const [currentCityData, setCurrentCityData] =
    useState<Interfaces.ILocalWeatherData | null>(null);
  const [detailedCityForecast, setDetailedCityForecast] = useState<
    IDetailedForecast[] | null
  >(null);

  useEffect(() => {
    if (weatherList[0]?.cityName) {
      checkForInvalidQuery();
    }
  }, [weatherList]);

  useEffect(() => {
    if (currentCityData) {
      fetchHourlyForecast();
    }
  }, [currentCityData]);

  const checkForInvalidQuery = () => {
    const cityName = location.pathname.split("/")[1];
    const idx = weatherList.findIndex(
      (el) => urlSlug(el.cityName) === cityName
    );
    if (idx === -1) {
      navigate("/");
      return;
    }
    const chosenCity = weatherList[idx];
    setCurrentCityData(chosenCity);
  };

  const fetchHourlyForecast = async () => {
    if (currentCityData) {
      const res = await getHourlyLocalWeather(
        currentCityData.latitude,
        currentCityData.longtitude
      );
      if (res.success && res.data) {
        const sortedRes = res.data.slice(0, 16);

        setDetailedCityForecast(sortedRes);
      }
    }
  };
  
  return (
    <CityDetailsPage
      cityData={currentCityData}
      detailedForecast={detailedCityForecast}
    />
  );
};

export default DetailsPage;
