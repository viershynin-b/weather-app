import styled from "styled-components";

const StyledWeatherWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 80px 20px 20px;

  .no-cards-placeholder {
    width: 100%;
    text-align: center;
    color: rgba(0, 0, 0, 0.5);
    font-style: italic;
  }
  .card__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    padding: 16px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: rgba(256, 256, 256, 0.7);
    transition: 0.3s;
    :hover {
      color: white;
      transform: translateY(-5px);
      box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 1);
      .card-header__actions {
        visibility: visible;
        opacity: 1;
      }
    }
    .card-header__wrapper {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      .card-header__text {
        padding: 0px;
      }
    }
    .card-content__wrapper {
      padding: 0px;
      :last-child {
        padding: 0px;
      }
      .temperature-main {
        font-size: 50px;
      }
    }
  }
  .add-city-btn {
    border: 1px solid grey;
    opacity: 70%;
    bottom: 50px;
    right: 50px;
    position: fixed;
    z-index: 1000;
    transition: all 0.3s;
    background-color: rgba(5, 10, 50, 1);
    &:hover {
      background-color: rgba(5, 10, 50, 1);
      opacity: 100%;
    }
  }
  .dialog-modal {
    max-width: 500px;
    min-height: 250px;
  }
  .card-header__actions {
    margin-right: 0px;
    visibility: hidden;
    opacity: 0;
    transition: all 0.4s;
    button {
      padding: 3px;
    }
    .card-header__actions__icon {
      width: 17px;
      height: 17px;
    }
    .refresh-icon {
      :hover {
        color: blue;
      }
    }
    .clear-icon {
      :hover {
        color: red;
      }
    }
  }
  .spinning-refresh-btn {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

export default StyledWeatherWrapper;
