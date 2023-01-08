import StyledFullScreenLoader from "../../styles/StyledFullScreenLoader";
import CircularProgress from "@mui/material/CircularProgress";

export const FullScreenLoader = () => {
  return (
    <StyledFullScreenLoader>
      <div className="details-wrapper">
        <CircularProgress color="inherit" />
      </div>
    </StyledFullScreenLoader>
  );
};
