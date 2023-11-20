import { useEffect, useRef } from "react";

const Placeholder = ({ placeholder, hidePlaceholder }) => {
  const placeholderRef = useRef(null);

  useEffect(() => {
    if (placeholderRef.current) {
      placeholderRef.current.style.display = hidePlaceholder ? "none" : "block";
    }
  }, [hidePlaceholder]);

  return (
    <div ref={placeholderRef} className={"placeholder"}>
      {placeholder}
    </div>
  );
};

export default Placeholder;
