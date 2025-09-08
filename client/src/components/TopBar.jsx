import { useState } from "react";

function TopBar() {
  const [showHowTo, setShowHowTo] = useState(false);

  const handleClose = () => {
    setShowHowTo(false);
  };

  return (
    <>
      <a href="/about">
        <button
          className="topButton"
          onClick={() => {
            setShowHowTo(true);
          }}
        >
          ?
        </button>
      </a>

      <a href="/archive">
        <button className="topButton">Past</button>
      </a>
      <a href="/stats">
        <button className="topButton">Stats</button>
      </a>
    </>
  );
}

export default TopBar;
