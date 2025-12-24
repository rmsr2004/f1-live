import { useNavigate } from "react-router-dom";

import { GrandPrixData } from "../../../services/api";
import Countdown from "./countdown/Countdown";

import SessionCard from "./SessionCard";
import GrandPrixInfo from "./GrandPrixInfo";

interface NextGrandPrixProps {
    nextGP: GrandPrixData;
}

function NextGrandPrix({ nextGP }: NextGrandPrixProps) {
    const navigate = useNavigate();

    return (
        <>
            <section className="mb-12" onClick={() => navigate(`/grandprix/${nextGP.round}`)}>
                <h2 className="text-2xl font-bold mb-6">NEXT GRAND PRIX</h2>
                <div className="f1-card p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                        <GrandPrixInfo nextGP={nextGP} />
                        <Countdown targetDate={nextGP.raceDateISO ?? ""} />
                    </div>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {nextGP.sessions.map((session, index) => (
                            <SessionCard index={index} sessionName={session.sessionName} sessionDatetime={session.datetime} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default NextGrandPrix;