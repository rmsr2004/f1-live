import { useState } from "react";

import { GrandPrixResults } from "../services/api";
import getTeamColorClass from "../utils/utils";

interface ResultsSectionProps {
    qualifyingResults: GrandPrixResults["qualifyingResults"];
    raceResults: GrandPrixResults["raceResults"];
    sprintResults?: GrandPrixResults["sprintResults"];
}

function ResultsSection({ qualifyingResults, raceResults, sprintResults }: ResultsSectionProps) {
    const [activeSession, setActiveSession] = useState("race");

    const renderSprint = () => (
        <div className="f1-card overflow-x-auto">
            <div id="quali-results" className="results-table">
                <table className="w-full">
                    <thead className="bg-[#15151E]">
                        <tr>
                            <th className="px-3 py-4 text-left">Pos</th>
                            <th className="px-3 py-4 text-left">Driver</th>
                            <th className="px-3 py-4 text-left">Team</th>
                            <th className="px-3 py-4 text-left">Grid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sprintResults?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-gray-400">
                                    The sprint results are not available yet
                                </td>
                            </tr>
                        ) : (
                            sprintResults?.map((result, index) => (
                                <tr key={index} className="result-row">
                                    <td className="px-3 py-4 font-bold">{result.position}</td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-1 h-6 mr-3 ${getTeamColorClass(result.constructor.name)}`}></div>
                                            <span>{result.driver.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">{result.constructor.name}</td>
                                    <td className="px-3 py-4">{result.grid || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderQualifying = () => (
        <div className="f1-card overflow-x-auto">
            <div id="sprint-results" className="results-table">
                <table className="w-full">
                    <thead className="bg-[#15151E]">
                        <tr>
                            <th className="px-3 py-4 text-left">Pos</th>
                            <th className="px-3 py-4 text-left">Driver</th>
                            <th className="px-3 py-4 text-left">Team</th>
                            <th className="px-3 py-4 text-left">Q1</th>
                            <th className="px-3 py-4 text-left">Q2</th>
                            <th className="px-3 py-4 text-left">Q3</th>
                        </tr>
                    </thead>
                    <tbody>
                        {qualifyingResults.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-gray-400">
                                    The qualifying results are not available yet
                                </td>
                            </tr>
                        ) : (
                            qualifyingResults.map((result, index) => (
                                <tr key={index} className="result-row">
                                    <td className="px-3 py-4 font-bold">{result.position}</td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-1 h-6 mr-3 ${getTeamColorClass(result.constructor.name)}`}></div>
                                            <span>{result.driver.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">{result.constructor.name}</td>
                                    <td className="px-3 py-4">{result.times?.timeQ1 || '-'}</td>
                                    <td className="px-3 py-4">{result.times?.timeQ2 || '-'}</td>
                                    <td className="px-3 py-4">{result.times?.timeQ3 || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderRace = () => (
        <div className="f1-card overflow-x-auto">
            <div id="race-results" className="results-table">
                <table className="w-full">
                    <thead className="bg-[#15151E]">
                        <tr>
                            <th className="py-3 px-4 text-left">Pos</th>
                            <th className="py-3 px-4 text-left">Driver</th>
                            <th className="py-3 px-4 text-left">Team</th>
                            <th className="py-3 px-4 text-left">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {raceResults.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-gray-400">
                                    The race results are not available yet
                                </td>
                            </tr>
                        ) : (
                            raceResults.map((result, index) => (
                                <tr key={index} className="result-row">
                                    <td className="py-3 px-4 font-bold">{result.position}</td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-1 h-6 mr-3 ${getTeamColorClass(result.constructor.name)}`}></div>
                                            <span>{result.driver.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">{result.constructor.name}</td>
                                    <td className="px-3 py-4">{result.points}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">RESULTS</h3>
                <div className="flex space-x-2">
                    {sprintResults && (
                        <button
                            className={`session-btn px-4 py-2 rounded-lg text-sm font-bold ${activeSession === "sprint" ? "bg-white text-black" : "bg-[#1F1F2B] text-white"}`}
                            onClick={() => setActiveSession("sprint")}
                        >
                            SPRINT
                        </button>
                    )}
                    <button
                        className={`session-btn px-4 py-2 rounded-lg text-sm font-bold ${activeSession === "qualifying" ? "bg-white text-black" : "bg-[#1F1F2B] text-white"}`}
                        onClick={() => setActiveSession("qualifying")}
                    >
                        QUALIFYING
                    </button>
                    <button
                        className={`session-btn px-4 py-2 rounded-lg text-sm font-bold ${activeSession === "race" ? "bg-white text-black" : "bg-[#1F1F2B] text-white"}`}
                        onClick={() => setActiveSession("race")}
                    >
                        RACE
                    </button>
                </div>
            </div>

            {activeSession === "qualifying" && renderQualifying()}
            {activeSession == "race" && renderRace()}
            {activeSession === "sprint" && renderSprint()}
        </section>
    );
}

export default ResultsSection;