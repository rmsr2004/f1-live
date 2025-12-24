import { Standings } from "../../services/api";
import getTeamColorClass from "../../utils/utils";

interface StandingsTableProps {
    type: 'drivers' | 'constructors';
    standings: Standings | null;
}

function StandingsTable({ type, standings }: StandingsTableProps) {
    return (
        <>
            <div className="f1-card overflow-x-auto">
                <div id="results" className="results-table">
                    <table className="w-full">
                        <thead className="bg-[#15151E]">
                            <tr>
                                <th className="px-3 py-4 text-left">Pos</th>
                                {type === 'drivers' && (
                                    <th className="pth3 py-4 text-left">Driver</th>
                                )}
                                <th className="px-3 py-4 text-left">Team</th>
                                <th className="px-3 py-4 text-left">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings?.standings.map((result, index) => (
                                <tr key={index} className="result-row">
                                    <td className="px-3 py-4 font-bold">{index + 1}</td>

                                    {type === 'drivers' && (
                                        <td className="px-3 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-1 h-6 mr-3 ${getTeamColorClass(result.constructor ?? '')}`}></div>
                                                <span>{result.name}</span>
                                            </div>
                                        </td>
                                    )}

                                    <td className="px-3 py-4">
                                        <div className="flex items-center">
                                            {type === 'constructors' && (
                                                <div className={`w-1 h-6 mr-3 ${getTeamColorClass(result.name)}`}></div>
                                            )}
                                            {type === 'drivers' ? (
                                                <span>{result.constructor}</span>
                                            ) : (
                                                <span>{result.name}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">{result.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default StandingsTable;