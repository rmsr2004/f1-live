import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGrandPrixResults, GrandPrixResults, SessionResults } from '../services/api';

function GrandPrix() {
    const { round } = useParams<{ round: string }>();
    const [data, setData] = useState<GrandPrixResults | null>(null);

    useEffect(() => {
        if (!round) {
            return;
        }

        async function fetchResults() {
            try {
                const results = await getGrandPrixResults(Number(round));
                setData(results);
                console.log('Resultados:', results);
            } catch (err) {
                console.error(err);
            }
        }

        fetchResults();
    }, [round]);

    if (!data) {
        return <div>No data available</div>;
    }

    function renderResults(title: string, results: SessionResults[]) {
        if (!results || results.length === 0) {
            return null;
        }

        return (
            <section>
                <h3>{title}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Piloto</th>
                            <th>Equipe</th>
                            <th>Grid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, i) => (
                            <tr key={i}>
                                <td>{r.position}</td>
                                <td>{r.driver.name}</td>
                                <td>{r.constructor.name}</td>
                                <td>{r.grid}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        );
    }

    return (
        <div>
            <h1>{data.grandPrixData.raceName} - Round {data.grandPrixData.round}</h1>
            <p>
                Data: {data.grandPrixData.date} - Horário: {data.grandPrixData.time}
            </p>

            {renderResults('Resultados da Corrida', data.raceResults)}
            {renderResults('Resultados da Qualificação', data.qualifyingResults)}
        </div>
    );
}

export default GrandPrix;