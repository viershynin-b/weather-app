import { useState, useEffect } from "react";
import _ from "lodash";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import * as Interfaces from "../../utils/Interfaces";
import { IDetailedForecast } from "../../pages/DetailsPage";
import StyledDetailesPage from "../../styles/StyledDetailesPage";
import { FullScreenLoader } from "../../components/UI/FullScreenLoader";

interface ICityDetailsPage {
  cityData: Interfaces.ILocalWeatherData | null;
  detailedForecast: IDetailedForecast[] | null;
}

const CityDetailsPage = ({ cityData, detailedForecast }: ICityDetailsPage) => {
  const [minTemp, setMinTemp] = useState<number | null>(null);
  const [maxTemp, setMaxTemp] = useState<number | null>(null);
  const [isPageContentLoading, setIsPageContentLoading] = useState(true);
  const [isTooptipAvailable, setIsTooltipAvailable] = useState(false);

  useEffect(() => {
    if (cityData && detailedForecast) {
      setIsPageContentLoading(false);
      setTimeout(() => {
        setIsTooltipAvailable(true);
      }, 1500);
    }
  }, [cityData, detailedForecast]);

  useEffect(() => {
    if (detailedForecast) {
      const maxT = _.cloneDeep(detailedForecast).sort(
        (a, b) => b.temp - a.temp
      )[0].temp;
      const minT = _.cloneDeep(detailedForecast).sort(
        (a, b) => a.temp - b.temp
      )[0].temp;

      setMaxTemp(maxT);
      setMinTemp(minT);
    }
  }, [detailedForecast]);

  const getWeatherBarHeight = (temp: number) => {
    let barHeight = "";
    if (maxTemp && minTemp) {
      const range = maxTemp - minTemp
      const magnitude = temp - minTemp;
      const barHeightPxOffset = 11
      const relToMaxMagnitude = (magnitude * (100 - barHeightPxOffset)) / range;
      barHeight = relToMaxMagnitude.toFixed(2) + "%";
    }
    return barHeight;
  };

  const getDescriptiveDateString = (requestedFormat: string, unix: number) => {
    const time = new Date(unix).getHours() + ":00";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(unix)
      .toLocaleDateString("en-US", options)
      .split(", 202")[0];
    return requestedFormat === "time" ? time : `${date}, ${time}`;
  };

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  const weatherBarChartWithTooltip = (
    <div className="weather-bar-chart">
      {detailedForecast?.map((el) => (
        <div key={el.timeData} className="weather-column">
          <HtmlTooltip
            title={
              <>
                <Typography color="inherit">{`Temperature: ${el.temp.toFixed(
                  1
                )}??`}</Typography>
                <Typography color="inherit">
                  {getDescriptiveDateString("timeData", el.timeData)}
                </Typography>
              </>
            }
          >
            <div
              className="weather-bar glass-texture"
              style={{
                bottom: getWeatherBarHeight(el.temp),
              }}
            >
              {el.temp.toFixed(1)}
            </div>
          </HtmlTooltip>
          <span className="forecast-time">
            {getDescriptiveDateString("time", el.timeData)}
          </span>
        </div>
      ))}
    </div>
  );

  const weatherBarChart = (
    <div className="weather-bar-chart">
      {detailedForecast?.map((el) => (
        <div key={el.timeData} className="weather-column">
          <div
            className="weather-bar glass-texture"
            style={{
              bottom: getWeatherBarHeight(el.temp),
            }}
          >
            {el.temp.toFixed(1)}
          </div>
          <span className="forecast-time">
            {getDescriptiveDateString("time", el.timeData)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <StyledDetailesPage>
      <div className="weather-app">
        <div className="main-weather-data-container">
          {cityData && (
            <div className="inner-container">
              <div className="temp">{`${Math.round(
                Number(cityData.actualTemp)
              )}??`}</div>
              <div className="city-name-timezone">
                <div className="name">{`${cityData.cityName}, ${cityData.countryName}`}</div>
                <small>
                  <div className="timezone">{cityData.timeZone}</div>
                </small>
              </div>
              <div className="weather-icon">
                <img
                  src={`http://openweathermap.org/img/w/${cityData.icon}.png`}
                  alt="weather-icon"
                />
              </div>
            </div>
          )}
          {isTooptipAvailable ? weatherBarChartWithTooltip : weatherBarChart}
        </div>
        {cityData && (
          <div className="panel glass-texture">
            <div className="weather-details-header">Weather Details</div>
            <ul className="details">
              <li>
                <span>Feels like:</span>
                <span className="feel-tempterature">{` ${cityData.feelTemp}??`}</span>
              </li>
              <li>
                <span>Maximum tempterature:</span>
                <span className="max-tempterature">{` ${cityData.temp_max}??`}</span>
              </li>
              <li>
                <span>Minimum tempterature:</span>
                <span className="min-tempterature">{` ${cityData.temp_min}??`}</span>
              </li>
              <li>
                <span>Humidity:</span>
                <span className="humidity">{` ${cityData.humidity}%`}</span>
              </li>
              <li>
                <span>Clouds:</span>
                <span className="clouds">{` ${cityData.clouds}%`}</span>
              </li>
              <li>
                <span>General:</span>
                <span className="general">{` ${cityData.weatherDesc}`}</span>
              </li>
              <li>
                <span>Wind:</span>
                <span className="wind">{` ${cityData.wind} meter/sec`}</span>
              </li>
            </ul>
          </div>
        )}
      </div>
      {isPageContentLoading && <FullScreenLoader />}
    </StyledDetailesPage>
  );
};

export default CityDetailsPage;
