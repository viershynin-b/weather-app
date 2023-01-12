import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import urlSlug from "url-slug";
import {
  CardHeader,
  CardContent,
  Card,
  Typography,
  IconButton,
} from "@mui/material";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import ClearIcon from "@mui/icons-material/Clear";

import { useAppDispatch } from "../../store/hooks";
import {
  fetchSingleCityWeather,
  weatherActions,
} from "../../store/weather-slice";
import * as Interfaces from "../../utils/Interfaces";

interface ICityCardProps {
  city: Interfaces.ILocalWeatherData;
}

const CityCard = ({ city }: ICityCardProps) => {
  const refreshIcon = useRef<SVGSVGElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleIconSpin = (spin: boolean) => {
    const iconElem = refreshIcon.current;
    if (iconElem) {
      spin
        ? iconElem.classList.add("spinning-refresh-btn")
        : iconElem.classList.remove("spinning-refresh-btn");
    }
  };

  const cardDeleteHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    dispatch(weatherActions.deleteCity(city.cityName));
  };

  const cardRefreshHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const cityData = {
      lat: city.latitude,
      lon: city.longtitude,
      enforcedCityName: city.cityName,
      mode: "update",
    };

    toggleIconSpin(true);
    await dispatch(fetchSingleCityWeather(cityData));
    toggleIconSpin(false);
  };

  const cardClickHandler = () => {
    navigate(`/${urlSlug(city.cityName)}`);
  };

  return (
    <Card className="card__wrapper" onClick={cardClickHandler}>
      <div>
        <div className="card-header__wrapper">
          <CardHeader
            title={`${
              city.cityName.length > 15
                ? city.cityName.slice(0, 14) + "..."
                : city.cityName
            }, ${city.countryName}`}
            className="card-header__text"
          />
          <div className="card-header__actions">
            <IconButton onClick={cardRefreshHandler}>
              <RotateRightIcon
                className="card-header__actions__icon refresh-icon"
                ref={refreshIcon}
              />
            </IconButton>
            <IconButton onClick={cardDeleteHandler}>
              <ClearIcon className="card-header__actions__icon clear-icon" />
            </IconButton>
          </div>
        </div>
        <CardContent className="card-content__wrapper">
          <Typography className="temperature-main">
            {`${Math.round(Number(city.actualTemp))}°`}
            <img
              src={`http://openweathermap.org/img/w/${city.icon}.png`}
              alt="weather-icon"
            />
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
};

export default CityCard;
