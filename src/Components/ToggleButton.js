const ToggleButton = ({ onClick, isTextVisible, showText, hideText }) => {
  return (
    <button type="button" onClick={onClick}>
      {isTextVisible ? hideText : showText}
    </button>
  );
};

export default ToggleButton;
