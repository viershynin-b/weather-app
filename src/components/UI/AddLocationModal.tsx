import { useRef, useEffect } from "react";

import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchSingleCityWeather,
  SliceStatusEnum,
} from "../../store/weather-slice";
import { RootState } from "../../store";

import StyledAddLocationModal from "../../styles/StyledAddLocationModal";
import * as Interfaces from "../../utils/Interfaces";

interface IAddLocationModal {
  open: boolean;
  isLoading: boolean;
  value: string;
  citySearchResults: Interfaces.ICityList[];
  chosenCity: Interfaces.ICityList | null;
  handleClose: () => void;
  handleInputChange: (inputText: string, city?: Interfaces.ICityList) => void;
  handleChosenCityReset: () => void;
  handleLoadingReset: () => void;
}

const AddLocationModal = ({
  open,
  isLoading,
  value,
  citySearchResults,
  chosenCity,
  handleClose,
  handleInputChange,
  handleChosenCityReset,
  handleLoadingReset,
}: IAddLocationModal) => {
  const cityInputRef = useRef<HTMLInputElement>(null);
  const cityDropDownListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length < 2) {
      setOptionsCoordinates();
    }
  }, [value]);

  useEffect(() => {
    toggleDropDownVisibility();
  }, [chosenCity]);

  const dispatch = useAppDispatch();

  const singleFetchStatus = useAppSelector(
    (state: RootState) => state.weather.singleRequestStatus
  );

  const isFetchPending = () => {
    return singleFetchStatus === SliceStatusEnum.PENDING;
  };

  const handleSingleCityWeatherFetch = async () => {
    if (chosenCity) {
      const newCity = {
        lat: chosenCity.lat,
        lon: chosenCity.lon,
        enforcedCityName: chosenCity.name,
      };
      const res = await dispatch(fetchSingleCityWeather(newCity));
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload &&
        Object.keys(res.payload).length
      ) {
        saveToLocalStorage(chosenCity);
      }
    }
    handleClose();
  };

  const saveToLocalStorage = (city: Interfaces.ICityList) => {
    const cityList = localStorage.getItem("cityList");
    if (cityList) {
      let parsedList: Interfaces.ICityList[] = [];
      try {
        parsedList = JSON.parse(cityList);
        const idx = parsedList.findIndex((el) => el.name === city.name);
        idx !== -1 ? parsedList.splice(idx, 1, city) : parsedList.push(city);
        localStorage.setItem("cityList", JSON.stringify(parsedList));
      } catch (error) {
        //add notifications
      }
    }
  };

  const toggleDropDownVisibility = () => {
    const list = cityDropDownListRef.current;
    if (list) {
      chosenCity
        ? list.classList.remove("visible")
        : list.classList.add("visible");
    }
  };

  const setOptionsCoordinates = () => {
    const input = cityInputRef.current;
    const list = cityDropDownListRef.current;

    if (input && list) {
      list.style.top = input.getBoundingClientRect().bottom + 20 + "px";
      if (value && !list.classList.contains("visible")) {
        list.classList.add("visible");
      } else if (!value) {
        list.classList.remove("visible");
      }
    }
  };

  const dropDownClickHandler = (city: Interfaces.ICityList) => {
    handleInputChange(
      `${city.name}, ${city.state ? city.state + ", " : ""}${city.country}`,
      city
    );
  };

  const dropDownListBuilder = () => {
    if (isLoading) return <LinearProgress />;

    return citySearchResults.length ? (
      citySearchResults.map((el) => (
        <div
          className="drop-down-city-list__item"
          key={String(el.lat + el.lon)}
          onClick={() => dropDownClickHandler(el)}
        >{`${el.name}, ${el.state ? el.state + ", " : ""}${el.country}`}</div>
      ))
    ) : (
      <div className="drop-down-info-text">
        No data in our database for your query
      </div>
    );
  };

  const inputValueChangeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    handleInputChange(e.target.value);
    handleChosenCityReset();
    if (e.target.value) {
      handleLoadingReset();
    }
  };

  return (
    <StyledAddLocationModal open={open} onClose={handleClose}>
      <div className="dialog-modal">
        <DialogTitle>Enter city name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Start printing the city name and we will show you available matches
            from our database...
          </DialogContentText>
          <TextField
            value={value}
            onChange={inputValueChangeHandler}
            id="name"
            autoFocus
            fullWidth
            margin="dense"
            autoComplete="off"
            variant="standard"
            ref={cityInputRef}
            className="city-search__input"
          />
          <div className="confirm-city-btn__wrapper">
            <Button
              variant="contained"
              className="confirm-city-btn"
              disabled={!Boolean(chosenCity)}
              onClick={handleSingleCityWeatherFetch}
            >
              {isFetchPending() ? (
                <CircularProgress size={20} id="circular-progress" />
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </DialogContent>

        <div className="drop-down-city-list" ref={cityDropDownListRef}>
          {dropDownListBuilder()}
        </div>
      </div>
    </StyledAddLocationModal>
  );
};

export default AddLocationModal;
