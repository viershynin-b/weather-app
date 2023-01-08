import styled from "styled-components";
import { Dialog } from "@mui/material";

const StyledAddLocationModal = styled(Dialog)`
  .dialog-modal {
    max-width: 500px;
  }
  .drop-down-city-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 300px;
    padding: 10px 24px;
    background-color: white;
    z-index: 1000;
    position: fixed;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s;
    min-height: 50px;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
      0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
    .drop-down-city-list__item {
      cursor: pointer;
      padding: 3px;
      :hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
  .visible {
    opacity: 1;
    visibility: visible;
  }
  .confirm-city-btn__wrapper {
    display: flex;
    justify-content: flex-end;
    .confirm-city-btn {
      width: 100px;
      height: 36px;
      background-color: rgba(5, 10, 50, 1);
      color: white;
      :disabled {
        background-color: rgba(5, 10, 50, 0.5);
        color: white;
      }
      #circular-progress {
        color: white;
      }
    }
  }
  .city-search__input {
    margin-bottom: 20px;
  }
  .drop-down-info-text {
    text-align: center;
  }
`;

export default StyledAddLocationModal;
