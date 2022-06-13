import { api } from "../../userlist/UserListItem";
import Message from "../message/Message";

export default function MessagesHeader() {

  function newConv() {
    const newinput = document.createElement("input");
    const newsubmit = document.createElement("input");
    const newbutton = document.getElementById("checkuser")

    newinput.type = "text";
    newinput?.setAttribute('required', '');

    newsubmit.type = "submit";
    newbutton?.appendChild(newinput);
    newbutton?.appendChild(newsubmit);
    /* if (inputUser.value.length === 0 || isBadUser(inputUser.value) === true) // || Ou qu'elle correspond pas a un user dans la DB
    {
       alert("Nom incorrect");
       //return ;
    } */
    //console.log(`${el.value} est un bon user !`);
    return (
      <div>
      </div>
    );
  }

  function isBadUser(inputValue: string) {
    api.get('/user').then(res => {
      console.log(`res.data.username = ${res.data.username}`);
      console.log(`inputValue = ${inputValue}`);
      if (inputValue === res.data.name)
        return false
      //console.log(res.data);
    })
    return true
  }

  return (
    <div className="messages-header-container">
      <div className="messages-header">
        <p className="messages-conv">Messages</p>
        <div className="add-conv">
          <svg width="60" height="60">
          <g>
              <rect onClick={newConv}
                id="addconv"
                x="12"
                y="12"
                width="36"
                height="36"
                rx="18"
                fill="#064FBD"
              >
              </rect>
              <path
                d="M39.2308 29.2308H30.7692V20.7692C30.7692 20.3446 30.4246 20 30 20C29.5754 20 29.2308 20.3446 29.2308 20.7692V29.2308H20.7692C20.3446 29.2308 20 29.5754 20 30C20 30.4246 20.3446 30.7692 20.7692 30.7692H29.2308V39.2308C29.2308 39.6554 29.5754 40 30 40C30.4246 40 30.7692 39.6554 30.7692 39.2308V30.7692H39.2308C39.6554 30.7692 40 30.4246 40 30C40 29.5754 39.6554 29.2308 39.2308 29.2308Z"
                fill="#FFF8F8"
              ></path>
          </g>
          </svg>
        </div>
        <div id="checkuser" className="checkuser">
        </div>
      </div>
    </div>
  )
}
