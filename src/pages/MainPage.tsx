import { useAppSelector } from "../store/hooks";
import { RootState } from "../store";
import MainWeatherContent from "../components/Weather/MainWeatherContent";

const MainPage = () => {
  const weatherList = useAppSelector(
    (state: RootState) => state.weather.weatherData
  );  
  return <MainWeatherContent weatherList={weatherList} />;
};

export default MainPage;
