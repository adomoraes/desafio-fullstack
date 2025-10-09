import { BrowserRouter } from "react-router-dom"
import { Router } from "./Router"
import { Header } from "./components/Header"

export function App() {
	return (
		<BrowserRouter>
			<Header />
			<main className="pt-16">
				<Router />
			</main>
		</BrowserRouter>
	)
}
