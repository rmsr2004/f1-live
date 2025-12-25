import { GrandPrixResults } from "@client/models/GrandPrixResults.ts";
import getTeamColorClass from "@utils/utils.ts";

interface GrandPrixCardProps {
    grandPrixData: GrandPrixResults["grandPrixData"];
    status: GrandPrixResults["status"];
    raceResults: GrandPrixResults["raceResults"];
    qualifyingResults: GrandPrixResults["qualifyingResults"];
}

function GrandPrixCard({ grandPrixData, status, raceResults, qualifyingResults }: GrandPrixCardProps) {
    return (
        <>
            <section className="mb-8">
                <div className="f1-card">
                    <div className="f1-red p-4">
                        <div className="flex justify-between items-center">
                            <span className="font-bold">ROUND {grandPrixData.round}</span>
                            <div className={`${status === 'COMPLETED' ? 'race-status-completed' : status === 'ONGOING' ? 'race-status-ongoing' : 'race-status-upcoming'} text-xs font-bold px-3 py-1 rounded-full`}>
                                {status}
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{grandPrixData.raceName}</h2>
                                <p className="text-gray-400 mb-4">{grandPrixData.circuitName}</p>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{grandPrixData.dateRange}</span>
                                </div>
                            </div>
                            {status === 'COMPLETED' && raceResults.length > 0 && (
                                <div className="mt-4 md:mt-0 flex flex-col items-end">
                                    <div className="flex items-center mb-2">
                                        <span className="text-sm text-gray-400 mr-2">WINNER:</span>
                                        <span className="font-bold">{raceResults[0].driver.name}</span>
                                        <div className={`w-3 h-3 ml-2 rounded-full ${getTeamColorClass(raceResults[0].constructor.name)}`}></div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-400 mr-2">POLE POSITION:</span>
                                        <span className="font-bold">{qualifyingResults[0]?.driver.name ?? 'N/A'}</span>
                                        <div className={`w-3 h-3 ml-2 rounded-full ${getTeamColorClass(qualifyingResults[0].constructor.name)}`}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default GrandPrixCard;