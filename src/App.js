import React, { useEffect, useRef, useState } from "react";
import GenericInput from "./Components/GenericInput";
import ToggleButton from "./Components/ToggleButton";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./App.css";

const App = () => {
  const [hideText, setHideText] = useState(true);
  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
  const [currentFocus, setCurrentFocus] = useState();
  const [keyboardInput, setKeyboardInput] = useState();
  const keyboardRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const onChange = (newText) => {
    if (currentFocus === "email") {
      setEmailInput(newText);
    } else if (currentFocus === "password") {
      setPasswordInput(newText);
    }
  };

  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setInput(keyboardInput);
    }
  }, [currentFocus, keyboardInput]);

  const onButtonClick = () => {
    setHideText(!hideText);
  };

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  return (
    <div className="login-container">
      <h1>Login</h1>
      <GenericInput
        id={"email"}
        inputRef={emailRef}
        placeholder={"Please enter email here"}
        value={emailInput}
        setFocus={setCurrentFocus}
        currentFocus={currentFocus}
        setKeyboardInput={setKeyboardInput}
      />
      <br />
      <div className="password-container">
        <GenericInput
          id={"password"}
          inputRef={passwordRef}
          placeholder={"Please enter password here"}
          hideText={hideText}
          value={passwordInput}
          setFocus={setCurrentFocus}
          currentFocus={currentFocus}
          setKeyboardInput={setKeyboardInput}
        />
        <ToggleButton
          onClick={onButtonClick}
          isTextVisible={!hideText}
          showText={"Show"}
          hideText={"Hide"}
        />
      </div>
      <br />

      <Keyboard
        keyboardRef={(ref) => (keyboardRef.current = ref)}
        layoutName={"default"}
        onChange={onChange}
      />
    </div>
  );
};

export default App;
