import HomeIcon from "@mui/icons-material/Home";
import { useLocation, useNavigate } from "react-router-dom";

import StyledHeader from "../../styles/StyledHeader";

const MainHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <StyledHeader>
      OpenWeather
      {!location.pathname.includes("weather-app") && (
        <HomeIcon
          fontSize="large"
          className="header-icon"
          onClick={() => navigate("/")}
        />
      )}
    </StyledHeader>
  );
};

export default MainHeader;
