import { useState } from "react";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";

import * as Interfaces from "../../utils/Interfaces";
import CityCard from "./CityCard";
import AddLocationModal from "../UI/AddLocationModal";
import { getCityCoordinates } from "../../utils/WeatherManagementApi";
import { FullScreenLoader } from "../UI/FullScreenLoader";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";

import StyledWeatherWrapper from "../../styles/StyledWeatherWrapper";

interface IMainWeatherContent {
  weatherList: Interfaces.ILocalWeatherData[];
}

let timerId = 0;

const MainWeatherContent = ({ weatherList }: IMainWeatherContent) => {
  const [isDropDownListLoading, setIsDropDownListLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [chosenCity, setChosenCity] = useState<Interfaces.ICityList | null>(
    null
  );
  const [citySearchResults, setCitySearchResults] = useState<
    Interfaces.ICityList[]
  >([]);

  const bulkRequestStatus = useAppSelector(
    (state: RootState) => state.weather.bulkRequestStatus
  );

  function debounceFunction(func: () => void, delay: number) {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay) as unknown as number;
  }

  const handleCityDataFetch = async (inputText: string) => {
    const response = await getCityCoordinates(inputText);

    if (response.success && response.data) {
      setCitySearchResults(response.data);
      setIsDropDownListLoading(false);
    }
  };

  const handleTextInputChange = (
    inputText: string,
    city?: Interfaces.ICityList
  ) => {
    setNewCityName(inputText);
    if (city) {
      setChosenCity(city);
    }
    if (inputText && !city) {
      debounceFunction(() => handleCityDataFetch(inputText), 1000);
    }
  };

  const modalCloseHandler = () => {
    setModalOpen(false);
    setNewCityName("");
    setCitySearchResults([]);
    setChosenCity(null);
  };

  return (
    <StyledWeatherWrapper>
      <Grid container spacing={2} sx={{ width: { md: "850px", lg: "1046px" } }}>
        {weatherList.length && weatherList[0].cityName ? (
          weatherList?.map((city) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              key={city.cityName}
              style={{ display: "flex" }}
            >
              <CityCard city={city} />
            </Grid>
          ))
        ) : (
          <div className="no-cards-placeholder">No cards available for preview</div>
        )}
      </Grid>
      <Button
        variant="contained"
        className="add-city-btn"
        onClick={() => setModalOpen(true)}
      >
        Add location
      </Button>
      <AddLocationModal
        open={isModalOpen}
        isDropDownListLoading={isDropDownListLoading}
        value={newCityName}
        chosenCity={chosenCity}
        citySearchResults={citySearchResults}
        handleClose={modalCloseHandler}
        handleInputChange={handleTextInputChange}
        handleChosenCityReset={() => setChosenCity(null)}
        relaunchDropDownListLoading={() => setIsDropDownListLoading(true)}
      />
      {bulkRequestStatus !== "fulfilled" && <FullScreenLoader />}
    </StyledWeatherWrapper>
  );
};

export default MainWeatherContent;
