import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDriverStandings, getConstructorStandings } from '../services/api';


function StandingsPage() {
    const { type } = useParams<{ type: string }>();
    const [standings, setStandings] = useState<any[]>([]);

    useEffect(() => {
        async function fetchStandings() {
            try {
                let data;
                if (type === 'drivers') {
                    data = await getDriverStandings();
                } else if (type === 'constructors') {
                    data = await getConstructorStandings();
                    console.log('Constructor Standings:', data);
                }
                setStandings(data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchStandings();
    }, [type]);

    return (
        <div>
            <h1>{type === 'drivers' ? 'Classificação de Pilotos' : 'Classificação de Construtores'}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>{type === 'drivers' ? 'Piloto' : 'Construtor'}</th>
                        <th>Pontos</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.name}</td>
                            <td>{entry.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default StandingsPage;