import React, { useState } from "react";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoues from "./routes/PrivateRoutes";



const App = () => {
  const [login, setLogin] = useState(false);
  return (

    <div>
      {!login ? <PublicRoute setLogin={setLogin} /> : <PrivateRoues />}

    </div>
  )
}







export default App