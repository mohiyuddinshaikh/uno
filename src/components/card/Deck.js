import React from "react";
import "../../assets/style/card.scss";
import DeckImage from "../../assets/images/uno-package/Deck.png";

export default function Deck() {
  return (
    <img
      className="card-image"
      style={{ height: "150px", width: "110px" }}
      src={DeckImage}
    />
  );
}
