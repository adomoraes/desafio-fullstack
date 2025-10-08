import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";

export function App() {

  return (
    <BrowserRouter>
      <div className="bg-red-500">
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
      </div>
      <Router />
    </BrowserRouter>
  )
}

