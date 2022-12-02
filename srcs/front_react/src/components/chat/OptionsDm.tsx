import { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { AuthContext, User } from "../../contexts/AuthContext";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { IDm } from "./types";

function DmUserProfile(props: {dm: IDm | null, targetRedirection: string}) {
  const { user } = useContext(AuthContext);
  const { dm, targetRedirection } = props;
  const {isRedirection} = useContext(ChatDisplayContext);
  const [ user2, setUser2 ] = useState<User>({} as User);

  const loadUser2 = () => {
    api
      .get("/user/id", { params: { id: targetRedirection}})
      .then( (res) => {
        setUser2(res.data); })
      .catch(err => toast.error("HTTP error: " + err.response.data.message));
  }

  const findUser2 = () => {
    if (isRedirection)
        loadUser2()
    else
    {
      if (!dm || !dm?.users)
        return ;
      let searched_user = dm?.users?.find( (elem) => elem.id !== user?.id);
      if (searched_user)
        setUser2(searched_user);
      else
        toast.error("Couldn't find a conversation with that user...");
    }
  }

  useEffect( () => {
    findUser2();
  }, [isRedirection, dm])


  return (
  <div className="conversation__options__title">
    <button className="clickable_profile">
      <Link style={{textDecoration: 'none'}} to={"/profile/" + user2?.username}>
        <img src={user2?.profile_picture} />
      </Link>
    </button>
    <div className="text">
      <span>{user2?.username}</span>
      {/* {isRedirection? <div className="date">Draft Message</div> : <div className="date">conv started at: {dm?.createdAt?.toLocaleString()}</div>} */}
    </div>
  </div>);
}

function DmOptions(props: {currentConvId: string, dm: IDm | null, targetRedirection: string}) {
  const {dm, targetRedirection} = props;

  return <Fragment>
      <DmUserProfile dm={dm} targetRedirection={targetRedirection}/>
    </Fragment>
}

export default DmOptions;