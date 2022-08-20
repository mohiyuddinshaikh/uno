import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cards } from "../assets/cards/packOfCards";
import Card from "../components/card/Card";
import { NUMBER_OF_CARDS_PER_PLAYER } from "../utils/constants";
import { generateRandomNumber, shuffle } from "../utils/helpers";
import BackgroundImage from "../assets/images/uno-package/Table_0.png";
import { Button, Avatar, notification, Modal } from "antd";
import "../assets/style/play.scss";
import Deck from "../components/card/Deck";
import {
  RightOutlined,
  LeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

export default function Play() {
  const location = useLocation();
  const navigate = useNavigate();
  let scrollRef = useRef(null);

  const [initialPlayers, setInitialPlayers] = useState(null);
  const [deckOfCards, setDeckOfCards] = useState(cards);
  const [players, setPlayers] = useState(null);
  const [playedCards, setPlayedCards] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [nextPlayer, setNextPlayer] = useState(1);
  const [flowOfGame, setFlowOfGame] = useState("right");
  // play states
  const [hasDrawn, setHasDrawn] = useState(false);
  const [wild, setWild] = useState(null);
  const [showChooseColorModal, setShowChooseColorModal] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  //

  // console.log("location", location);
  // console.log("initialPlayers", initialPlayers);
  console.log("deckOfCards", deckOfCards);
  console.log("players", players);
  console.log("currentPlayer", currentPlayer);
  console.log("playedCards.length", playedCards.length);

  const DISPLAY_PICTURE_ALT = "https://joeschmoe.io/api/v1/0";
  const COLORS = [
    { name: "blue", code: "#0096FF", id: 1 },
    { name: "green", code: "#50C878", id: 2 },
    {
      name: "red",
      code: "#EE4B2B",
      id: 3,
    },
    { name: "yellow", code: "#FFEA00", id: 4 },
  ];

  const illegalCardNotification = () => {
    notification.error({
      message: "Error",
      description: "Illegal Card",
    });
  };

  useEffect(() => {
    handleSetPlayersFromLocation();
  }, []);

  useEffect(() => {
    if (initialPlayers) {
      allotCardsToPlayers();
    }
  }, [initialPlayers]);

  useEffect(() => {
    postCardPlayedOperations();
  }, [playedCards]);

  const scrollCards = (shift) => {
    scrollRef.current.scrollLeft += shift;
  };

  const postCardPlayedOperations = () => {
    // disable wild cards
    disableWildCards();
    // is game finised
    const hasAllFinished =
      players && players.filter((player) => player.hasFinished === false);
    if (hasAllFinished?.length === 1) {
      setIsGameFinished(true);
    }
    // is deck of cards empty
    if (deckOfCards?.length === 0) {
      const tempPlayedCards = [...playedCards];
      const firstPlayedCard = tempPlayedCards.splice(0, 1);

      setPlayedCards(firstPlayedCard);
      setDeckOfCards([...tempPlayedCards]);
    }
  };

  const handleSetPlayersFromLocation = () => {
    if (initialPlayers?.length) return;
    setInitialPlayers(location?.state?.players);
  };

  const generateRandomCards = (numberOfCards, maxNumberLimit) => {
    let cardIndices = [];
    while (cardIndices?.length < numberOfCards) {
      const randomIndex = generateRandomNumber(0, maxNumberLimit);
      if (!cardIndices.includes(randomIndex)) {
        cardIndices.push(randomIndex);
      }
    }
    return cardIndices;
  };

  const convertIndicesToCards = (playersList) => {
    let players = [...playersList];
    let tempDeckOfCards = [...deckOfCards];
    players.forEach((playerElement) => {
      playerElement.cards.forEach((card, index) => {
        playerElement.cards.splice(index, 1, tempDeckOfCards[card]);
        tempDeckOfCards.splice(card, 1, null);
      });
    });
    return { players, tempDeckOfCards };
  };

  const removePlayerCardsFromDeck = (deckCardsWithNull) => {
    const deck = deckCardsWithNull.filter((item) => item !== null);
    const shuffledDeck = shuffle(deck);
    setDeckOfCards([...shuffledDeck]);
  };

  const allotCardsToPlayers = () => {
    /**
     * 1. generate random cards
     * 2. distribute those cards index to players object
     * 3. convert these indices to cards by mapping to original deck of cards
     * 4. remove the players cards indices from original deck of cards
     */
    // 1
    const allPlayerCards = generateRandomCards(
      initialPlayers?.length * NUMBER_OF_CARDS_PER_PLAYER,
      deckOfCards?.length - 1
    );
    console.log("allPlayerCards", allPlayerCards);
    console.log("allPlayerCards.length", allPlayerCards.length);
    // 5

    // 2
    const tempPlayers = [...initialPlayers];
    tempPlayers.forEach((player, playerIndex) => {
      let cardsCount = 0;
      let index = playerIndex;
      while (cardsCount < NUMBER_OF_CARDS_PER_PLAYER) {
        player.cards.push(allPlayerCards[index]);
        cardsCount++;
        index += initialPlayers.length;
      }
    });
    // 3
    const playersWithFinalCards = convertIndicesToCards(tempPlayers);
    // 4
    removePlayerCardsFromDeck(playersWithFinalCards.tempDeckOfCards);
    setPlayers(playersWithFinalCards?.players);
    allotFirstPlayedCard(playersWithFinalCards.tempDeckOfCards);
  };

  const allotFirstPlayedCard = (tempDeckOfCards) => {
    const playedCard = [];
    const filteredDeckOfCards = tempDeckOfCards.filter((item) => item !== null);

    const card = generateRandomCards(1, filteredDeckOfCards?.length - 1);
    playedCard.push(filteredDeckOfCards[card]);
    filteredDeckOfCards.splice(card, 1);

    setPlayedCards(playedCard);
    setDeckOfCards(filteredDeckOfCards);
  };

  const ShowCurrentPlayerCards = () => {
    return (
      <div className="current-player-card-container" ref={scrollRef}>
        {players[currentPlayer].cards.map((card, index) => {
          return (
            <div onClick={() => handlePlayCard(index)}>
              <Card card={card} />
            </div>
          );
        })}
      </div>
    );
  };

  const checkIfPlayerHasFinishedRecursively = (index) => {
    if (flowOfGame === "right") {
      if (index > players.length - 1) {
        return checkIfPlayerHasFinishedRecursively(0);
      }
      if (!players[index].hasFinished) {
        return index;
      } else {
        return checkIfPlayerHasFinishedRecursively(index + 1);
      }
    } else if (flowOfGame === "left") {
      if (index < 0) {
        return checkIfPlayerHasFinishedRecursively(players.length - 1);
      }
      if (!players[index].hasFinished) {
        return index;
      } else {
        return checkIfPlayerHasFinishedRecursively(index - 1);
      }
    }
    return 0;
  };

  const handleDraw = () => {
    const tempDeck = [...deckOfCards];
    const tempPlayers = [...players];
    tempPlayers[currentPlayer].cards.unshift(tempDeck[0]);
    tempDeck.splice(0, 1);
    setHasDrawn(true);
    setDeckOfCards([...tempDeck]);
  };

  const handlePass = (params) => {
    const updatedFlowOfGame = params?.updatedFlowOfGame;
    const skip = params?.skip;

    let flow =
      typeof updatedFlowOfGame === "string" ? updatedFlowOfGame : flowOfGame;

    if (flow === "right") {
      if (currentPlayer === players.length - 1) {
        let tempCurrentPlayer = checkIfPlayerHasFinishedRecursively(
          !skip ? 0 : 0 + 1
        );
        let tempNextPlayer = checkIfPlayerHasFinishedRecursively(
          tempCurrentPlayer === players.length - 1 ? 0 : tempCurrentPlayer + 1
        );
        setCurrentPlayer(tempCurrentPlayer);
        setNextPlayer(tempNextPlayer);
      } else {
        let tempCurrentPlayer = checkIfPlayerHasFinishedRecursively(
          !skip ? currentPlayer + 1 : currentPlayer + 1 + 1
        );
        let tempNextPlayer = checkIfPlayerHasFinishedRecursively(
          tempCurrentPlayer === players.length - 1 ? 0 : tempCurrentPlayer + 1
        );
        setCurrentPlayer(tempCurrentPlayer);
        setNextPlayer(tempNextPlayer);
      }
    } else if (flow === "left") {
      if (currentPlayer === 0) {
        let tempCurrentPlayer = checkIfPlayerHasFinishedRecursively(
          !skip ? players.length - 1 : players.length - 1 - 1
        );
        let tempNextPlayer = checkIfPlayerHasFinishedRecursively(
          tempCurrentPlayer === 0 ? players.length - 1 : tempCurrentPlayer - 1
        );
        setCurrentPlayer(tempCurrentPlayer);
        setNextPlayer(tempNextPlayer);
      } else {
        let tempCurrentPlayer = checkIfPlayerHasFinishedRecursively(
          !skip ? currentPlayer - 1 : currentPlayer - 1 - 1
        );
        let tempNextPlayer = checkIfPlayerHasFinishedRecursively(
          tempCurrentPlayer === 0 ? players.length - 1 : tempCurrentPlayer - 1
        );
        setCurrentPlayer(tempCurrentPlayer);
        setNextPlayer(tempNextPlayer);
      }
    }
    if (hasDrawn) {
      setHasDrawn(false);
    }
  };

  const handlePlayCard = (playedCardIndex) => {
    const tempPlayers = [...players];
    if (!tempPlayers.length) {
      return;
    }
    const topCard = playedCards[0];
    const playedCard = tempPlayers[currentPlayer].cards[playedCardIndex];

    if (!playedCard) {
      return;
    }

    if (!topCard) {
      playOperation(tempPlayers, playedCardIndex, playedCard);
      return;
    }

    switch (playedCard.subType) {
      case 1:
        // numbered
        playNumberedCard(topCard, playedCard, tempPlayers, playedCardIndex);
        break;
      case 2:
        // draw 2
        playDrawTwoCard(topCard, playedCard, tempPlayers, playedCardIndex, 2);
        break;
      case 3:
        // skip
        playSkipCard(topCard, playedCard, tempPlayers, playedCardIndex);
        break;
      case 4:
        // reverse
        playReverseCard(topCard, playedCard, tempPlayers, playedCardIndex);
        break;
      case 5:
        // draw 4
        playDrawTwoCard(topCard, playedCard, tempPlayers, playedCardIndex, 4);
        break;
      case 6:
        // wild card
        playWildCard(topCard, playedCard, tempPlayers, playedCardIndex, 4);
        break;

      default:
        break;
    }
  };

  const disableWildCards = () => {
    if (wild && playedCards[0].subType !== 5 && playedCards[0].subType !== 6) {
      setWild(null);
    }
  };

  const playOperation = (tempPlayers, playedCardIndex, playedCard) => {
    tempPlayers[currentPlayer].cards.splice(playedCardIndex, 1);
    if (!tempPlayers[currentPlayer].cards.length) {
      tempPlayers[currentPlayer].hasFinished = true;
    }
    const tempPlayedCards = [...playedCards];
    tempPlayedCards.unshift(playedCard);
    setPlayedCards([...tempPlayedCards]);
    setPlayers([...tempPlayers]);
    handlePass();
  };

  const playNumberedCard = (
    topCard,
    playedCard,
    tempPlayers,
    playedCardIndex
  ) => {
    if (
      playedCard.color === topCard.color ||
      playedCard.primaryTitle === topCard.primaryTitle
    ) {
      playOperation(tempPlayers, playedCardIndex, playedCard);
    } else if (
      (topCard.subType === 5 || topCard.subType === 6) &&
      playedCard.color === wild
    ) {
      playOperation(tempPlayers, playedCardIndex, playedCard);
    } else {
      illegalCardNotification();
      return;
    }
  };

  const showColorModal = () => {
    setShowChooseColorModal(true);
  };

  const hideColorModal = () => {
    setShowChooseColorModal(false);
  };

  const handleWildColorSelect = (item) => {
    console.log("item", item);
    switch (item.name) {
      case "blue":
        setWild(1);
        break;
      case "green":
        setWild(2);
        break;
      case "red":
        setWild(3);
        break;
      case "yellow":
        setWild(4);
        break;

      default:
        setWild(null);
        break;
    }
    hideColorModal();
  };

  const playDrawTwoCard = (
    topCard,
    playedCard,
    tempPlayers,
    playedCardIndex,
    numberOfCards
  ) => {
    console.log("topCard", topCard);
    console.log("playedCard", playedCard);
    let illegalCard = false;

    if (
      numberOfCards === 2 &&
      topCard.subType !== 5 &&
      topCard.subType !== 6 &&
      topCard.subType !== 2 &&
      topCard.color !== playedCard.color
    ) {
      illegalCard = true;
    }

    if (
      numberOfCards === 2 &&
      (topCard.subType === 5 || topCard.subType === 6) &&
      playedCard.color !== wild
    ) {
      illegalCard = true;
    }

    if (illegalCard) {
      illegalCardNotification();
      return;
    }

    const tempDeckOfCards = [...deckOfCards];
    const draw2Cards = tempDeckOfCards.slice(0, numberOfCards);
    tempDeckOfCards.splice(0, numberOfCards);
    tempPlayers[nextPlayer].cards.unshift([...draw2Cards]);
    const playersWithFlattenedCards = [].concat.apply(
      [],
      tempPlayers[nextPlayer].cards
    );
    tempPlayers[nextPlayer].cards = [...playersWithFlattenedCards];
    tempPlayers[currentPlayer].cards.splice(playedCardIndex, 1);
    if (!tempPlayers[currentPlayer].cards.length) {
      tempPlayers[currentPlayer].hasFinished = true;
    }

    const tempPlayedCards = [...playedCards];
    tempPlayedCards.unshift(playedCard);

    setPlayers(tempPlayers);
    setDeckOfCards(tempDeckOfCards);
    setPlayedCards(tempPlayedCards);

    if (numberOfCards === 4) {
      showColorModal();
    }

    handlePass({ skip: true });
  };

  const playWildCard = (topCard, playedCard, tempPlayers, playedCardIndex) => {
    const tempPlayedCards = [...playedCards];
    tempPlayedCards.unshift(playedCard);
    tempPlayers[currentPlayer].cards.splice(playedCardIndex, 1);
    if (!tempPlayers[currentPlayer].cards.length) {
      tempPlayers[currentPlayer].hasFinished = true;
    }

    const tempDeckOfCards = [...deckOfCards];
    tempDeckOfCards.splice(0, 1);

    showColorModal();

    setPlayedCards(tempPlayedCards);
    setDeckOfCards(tempDeckOfCards);
    setPlayers(tempPlayers);

    handlePass();
  };

  const playReverseCard = (
    topCard,
    playedCard,
    tempPlayers,
    playedCardIndex
  ) => {
    let illegalCard = false;

    if (
      topCard.subType !== 5 &&
      topCard.subType !== 6 &&
      topCard.subType !== 4 &&
      topCard.color !== playedCard.color
    ) {
      illegalCard = true;
    }

    if (
      (topCard.subType === 5 || topCard.subType === 6) &&
      playedCard.color !== wild
    ) {
      illegalCard = true;
    }

    if (illegalCard) {
      illegalCardNotification();
      return;
    }

    let updatedFlowOfGame = null;

    if (flowOfGame === "right") {
      setFlowOfGame("left");
      updatedFlowOfGame = "left";
    } else {
      setFlowOfGame("right");
      updatedFlowOfGame = "right";
    }

    const tempPlayedCards = [...playedCards];
    tempPlayedCards.unshift(playedCard);
    tempPlayers[currentPlayer].cards.splice(playedCardIndex, 1);
    if (!tempPlayers[currentPlayer].cards.length) {
      tempPlayers[currentPlayer].hasFinished = true;
    }

    const tempDeckOfCards = [...deckOfCards];
    tempDeckOfCards.splice(0, 1);

    setPlayedCards(tempPlayedCards);
    setDeckOfCards(tempDeckOfCards);
    setPlayers(tempPlayers);
    handlePass({ updatedFlowOfGame });
  };

  const playSkipCard = (topCard, playedCard, tempPlayers, playedCardIndex) => {
    let illegalCard = false;

    if (
      topCard.subType !== 5 &&
      topCard.subType !== 6 &&
      topCard.subType !== 3 &&
      topCard.color !== playedCard.color
    ) {
      illegalCard = true;
    }

    if (
      (topCard.subType === 5 || topCard.subType === 6) &&
      playedCard.color !== wild
    ) {
      illegalCard = true;
    }

    if (illegalCard) {
      illegalCardNotification();
      return;
    }

    const tempPlayedCards = [...playedCards];
    tempPlayedCards.unshift(playedCard);
    tempPlayers[currentPlayer].cards.splice(playedCardIndex, 1);
    if (!tempPlayers[currentPlayer].cards.length) {
      tempPlayers[currentPlayer].hasFinished = true;
    }

    setPlayedCards(tempPlayedCards);
    setPlayers(tempPlayers);
    handlePass({ skip: true });
  };

  const NonNextPlayers = () => {
    return (
      <div className="non-next__container">
        <div className="title">Other Players</div>
        <div className="container">
          {players?.length &&
            players.map((item, index) => {
              return !item.hasFinished &&
                index !== currentPlayer &&
                index !== nextPlayer ? (
                <div className="remaining-cards">
                  <Avatar src={item.displayPicture} size={"medium"} />
                  <p>{item.cards?.length}</p>
                </div>
              ) : (
                ""
              );
            })}
        </div>
      </div>
    );
  };

  const NextPlayer = () => {
    const MAXIMUM_CARDS_TO_SHOW = 4;
    return (
      <div className="container">
        <div className="player-info">
          <PlayerAvatarBlock
            type={2}
            title={"Next Player :"}
            image={players?.length && players[nextPlayer].displayPicture}
            name={players?.length && players[nextPlayer].name}
            count={players?.length && players[nextPlayer].cards.length}
          />
        </div>
        {currentPlayer !== nextPlayer ? (
          <div className="cards">
            {players?.length &&
              players[nextPlayer].cards.map((item, index) => {
                return index <= MAXIMUM_CARDS_TO_SHOW - 1 ? <Deck /> : null;
              })}
            {players?.length &&
            players[nextPlayer]?.cards?.length > MAXIMUM_CARDS_TO_SHOW ? (
              <div className="additional-cards-text">
                +{players[nextPlayer]?.cards?.length - MAXIMUM_CARDS_TO_SHOW}
              </div>
            ) : null}
          </div>
        ) : null}
        <div></div>
      </div>
    );
  };

  const NonPlayerBlock = () => {
    return (
      <div className="non-player-block__main">
        <div className="next__block">
          <NextPlayer />
        </div>
        <div className="non-next__block">
          <NonNextPlayers />
        </div>
      </div>
    );
  };

  const WildColorStroke = () => {
    const color = COLORS.find((item) => item.id === wild);
    return (
      <div
        className="color-block"
        style={{ backgroundColor: color?.code || "gray" }}
      ></div>
    );
  };

  const GameplayCardsBlock = () => {
    return (
      <div className="gameplay-block__main">
        <div className="played-card-container">
          {wild ? (
            <>
              <WildColorStroke />
              <Card
                card={playedCards.length && playedCards[0]}
                noRaise={true}
              />
              <WildColorStroke />
            </>
          ) : (
            <Card card={playedCards.length && playedCards[0]} noRaise={true} />
          )}
        </div>
        <Deck />
      </div>
    );
  };

  const PlayerAvatarBlock = ({ title, image, name, count, type }) => {
    return (
      <div className="avatar-block__main">
        <div className="title">{title}</div>
        {type === 2 && currentPlayer === nextPlayer ? (
          "NONE"
        ) : (
          <>
            <Avatar size={70} src={image} alt={DISPLAY_PICTURE_ALT} />
            <div className="name">{name}</div>
            <div className="card-left">Cards Left : {count}</div>
          </>
        )}
      </div>
    );
  };

  const PlayerCards = () => {
    return (
      <div className="parent-container">
        {players?.length ? <ShowCurrentPlayerCards /> : null}
      </div>
    );
  };

  const PlayerActions = () => {
    return (
      <div className="actions__main">
        <Button
          type="primary"
          shape="round"
          size={"large"}
          onClick={handleDraw}
          disabled={hasDrawn}
        >
          Draw
        </Button>
        <Button
          type="primary"
          shape="round"
          size={"large"}
          onClick={handlePass}
          disabled={!hasDrawn}
        >
          Pass
        </Button>
      </div>
    );
  };

  const PlayerBlock = () => {
    return (
      <div className="player-block__main">
        <div className="avatar-block">
          <PlayerAvatarBlock
            type={1}
            title={"Now Playing :"}
            image={players?.length && players[currentPlayer].displayPicture}
            name={players?.length && players[currentPlayer].name}
            count={players?.length && players[currentPlayer].cards.length}
          />
        </div>
        <div className="card-block">
          <LeftOutlined onClick={() => scrollCards(-200)} />
          <PlayerCards />
          <RightOutlined onClick={() => scrollCards(+200)} />
        </div>
        <div className="action-block">
          <PlayerActions />
        </div>
      </div>
    );
  };

  const finishGame = () => {
    navigate("/");
  };

  const Loading = () => {
    return (
      <div className="loading-container">
        <LoadingOutlined style={{ fontSize: "40px", color: "white" }} />
        <div className="text"> Setting Up Your Game... </div>
      </div>
    );
  };

  return !players && !playedCards.length ? (
    <Loading />
  ) : (
    <div className="play__parent">
      <NonPlayerBlock />
      <GameplayCardsBlock />
      <PlayerBlock />
      <Modal
        title="Choose Color"
        visible={showChooseColorModal}
        footer={null}
        closable={false}
      >
        <div className="circle-container">
          {COLORS.map((item, index) => {
            return (
              <div
                className="circle"
                style={{
                  backgroundColor: item?.code,
                }}
                key={index}
                onClick={() => handleWildColorSelect(item)}
              ></div>
            );
          })}
        </div>
      </Modal>
      <Modal
        title="Game Complete"
        centered
        visible={isGameFinished}
        footer={null}
        closable={false}
      >
        <div className="game-done-container">
          <div className="title">Player {currentPlayer + 1} Loses !!!</div>
          <Button size="large" onClick={finishGame} type="primary">
            Finish
          </Button>
        </div>
      </Modal>
    </div>
  );
}
