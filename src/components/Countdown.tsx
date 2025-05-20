import { useEffect, useState } from 'react';

interface CountdownProps {
    targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
    function getTimeLeft() {
        const now = new Date();
        const target = new Date(targetDate);
        const diff = target.getTime() - now.getTime();

        if (diff <= 0) return null;

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return { days, hours, minutes, seconds };
    }

    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!timeLeft) return (
        <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-2">RACE STARTED</span>
            <div className="next-race-countdown text-2xl md:text-4xl font-black p-4 rounded-lg">
                🚦
            </div>
        </div>
    );

    const { days, hours, minutes, seconds } = timeLeft;

    return (
        <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-2">RACE STARTS IN</span>
            <div className="next-race-countdown text-2xl md:text-4xl font-black p-4 rounded-lg">
                {`${days}D : ${String(hours).padStart(2, '0')}H : ${String(minutes).padStart(2, '0')}M : ${String(seconds).padStart(2, '0')}S`}
            </div>
        </div>
    );
};

export default Countdown;
