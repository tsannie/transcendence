import { Fragment, useContext, useEffect } from "react";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";

function InviteList() {
    const { inviteList, setInvite } = useContext(ChatDisplayContext);
    
    const displayInvitations = inviteList.map( elem => {
            return (
                <li key={elem.id}>
                    <div className="invite_info">
                        {elem.name}
                        <span>invited by: {elem.owner?.username}</span>
                    </div>
                    <div className="invite_buttons">
                    </div>
                </li>);
    })
    
    useEffect(() => {

    }, [inviteList])

    if (!inviteList)
        return null;
    else
        return (
            <div className="invitations">
                {displayInvitations}
            </div>
        );

}

export default InviteList;