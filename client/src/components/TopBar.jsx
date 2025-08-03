import { useState } from "react";

function TopBar() {
  const [showHowTo, setShowHowTo] = useState(false);

  const handleClose = () => {
    setShowHowTo(false);
  };

  return (
    <>
      <button
        className="topButton"
        onClick={() => {
          setShowHowTo(true);
        }}
      >
        ?
      </button>
      <a href="/archive">
        <button className="topButton">Past</button>
      </a>
    </>
  );
}

export default TopBar;
