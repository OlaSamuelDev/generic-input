const Caret = ({ position }) => {
    return (
      <div
        className={"caret"}
        style={{
          left: `${position || 10}px`,
        }}
      ></div>
    );
  };
  
  export default Caret;