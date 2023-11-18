import React, { useState, useRef, useEffect, useCallback } from "react";
import Placeholder from "./Placeholder";
import Caret from "./Caret";
import "./GenericInput.css";
import getTextWidth from "../Utils/getTextWidth";

const hiddenTextKey = "*";

const GenericInput = ({
  id,
  placeholder,
  inputRef,
  value,
  setFocus,
  currentFocus,
  setKeyboardInput,
  hideText = false,
}) => {
  const [content, setContent] = useState("");
  const [maskedText, setMaskedText] = useState("");
  const [newText, setNewText] = useState("");

  const [isSelected, setIsSelected] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isTextHidden, setIsTextHidden] = useState(hideText);

  const [caretPosition, setCaretPosition] = useState(0);
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  
  const timeoutRef = useRef(null);

  const maskText = useCallback((text) => {
    // Clear the previous timeout
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (text.length < maskedText.length) {
          // update the masked text immediately if deleting a char
        setMaskedText(hiddenTextKey.repeat(text.length));

      } else if ( text.length > maskedText.length) {
        // mask all text apart from latest character
        setMaskedText(hiddenTextKey.repeat(text.length - 1)+ text.charAt(text.length-1));
      }

      // mask all text after 500ms
    timeoutRef.current = setTimeout(() => {
      setMaskedText(hiddenTextKey.repeat(text.length));
    }, 500);

}, [maskedText.length])

  const updateContent = useCallback((text) => {
    setNewText(text);
    if (text.length > 0) {
        //hide on input
        setHidePlaceholder(true);
        setIsValid(true);
      } else {
        setHidePlaceholder(false);
        setIsValid(false);
      }
      
      if (!isTextHidden) {
          setContent(text);
          return
      }

          maskText(text);
  }, [isTextHidden, maskText])

  useEffect(() => {
    setIsTextHidden(hideText);
  }, [hideText]);

  useEffect(() => {
    if(currentFocus !== id){
        setIsSelected(false)
    }
  }, [currentFocus, id]);

  useEffect(() => {
    if(typeof value !== "string"){
        return;
    }

    updateContent(value)
  }, [value, updateContent]);

  useEffect(() => {
    if (!isTextHidden) {
        setCaretPosition(getTextWidth(content, "16px Arial"));
        return;
    }

    setCaretPosition(getTextWidth(maskedText, "16px Arial"));

    if (newText.length === content.length) {
      return;
    }

    // update content with original text before being masked
    if (newText.length < content.length) {
      setContent(content.slice(0, newText.length));
    } else {
      setContent(content + newText.charAt(newText.length - 1));
    }
  }, [maskedText, newText, content, isTextHidden]);

  useEffect(() => {
    // Set HTML caret position to end of line after each input
    const range = document.createRange();
    const selection = window.getSelection();
    if(inputRef.current){
    range.selectNodeContents(inputRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    }
  }, [newText, inputRef]);

  const handleInput = () => {
    if(inputRef.current){
       const newText = inputRef.current.textContent;
        updateContent(newText);
    }
  };

  const handleFocus = () => {
    if(isSelected){
    return;
    }
    setIsSelected(true);
    setFocus(id);
    setKeyboardInput(content);
  };

  return (
    <div className={"generic-input-container"}>
      <div
        contentEditable="true"
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onFocus={handleFocus}
        ref={inputRef}
        className={`generic-input-content ${isValid ? "" : "invalid-input"}`}
      >
        {isTextHidden ? maskedText : content}
      </div>
      {isSelected && <Caret position={caretPosition + 10} />}
      <Placeholder
        placeholder={placeholder}
        hidePlaceholder={hidePlaceholder}
      />
    </div>
  );
};

export default GenericInput;
