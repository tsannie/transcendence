import React from "react";
import { Outlet } from "react-router-dom";

function Shit() {
  return (
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
      inventore labore impedit sint, assumenda aperiam ipsa, odio ea, in
      necessitatibus eos est asperiores itaque velit quia. Incidunt quam aliquid
      nesciunt!
      <Outlet />
    </div>
  );
}

export default Shit;
