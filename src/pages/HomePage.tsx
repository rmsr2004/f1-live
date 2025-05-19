import { useEffect, useState } from "react";
import { getNextGrandPrix, getAllGrandPrixes } from "../services/api";
import { GrandPrixData } from "../services/api";
import { Link } from "react-router-dom";

function HomePage() {
    const [nextGP, setNextGP] = useState<GrandPrixData | null>(null);
    const [allGPs, setAllGPs] = useState<GrandPrixData[]>([]);
    
    useEffect(() => {
        async function fetchData() {
            const next = await getNextGrandPrix();
            const all = await getAllGrandPrixes();
            setNextGP(next);
            setAllGPs(all);
        }

        fetchData();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>🏁 Formula 1 - Temporada Atual</h1>

            {nextGP && (
                <div style={{ marginBottom: "30px", padding: "20px", border: "2px solid #0077cc", borderRadius: "10px" }}>
                    <h2>Próximo Grande Prémio: {nextGP.raceName}</h2>
                    <p>
                        📅 {new Date(nextGP.date).toLocaleDateString()} 🕒 {nextGP.time?.slice(0, 5)} UTC
                    </p>
                    <h3>Sessões:</h3>
                    <ul>
                        {nextGP.sessions.map((session, idx) => (
                            <li key={idx}>
                                {session.sessionName} – {new Date(session.date).toLocaleDateString()}{" "}
                                {session.time?.slice(0, 5)} UTC
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <h2>📆 Todas as Corridas da Temporada</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {allGPs.map((gp, index) => (
                    <li
                        key={index}
                        style={{
                            marginBottom: "10px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                        }}
                    >
                        <Link to={`/grandprix/${index+1}`} style={{ textDecoration: "none", color: "black" }}>
                            <strong>{gp.raceName}</strong> – {new Date(gp.date).toLocaleDateString()} {gp.time?.slice(0, 5)} UTC
                        </Link>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: "40px" }}>
                <Link to="/standings/drivers">
                    <button
                        style={{
                            marginRight: "10px",
                            padding: "10px 20px",
                            backgroundColor: "#0077cc",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    >
                        🧑‍✈️ Classificação de Pilotos
                    </button>
                </Link>
                <Link to="/standings/constructors">
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#0077cc",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    >
                        🏭 Classificação de Construtores
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;