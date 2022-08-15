import React from "react";
import "../../assets/style/card.scss";
import Blue0 from "../../assets/images/uno-package/Blue_0.png";
import Blue1 from "../../assets/images/uno-package/Blue_1.png";
import Blue2 from "../../assets/images/uno-package/Blue_2.png";
import Blue3 from "../../assets/images/uno-package/Blue_3.png";
import Blue4 from "../../assets/images/uno-package/Blue_4.png";
import Blue5 from "../../assets/images/uno-package/Blue_5.png";
import Blue6 from "../../assets/images/uno-package/Blue_6.png";
import Blue7 from "../../assets/images/uno-package/Blue_7.png";
import Blue8 from "../../assets/images/uno-package/Blue_8.png";
import Blue9 from "../../assets/images/uno-package/Blue_9.png";
import BlueDraw from "../../assets/images/uno-package/Blue_Draw.png";
import BlueReverse from "../../assets/images/uno-package/Blue_Reverse.png";
import BlueSkip from "../../assets/images/uno-package/Blue_Skip.png";
//
import Green0 from "../../assets/images/uno-package/Green_0.png";
import Green1 from "../../assets/images/uno-package/Green_1.png";
import Green2 from "../../assets/images/uno-package/Green_2.png";
import Green3 from "../../assets/images/uno-package/Green_3.png";
import Green4 from "../../assets/images/uno-package/Green_4.png";
import Green5 from "../../assets/images/uno-package/Green_5.png";
import Green6 from "../../assets/images/uno-package/Green_6.png";
import Green7 from "../../assets/images/uno-package/Green_7.png";
import Green8 from "../../assets/images/uno-package/Green_8.png";
import Green9 from "../../assets/images/uno-package/Green_9.png";
import GreenDraw from "../../assets/images/uno-package/Green_Draw.png";
import GreenReverse from "../../assets/images/uno-package/Green_Reverse.png";
import GreenSkip from "../../assets/images/uno-package/Green_Skip.png";
//
import Red0 from "../../assets/images/uno-package/Red_0.png";
import Red1 from "../../assets/images/uno-package/Red_1.png";
import Red2 from "../../assets/images/uno-package/Red_2.png";
import Red3 from "../../assets/images/uno-package/Red_3.png";
import Red4 from "../../assets/images/uno-package/Red_4.png";
import Red5 from "../../assets/images/uno-package/Red_5.png";
import Red6 from "../../assets/images/uno-package/Red_6.png";
import Red7 from "../../assets/images/uno-package/Red_7.png";
import Red8 from "../../assets/images/uno-package/Red_8.png";
import Red9 from "../../assets/images/uno-package/Red_9.png";
import RedDraw from "../../assets/images/uno-package/Red_Draw.png";
import RedReverse from "../../assets/images/uno-package/Red_Reverse.png";
import RedSkip from "../../assets/images/uno-package/Red_Skip.png";
//
import Yellow0 from "../../assets/images/uno-package/Yellow_0.png";
import Yellow1 from "../../assets/images/uno-package/Yellow_1.png";
import Yellow2 from "../../assets/images/uno-package/Yellow_2.png";
import Yellow3 from "../../assets/images/uno-package/Yellow_3.png";
import Yellow4 from "../../assets/images/uno-package/Yellow_4.png";
import Yellow5 from "../../assets/images/uno-package/Yellow_5.png";
import Yellow6 from "../../assets/images/uno-package/Yellow_6.png";
import Yellow7 from "../../assets/images/uno-package/Yellow_7.png";
import Yellow8 from "../../assets/images/uno-package/Yellow_8.png";
import Yellow9 from "../../assets/images/uno-package/Yellow_9.png";
import YellowDraw from "../../assets/images/uno-package/Yellow_Draw.png";
import YellowReverse from "../../assets/images/uno-package/Yellow_Reverse.png";
import YellowSkip from "../../assets/images/uno-package/Yellow_Skip.png";
//
import Draw4 from "../../assets/images/uno-package/Wild_Draw.png";
import Wild from "../../assets/images/uno-package/Wild.png";
//
import Deck from "../../assets/images/uno-package/Deck.png";

