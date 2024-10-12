
import { renderToString } from "react-dom/server";
import React from "react";
import { serve } from "bun";

import RoboticsOdyssey from "../views/odyssey/robotics-odyssey.tsx";

function App() {
  return (    
  <RoboticsOdyssey />
  ;
}

ReactDOM.render(<App />, document.getElementById('app'));

