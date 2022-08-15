const util = require("util");
const UNIQUE_COLORS = 4;
const NUMBER_OF_UNIQUE_CARD_FOR_EACH_COLORED_CARD = 2;
const NUMBER_OF_UNIQUE_CARD_FOR_EACH_NON_COLORED_CARD = 4;

const coloredCards = [
  {
    number: 0,
    text: "zero",
  },
  {
    number: 1,
    text: "one",
  },
  {
    number: 2,
    text: "two",
  },
  {
    number: 3,
    text: "three",
  },
  {
    number: 4,
    text: "four",
  },
  {
    number: 5,
    text: "five",
  },
  {
    number: 6,
    text: "six",
  },
  {
    number: 7,
    text: "seven",
  },
  {
    number: 8,
    text: "eight",
  },
  {
    number: 9,
    text: "nine",
  },
  {
    number: "+2",
    text: "draw 2",
  },
  {
    number: "reverse",
    text: "reverse",
  },
  {
    number: "skip",
    text: "skip",
  },
];

const nonColoredCards = [
  {
    number: "+4",
    text: "draw 4",
  },
  {
    number: "wild",
    text: "wild",
  },
];

function getSubtype(item) {
  if (typeof item?.number === Number) {
    return 1;
  }
  if (item?.text === "draw 2") {
    return 2;
  }
  if (item?.text === "skip") {
    return 3;
  }
  if (item?.text === "reverse") {
    return 4;
  }
  if (item?.text === "draw 4") {
    return 5;
  }
  if (item?.text === "wild") {
    return 6;
  }
}

function main() {
  let cards = [];

  for (let uniqueColors = 1; uniqueColors < UNIQUE_COLORS + 1; uniqueColors++) {
    coloredCards.forEach((coloredElement) => {
      for (
        let uniqueCardIndex = 0;
        uniqueCardIndex < NUMBER_OF_UNIQUE_CARD_FOR_EACH_COLORED_CARD;
        uniqueCardIndex++
      ) {
        if (coloredElement?.number === 0 && uniqueCardIndex === 1) {
          return;
        }
        cards.push({
          type: 1,
          subType: getSubtype(coloredElement),
          primaryTitle: coloredElement?.number,
          secondaryTitle: coloredElement?.text,
          color: uniqueColors,
        });
      }
    });
  }

  nonColoredCards.forEach((nonColoredElement) => {
    for (
      let uniqueCardIndex = 0;
      uniqueCardIndex < NUMBER_OF_UNIQUE_CARD_FOR_EACH_NON_COLORED_CARD;
      uniqueCardIndex++
    ) {
      cards.push({
        type: 1,
        subType: getSubtype(nonColoredElement),
        primaryTitle: nonColoredElement?.number,
        secondaryTitle: nonColoredElement?.text,
        color: null,
      });
    }
  });

  console.log(util.inspect(cards, { maxArrayLength: 200 }));
  console.log("cards?.length", cards?.length);
}

main();
