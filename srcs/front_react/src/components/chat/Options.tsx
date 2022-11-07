import { useContext } from "react";
import { ChatStateContext } from "../../contexts/ChatContext";

function Options() {
  const {currentConvId} = useContext(ChatStateContext)

    return (
      <div className="conversation__options">
        <div className="conversation__options__title">
        </ div>
      </div>
    );
  }

  export default Options;