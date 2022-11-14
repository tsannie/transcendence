import { IDatas } from "./Conversation";
import ChannelOptions from "./OptionsChannel";
import DmOptions from "./OptionsDm";
import { IDm } from "./types";

function Options(props: {currentConvId: string, isChannel: boolean, data: IDatas | IDm | null, targetRedirection: string}) {
  const {currentConvId, isChannel, data, targetRedirection} = props;

  return (
    <div className="conversation__options">
      {isChannel? <ChannelOptions currentConvId={currentConvId} channel={data as IDatas | null} /> : <DmOptions currentConvId={currentConvId} dm={data as IDm | null} targetRedirection={targetRedirection} />}
    </div>
  );
}

export default Options;
