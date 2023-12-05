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

  /**
   * Takes text and clears the timeout if one exists
   * 
   * If the new text is less than the current masked text then update the masked text immediately
   * If not then make all apart from the last character
   * 
   * Set a timeout to mask the last character.
   */
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

/**
 * Takes new text and updates the newText state
 * updates the placeholder if the length is greater than zero
 * updates the validation
 * 
 * if its not a password then the content state is updated.
 * 
 * if it is a password then the text is passed through a password masker
 */
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

/**
 * Updates the hideText state which is responsible for displaying the values of maskedText or content variables
 */
  useEffect(() => {
    setIsTextHidden(hideText);
  }, [hideText]);

/**
 * Controls whether the component is in a selected state based on the currentFocus prop
 */
  useEffect(() => {
    if(currentFocus !== id){
        setIsSelected(false)
    }
  }, [currentFocus, id]);

/**
 * Adds support for external input. Text is passed in and updated accordingly within the component
 */
  useEffect(() => {
    if(typeof value !== "string"){
        return;
    }

    updateContent(value)
  }, [value, updateContent]);

  /**
   * If not hidden, get the width of the text displayed and pass the number into setCaretPosition
   * 
   * If hidden, get the width of the masked text displayed and pass the number into setCaretPosition
   */
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

  /**
   * Sets the window caret selection to the updated text end point.
   */
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

/**
 * Takes input currently in the text field and updates content with new text
 */
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
