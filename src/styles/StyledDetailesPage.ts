import styled from "styled-components";
import image from "../images/city-details-bg.jpg";

const StyledDetailesPage = styled.div`
  margin: 0;
  background: #111;
  width: 100%;
  * {
    box-sizing: border-box;
  }
  .weather-app {
    box-sizing: border-box;
    min-height: 100vh;
    background: url(${image});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: #fff;
    position: relative;
    z-index: 0;
    display: flex;
    @media screen and (max-width: 1000px) {
      flex-direction: column;
    }
    .main-weather-data-container {
      width: calc(100% - 350px);
      display: flex;
      flex-direction: column-reverse;
      align-items: flex-start;
      justify-content: space-between;
      padding: 100px 50px 50px;
      @media screen and (max-width: 1000px) {
        padding: 70px 50px 50px;
        width: 100%;
        flex-direction: column;
      }
      @media screen and (max-width: 500px) {
        padding: 70px 20px 50px;
      }
      .inner-container {
        height: fit-content;
        display: flex;
        width: 100%;
        @media screen and (max-width: 1000px) {
          margin: 0 0 30px;
        }
        .temp {
          font-size: 90px;
          line-height: 90px;
          margin-right: 10px;
        }
        .city-name-timezone {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          margin-right: 5px;
          .name {
            font-size: 35px;
            margin-bottom: 5px;
          }
          .timezone {
            font-weight: 700;
          }
        }
        .weather-icon {
          margin-top: 26px;
        }
      }
      .weather-bar-chart {
        display: flex;
        height: 180px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        max-width: 700px;
        width: 100%;
        .weather-column {
          width: 6.25%;
          position: relative;
          border-right: 1px solid rgba(255, 255, 255, 0.3);
          @media screen and (max-width: 1000px) {
            :nth-child(even) {
              .forecast-time {
                display: none;
              }
            }
          }
          .weather-bar {
            position: absolute;
            height: 20px;
            width: 100%;
            bottom: 0%;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 500;
            border-radius: 5px;
            cursor: pointer;
            transition: all 1.5s;
            @media screen and (max-width: 1000px) {
              font-size: 10px;
            }
          }
          .forecast-time {
            position: absolute;
            bottom: -20px;
            font-size: 11px;
          }
        }
      }
    }
    .panel {
      margin: 50px 0 0 0;
      width: 350px;
      padding: 50px 25px 25px;
      height: calc(100vh - 50px);
      border-top: none;
      @media screen and (max-width: 1000px) {
        margin: 0;
        width: 100%;
        padding: 25px 50px;
      }
      @media screen and (max-width: 500px) {
        padding: 20px;
      }
      .weather-details-header {
        font-weight: 800;
        margin-bottom: 35px;
      }
      ul {
        margin: 0 0 45px;
        padding: 0;
        li {
          display: flex;
          justify-content: space-between;
          margin-bottom: 35px;
          span:last-child {
            font-weight: 500;
          }
        }
      }
    }
  }
  .glass-texture {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

export default StyledDetailesPage;
