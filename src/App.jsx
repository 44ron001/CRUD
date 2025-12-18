import { useEffect, useState } from "react"
import "./App.css"

function App() {
	const url = "https://retoolapi.dev/WCTMk4/data"

	const [lista, setLista] = useState([])
	const [megnevezes, setMegnevezes] = useState("")
	const [szekhely, setSzekhely] = useState("")
	const [toke, setToke] = useState("")
	const [aktiv, setAktiv] = useState(false)
	const [szerkesztId, setSzerkesztId] = useState(null)

	useEffect(() => {
		betolt()
	}, [])

	function betolt() {
		fetch(url)
		.then((valasz) => valasz.json())
		.then((adat) => {
		setLista(adat)
		})
	}

	function mentes(e) {
		e.preventDefault()

		const adat = {
			Megnevezes: megnevezes,
			Szekhely: szekhely,
			Toke: Number(toke),
			Aktiv: aktiv,
		}

		if (szerkesztId === null) {
			fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(adat),
			}).then(() => betolt())
		} else {
			fetch(url + "/" + szerkesztId, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(adat),
			}).then(() => {
			setSzerkesztId(null)
			betolt()
			})
		}

		mezokUritese()
	}
	function torles(id) {
		fetch(url + "/" + id, { method: "DELETE" }).then(() => betolt())
	}


	function szerkesztes(elem) {
		setMegnevezes(elem.Megnevezes)
		setSzekhely(elem.Szekhely)
		setToke(elem.Toke)
		setAktiv(elem.Aktiv)
		setSzerkesztId(elem.id)
	}

	function mezokUritese() {
		setMegnevezes("")
		setSzekhely("")
		setToke("")
		setAktiv(false)
	}

	return (
	<div style={{ padding: "20px" }}>
	<h2>Cégek</h2>

	<form onSubmit={mentes}>
	<input
	placeholder="Megnevezés"
	value={megnevezes}
	onChange={(e) => setMegnevezes(e.target.value)}
	/>

	<input
	placeholder="Székhely"
	value={szekhely}
	onChange={(e) => setSzekhely(e.target.value)}
	/>

	<input
	type="number"
	placeholder="Tőke"
	value={toke}
	onChange={(e) => setToke(e.target.value)}
	/>

	<label>
	<input
	type="checkbox"
	checked={aktiv}
	onChange={(e) => setAktiv(e.target.checked)}
	/>
	Aktív
	</label>

	<br />

	<button type="submit">
	{szerkesztId === null ? "Hozzáadás" : "Mentés"}
	</button>
	</form>

	<hr />

	<table border="1" cellPadding="5">
	<thead>
	<tr>
	<th>Megnevezés</th>
	<th>Székhely</th>
	<th>Tőke</th>
	<th>Aktív</th>
	<th>Művelet</th>
	</tr>
	</thead>
	<tbody>
	{lista.map((elem) => (
	<tr key={elem.id}>
	<td>{elem.Megnevezes}</td>
	<td>{elem.Szekhely}</td>
	<td>{elem.Toke}</td>
	<td>{elem.Aktiv ? "igen" : "nem"}</td>
	<td>
	<button onClick={() => szerkesztes(elem)}>
	  Szerkeszt
	</button>
	<button onClick={() => torles(elem.id)}>
	  Töröl
	</button>
	</td>
	</tr>
	))}
	</tbody>
	</table>
	</div>
	)
}

export default App
