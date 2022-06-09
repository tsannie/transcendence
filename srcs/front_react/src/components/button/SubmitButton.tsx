import { required } from "../message/Message";

function SubmitButton() {
  return (
  <input type="submit" value="Submit" onClick={required}>

  </input>
  );
}

export default SubmitButton;
