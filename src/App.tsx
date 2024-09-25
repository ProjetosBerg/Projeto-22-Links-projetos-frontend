import { Outlet } from "react-router-dom"
import classes from "./App.module.css";
import Error from "./components/Error";
function App() {

  return (
    <>
      <Error />
      <div className={classes.app}>
        <h1>Repositório Bergkley</h1>
        <Outlet />
      </div>
    </>
  )
}

export default App
