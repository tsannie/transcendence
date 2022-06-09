import { api } from "../../userlist/UserListItem";

function SubmitButton() {

  function required() {
    const inputValue = (document.getElementById("inputmessage") as HTMLInputElement).value
    if (inputValue.length === 0 || isBadUser(inputValue) === true) // || Ou qu'elle correspond pas a un user dans la DB
    {
       alert("Nom incorrect");
       return false;
    }
    console.log(`${inputValue} est un bon user !`);
    return true;
  }

  function isBadUser(inputValue: string) {
    api.get('/user').then(res => {
      console.log(`res.data.name = ${res.data.name}`);
      console.log(`inputValue = ${inputValue}`);
      if (inputValue === res.data.name)
        return false
      //console.log(res.data);
    })
    return true
  }

  return (
  <input type="submit" value="Submit" onClick={required}>

  </input>
  );
}

export default SubmitButton;
