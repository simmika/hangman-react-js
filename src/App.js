import React from "react";
import { Button, Form, Stack } from "react-bootstrap";
import "./styles.css";

// https://random-word-api.vercel.app/api?words=1

// const getWord = () => "monkey";

async function getWord() {
  let response = await window.fetch(
    `https://random-word-api.vercel.app/api?words=1`
  );
  let responseJson = await response.json();
  console.log(responseJson[0]);

  return responseJson[0];
}

const Message = ({ guessSuccess }) => {
  const messageObj = { type: "", message: "" };
  if (guessSuccess === null) {
    messageObj.type = "primary";
    messageObj.message = "Please enter your guess and submit";
  } else if (guessSuccess) {
    messageObj.type = "success";
    messageObj.message = "Your guess is correct";
  } else if (!guessSuccess) {
    messageObj.type = "danger";
    messageObj.message = "Your guess is incorrect.";
  }
  return (
    <div className={`alert alert-${messageObj.type}`} role="alert">
      {messageObj.message}
    </div>
  );
};

const Img = ({ guessesCount }) => (
  <img
    className="col-md-8 mx-auto"
    alt=""
    src={`./img/hangman${guessesCount + 1}.png`}
    width="200"
    height="300"
  />
);

const DisplayPlayingApp = ({
  handleLetterSubmit,
  handleLetterChange,
  guessLetter,
  guessSuccess,
  guessWord,
  guessesCount
}) => {
  return (
    <div className="App">
      <Form onSubmit={handleLetterSubmit}>
        <Stack direction="horizontal" gap={3} className="col-md-8 mx-auto">
          <Form.Control
            onChange={handleLetterChange}
            type="letter"
            placeholder="Your guess"
            size="lg"
            maxLength="1"
            value={guessLetter}
          />
          <Button
            disabled={!guessLetter}
            variant="primary"
            type="submit"
            size="lg"
          >
            Submit
          </Button>
        </Stack>
      </Form>
      <Stack className="col-md-8 mx-auto" style={{ marginTop: "1rem" }}>
        <Stack>
          <Message guessSuccess={guessSuccess} />
        </Stack>
      </Stack>
      <Stack>
        <h2>{guessWord.split("").map((x) => x + " ")}</h2>
      </Stack>
      <Stack>
        <Img guessesCount={guessesCount} />
      </Stack>
      <Stack className="col-lg-8 mx-auto">
        <Button variant="danger" onClick={() => window.location.reload(false)}>
          RESET
        </Button>
      </Stack>
    </div>
  );
};

const DisplayWinApp = () => {
  return (
    <div className="Loose">
      <Stack>
        <h1 className="alert alert-danger" role="alert">
          GAME OVER! {}
          <span role="img" aria-label="tada">
            😔
          </span>
        </h1>
      </Stack>
      <Stack>
        <Button onClick={() => window.location.reload(false)}>
          TRY AGAIN!
        </Button>
      </Stack>
    </div>
  );
};

const DisplayLoseApp = () => {
  return (
    <div className="Win">
      <Stack>
        <h1 class="alert alert-success" role="alert">
          You WIN! {}
          <span role="img" aria-label="tada">
            🎉
          </span>
        </h1>
      </Stack>
      <Stack>
        <Button onClick={() => window.location.reload(false)}>
          PLAY AGAIN!
        </Button>
      </Stack>
    </div>
  );
};

export default function App() {
  const [word, setWord] = React.useState();
  const [guessLetter, setGuessLetter] = React.useState("");
  const [guessWord, setGuessWord] = React.useState();
  const [guessesCount, setGuessesCount] = React.useState(0);
  const [guessSuccess, setGuessSuccess] = React.useState(null);

  const initializeWord = async () => {
    const result = await getWord();
    setWord(result);
    setGuessWord("_".repeat(result.length));
  };

  React.useEffect(() => {
    initializeWord();
  }, []);

  const handleLetterChange = (event) => {
    setGuessLetter(
      event.target.value.toLowerCase().replaceAll(/[^a-zA-Z]+/g, "")
    );
  };

  const handleLetterSubmit = (e) => {
    e.preventDefault();
    if (word.includes(guessLetter)) {
      const gameWord = word
        .split("")
        .map((letter) => (letter !== guessLetter ? "_" : letter));
      setGuessWord(
        gameWord
          .map((x, i) => (guessWord[i] === "_" ? x : guessWord[i]))
          .join("")
      );
      setGuessSuccess(true);
    } else {
      setGuessSuccess(false);
      setGuessesCount((c) => c + 1);
    }
    setGuessLetter("");
  };

  if (guessWord && guessWord.includes("_") && guessesCount < 6) {
    return (
      <DisplayPlayingApp
        handleLetterSubmit={handleLetterSubmit}
        handleLetterChange={handleLetterChange}
        guessLetter={guessLetter}
        guessSuccess={guessSuccess}
        guessWord={guessWord}
        guessesCount={guessesCount}
      />
    );
  } else if (guessWord && !guessWord.includes("_")) {
    return <DisplayLoseApp />;
  }
  return <DisplayWinApp />;
}
// + Kad zodzius trauktu is zodyno
// + messages (aditional)
// + count'as
// + submito disablinimas (jei tuscias)
// + o visokito neleidziam ivest: lowerCase, daugiau raidziu ,skaicius  ir pan.
// + rast paveikslelius 6
// + reset button'a implementuoti - pvz refresh'a browserio
// + kai pralaimim tai kazkas turi ivykti
// + ir kai laimi kazkas ivyksta
