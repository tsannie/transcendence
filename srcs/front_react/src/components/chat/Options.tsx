import { useContext } from "react";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";

function Options() {
  const { currentConv } = useContext(ChatDisplayContext);

  return (
    <div className="conversation__options">
      <div className="conversation__options__title"></div>
    </div>
  );
}

export default Options;
