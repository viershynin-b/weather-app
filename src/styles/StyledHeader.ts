import styled from "styled-components";

const StyledHeader = styled.div`
  z-index: 100;
  height: 50px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: white;
  font-weight: 800;
  font-size: 30px;
  position: absolute;
  top: 0;
  transition: all 0.3s;

  box-shadow: 0px 14px 29px -11px rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(15px);
  .header-icon {
    cursor: pointer;
    :hover {
      transform: scale(1.1);
      box-shadow: 0px 0px 72px -16px rgba(0, 0, 0, 0.4);
      .card-header__actions {
        visibility: visible;
        opacity: 1;
      }
    }
  }
`;

export default StyledHeader;
