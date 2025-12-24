interface SessionCardProps {
    index: number;
    sessionName: string;
    sessionDatetime: string;
}

function SessionCard({ index, sessionName, sessionDatetime }: SessionCardProps) {
    return (
        <>
            <div key={index} className={`bg-[#15151E] p-4 rounded-lg ${sessionName === 'RACE' ? 'md:col-span-2' : ''}`}>
                <span className="text-sm text-gray-400">{sessionName}</span>
                <p className="font-bold">{sessionDatetime}</p>
            </div>
        </>
    );
}

export default SessionCard;