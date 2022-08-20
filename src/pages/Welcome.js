import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../assets/style/welcome.scss";
import { Input, Button, notification } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { generateDiceBearBottts } from "../utils/helpers";
import Draw4 from "../assets/images/uno-package/Wild_Draw.png";
import Wild from "../assets/images/uno-package/Wild.png";

export default function Welcome() {
  const navigate = useNavigate();

  const [numberOfPlayers, setNumberOfPlayers] = useState(null);
  const [players, setPlayers] = useState([]);

  const MINIMUM_PLAYERS_ALLOWED = 2;
  const MAXIMUM_PLAYERS_ALLOWED = 7;

  function numberOfPlayersValidation() {
    if (
      !numberOfPlayers ||
      numberOfPlayers < MINIMUM_PLAYERS_ALLOWED ||
      numberOfPlayers > MAXIMUM_PLAYERS_ALLOWED
    ) {
      notification.error({
        message: "Error",
        description: `Sorry, UNO can be played with ${MINIMUM_PLAYERS_ALLOWED} to ${MAXIMUM_PLAYERS_ALLOWED} players only.`,
      });
      return false;
    }
    return true;
  }

  function createPlayers() {
    let players = [];
    for (let index = 0; index < numberOfPlayers; index++) {
      players.push({
        name: `Player ${index + 1}`,
        // hasFinished: index === 1 || index === 2 ? true : false,
        hasFinished: false,
        cards: [],
        displayPicture: generateDiceBearBottts(Math.random()),
      });
    }
    setPlayers(players);
  }

  const handleNumberOfPlayers = () => {
    const isValid = numberOfPlayersValidation();
    if (!isValid) return;
    createPlayers();
  };

  const saveUserNames = (name, index) => {
    let names = [...players];
    names[index].name = name;
    setPlayers(names);
  };

  const checkIfNameIsDuplicate = (players) => {
    const names = players.map((item) => item.name);
    const uniqueNames = Array.from(new Set(names));

    if (names.length === uniqueNames.length) {
      return false;
    } else {
      return true;
    }
  };

  const handlePlay = () => {
    const isNameDuplicate = checkIfNameIsDuplicate(players);
    if (isNameDuplicate) {
      notification.error({
        message: "Error",
        description: `Names cannot be repeated.`,
      });
      return;
    }
    navigate("/play", { state: { players: players } });
  };

  return (
    <div className="main-container">
      {/* <Header /> */}
      <div className="welcome-main">
        <div className="tilt">
          <img style={{ height: "150px", width: "110px" }} src={Wild} />
        </div>
        <div className="tilt-2">
          <img style={{ height: "150px", width: "110px" }} src={Draw4} />
        </div>
        <div className="tilt-3">
          <img style={{ height: "150px", width: "110px" }} src={Draw4} />
        </div>
        <div className="tilt-4">
          <img style={{ height: "150px", width: "110px" }} src={Wild} />
        </div>
        <div className="title">UNO</div>
        {/* <div className="subtitle">Let's Play!</div> */}
        <div className="initial-info-form">
          <Input
            placeholder="Enter number of players"
            className="no-of-players"
            type="number"
            onChange={(e) => setNumberOfPlayers(e.target.value)}
          />
          <Button
            className="confirm-btn"
            type="primary"
            // shape="round"
            size={"large"}
            onClick={handleNumberOfPlayers}
          >
            Confirm
          </Button>
        </div>

        {players?.length
          ? players.map((item, index) => {
              return (
                <div className="initial-info-form">
                  <Input
                    placeholder="Enter number of players"
                    className="no-of-players__no-button"
                    type="text"
                    defaultValue={item?.name}
                    onBlur={(e) => saveUserNames(e.target.value, index)}
                  />
                </div>
              );
            })
          : null}
        {players?.length ? (
          <Button
            className="play-btn"
            style={{ width: "30%", margin: "15px 0" }}
            type="primary"
            // shape="round"
            size={"large"}
            onClick={handlePlay}
          >
            Play
          </Button>
        ) : null}
      </div>
    </div>
  );
}