export default function Card(props) {
  const { card, noRaise } = props;
  console.log("card", card);

  /**
   * Colors:
   * 1 - Blue
   * 2 - Green
   * 3 - Red
   * 4 - Yellow
   *
   * Type:
   * 1 - Front
   * 2- Back
   *
   * Subtype:
   * 1 - Numbered
   * 2 - Draw 2
   * 3 - Skip
   * 4 - Reverse
   * 5 - Draw 4
   * 6 - Wild
   */

  const showImage = (card) => {
    if ([1, 2, 3, 4].includes(card.subType)) {
      switch (card?.color) {
        case 1:
          switch (card?.subType) {
            case 1:
              switch (card?.primaryTitle) {
                case 0:
                  return Blue0;
                  break;
                case 1:
                  return Blue1;

                  break;
                case 2:
                  return Blue2;

                  break;
                case 3:
                  return Blue3;

                  break;
                case 4:
                  return Blue4;

                  break;
                case 5:
                  return Blue5;

                  break;
                case 6:
                  return Blue6;

                  break;
                case 7:
                  return Blue7;

                  break;
                case 8:
                  return Blue8;

                  break;
                case 9:
                  return Blue9;

                  break;

                default:
                  return Deck;
                  break;
              }
              break;
            case 2:
              return BlueDraw;
              break;
            case 3:
              return BlueSkip;
              break;
            case 4:
              return BlueReverse;
              break;

            default:
              return Deck;
              break;
          }
          break;
        case 2:
          switch (card?.subType) {
            case 1:
              switch (card?.primaryTitle) {
                case 0:
                  return Green0;
                  break;
                case 1:
                  return Green1;

                  break;
                case 2:
                  return Green2;

                  break;
                case 3:
                  return Green3;

                  break;
                case 4:
                  return Green4;

                  break;
                case 5:
                  return Green5;

                  break;
                case 6:
                  return Green6;

                  break;
                case 7:
                  return Green7;

                  break;
                case 8:
                  return Green8;

                  break;
                case 9:
                  return Green9;

                  break;

                default:
                  return Deck;
                  break;
              }
              break;
            case 2:
              return GreenDraw;
              break;
            case 3:
              return GreenSkip;
              break;
            case 4:
              return GreenReverse;
              break;

            default:
              return Deck;
              break;
          }
          break;
        case 3:
          switch (card?.subType) {
            case 1:
              switch (card?.primaryTitle) {
                case 0:
                  return Red0;
                  break;
                case 1:
                  return Red1;

                  break;
                case 2:
                  return Red2;

                  break;
                case 3:
                  return Red3;

                  break;
                case 4:
                  return Red4;

                  break;
                case 5:
                  return Red5;

                  break;
                case 6:
                  return Red6;

                  break;
                case 7:
                  return Red7;

                  break;
                case 8:
                  return Red8;

                  break;
                case 9:
                  return Red9;

                  break;

                default:
                  return Deck;
                  break;
              }
              break;
            case 2:
              return RedDraw;
              break;
            case 3:
              return RedSkip;
              break;
            case 4:
              return RedReverse;
              break;

            default:
              return Deck;
              break;
          }
          break;
        case 4:
          switch (card?.subType) {
            case 1:
              switch (card?.primaryTitle) {
                case 0:
                  return Yellow0;
                  break;
                case 1:
                  return Yellow1;

                  break;
                case 2:
                  return Yellow2;

                  break;
                case 3:
                  return Yellow3;

                  break;
                case 4:
                  return Yellow4;

                  break;
                case 5:
                  return Yellow5;

                  break;
                case 6:
                  return Yellow6;

                  break;
                case 7:
                  return Yellow7;

                  break;
                case 8:
                  return Yellow8;

                  break;
                case 9:
                  return Yellow9;

                  break;

                default:
                  return Deck;
                  break;
              }
              break;
            case 2:
              return YellowDraw;
              break;
            case 3:
              return YellowSkip;
              break;
            case 4:
              return YellowReverse;
              break;

            default:
              return Deck;
              break;
          }
          break;
        default:
          return Deck;
          break;
      }
    } else if (card.subType === 5) {
      return Draw4;
    } else if (card.subType === 6) {
      return Wild;
    }
  };

  return (
    <img
      className={!noRaise ? "card-image" : ""}
      style={{ height: "150px", width: "110px" }}
      src={showImage(card)}
    />
  );
}
