import { GrandPrixData } from "../../services/api";

interface GrandPrixScheduleProps {
    grandPrixData: GrandPrixData;
}

function GrandPrixSchedule({ grandPrixData }: GrandPrixScheduleProps) {
    return (
        <>
            <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">SCHEDULE</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {grandPrixData.sessions.map((session, index) => (
                        <div
                            key={index}
                            className={`f1-card p-4 ${session.sessionName === 'RACE' ? 'md:col-span-2' : ''}`}
                        >
                            <span className="text-sm text-gray-400">{session.sessionName}</span>
                            <p className="font-bold">{session.datetime}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default GrandPrixSchedule;