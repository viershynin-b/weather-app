import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchAllWeather } from "./store/weather-slice";
import { RootState } from "./store";

import MainHeader from "./components/UI/MainHeader";
import MainPage from "./pages/MainPage";
import DetailsPage from "./pages/DetailsPage";
import { PRIMARY_CITY_LIST } from "./utils/GLOBAL_VARS";

function App() {
  const dispatch = useAppDispatch();
  const toastifySettings = useAppSelector(
    (state: RootState) => state.weather.toastifySettings
  );
  
  useEffect(() => {
    const cityList = localStorage.getItem("cityList");

    if (cityList && cityList !== "[]") {
      const parsedList = safeParser(cityList);
      dispatch(fetchAllWeather(parsedList));
    } else {
      localStorage.setItem("cityList", JSON.stringify(PRIMARY_CITY_LIST));
      dispatch(fetchAllWeather(PRIMARY_CITY_LIST));
    }
  }, [dispatch]);

  useEffect(() => {
    toastifyBuilderAndLauncher(toastifySettings.type, toastifySettings.message);
  }, [toastifySettings]);

  const toastOptions = {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const toastifyBuilderAndLauncher = (
    type: string,
    msg: string,
    additionalOptions: { autoClose?: number; closeOnClick?: boolean } = {}
  ) => {
    switch (type) {
      case "success":
        toast.success(msg, { ...toastOptions, ...additionalOptions });
        break;
      case "error":
        toast.error(msg, { ...toastOptions, ...additionalOptions });
        break;
      case "info":
        toast.info(msg, { ...toastOptions, ...additionalOptions });
        break;
    }
  };

  const safeParser = (stringifiedWeather: string) => {
    try {
      const parsedWeather = JSON.parse(stringifiedWeather);
      return parsedWeather;
    } catch (error) {
      return PRIMARY_CITY_LIST;
      //add notifications
    }
  };

  return (
    <BrowserRouter>
      <MainHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path={"/:cityName"} element={<DetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        style={{ width: "auto", maxWidth: "700px", zIndex: 99999999 }}
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
