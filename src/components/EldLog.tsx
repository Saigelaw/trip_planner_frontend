import React from 'react';
import type { TripLogSheet } from '../types';

interface EldLogProps {
    logSheets: TripLogSheet[];
}

const EldLog: React.FC<EldLogProps> = ({ logSheets }) => {
    if (!logSheets || logSheets.length === 0) {
        return null;
    }

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dutyStatuses = ['Off Duty', 'Sleeper Berth', 'Driving', 'On Duty'];

    // ...existing code...

    // For each event, draw a horizontal line in the corresponding status row, centered in the row
    const renderEventLines = (events: TripLogSheet['events'], statusKey: string, rowHeight: number = 50) => {
        // Offset each event line vertically within the row to avoid overlap
        const eventList = events.filter((event: TripLogSheet['events'][number]) => event.type === statusKey);
        const count = eventList.length;
        // If only one event, center it; if multiple, space them evenly
        return eventList.map((event: TripLogSheet['events'][number], idx: number) => {
            const start = new Date(event.start_time);
            const startHour = start.getHours() + start.getMinutes() / 60;
            const endHour = startHour + event.duration;
            // Round to 1 decimal place
            const roundedStart = Math.round(startHour * 10) / 10;
            const roundedEnd = Math.round(endHour * 10) / 10;
            const x1 = (roundedStart / 24) * 100;
            const x2 = (roundedEnd / 24) * 100;
            // Calculate vertical offset for each event
            let y = rowHeight / 2;
            if (count > 1) {
                const spacing = rowHeight / (count + 1);
                y = spacing * (idx + 1);
            }
            return (
                <line
                    key={idx}
                    x1={x1}
                    y1={y}
                    x2={x2}
                    y2={y}
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            );
        });
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Daily ELD Log Sheet</h2>

            {logSheets.map((log, dayIndex) => (
                <div key={dayIndex} className="bg-white p-6 mb-8 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Date: {log.date}</h3>
                        <span className="text-sm text-gray-500">Log Sheet #{dayIndex + 1}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="flex flex-col border border-gray-400">
                            {/* Header for time */}
                            <div className="flex text-[10px] bg-gray-200 font-bold border-b border-gray-400">
                                <div className="w-[100px] text-center py-2 border-r border-gray-400">Status</div>
                                <div className="flex-1 flex justify-between px-2 py-2">
                                    <span className="font-bold">Midnight</span>
                                    {hours.slice(1, 12).map(hour => (
                                        <span key={hour} className="font-bold">{hour}</span>
                                    ))}
                                    <span className="font-bold">Noon</span>
                                    {hours.slice(13, 24).map(hour => (
                                        <span key={hour} className="font-bold">{hour - 12}</span>
                                    ))}
                                    <span className="font-bold">Midnight</span>
                                </div>
                            </div>

                            {/* Rows for each duty status */}
                            {dutyStatuses.map((status, statusIndex) => {
                                // Map status to backend key
                                let statusKey = '';
                                if (status === 'Off Duty') statusKey = 'off_duty';
                                else if (status === 'Sleeper Berth') statusKey = 'sleeper_berth';
                                else if (status === 'Driving') statusKey = 'driving';
                                else if (status === 'On Duty') statusKey = 'on_duty';
                                return (
                                    <div key={status} className="flex border-b border-gray-400 last:border-b-0">
                                        <div className="w-[100px] border-r border-gray-400 bg-gray-200 font-bold text-center py-2 flex items-center justify-center whitespace-nowrap">
                                            {statusIndex + 1}. {status}
                                        </div>
                                        <div className="flex-1 relative h-[50px]">
                                            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                                                {/* Centered horizontal line for this status row */}
                                                <line x1="0" y1="25" x2="100" y2="25" stroke="#ccc" strokeWidth="0.5" />
                                                {/* Vertical Hour Lines */}
                                                {Array.from({ length: 24 }).map((_, hour) => (
                                                    <line
                                                        key={`hour-line-${hour}`}
                                                        x1={((hour + 1) / 24) * 100}
                                                        y1="0"
                                                        x2={((hour + 1) / 24) * 100}
                                                        y2="50"
                                                        stroke="#ddd"
                                                        strokeWidth="0.5"
                                                    />
                                                ))}
                                                {/* Vertical 15-minute marks */}
                                                {Array.from({ length: 96 }).map((_, i) => (
                                                    <line
                                                        key={`quarter-hour-line-${i}`}
                                                        x1={(i / 96) * 100}
                                                        y1={i % 4 === 0 ? "0" : "20"}
                                                        x2={(i / 96) * 100}
                                                        y2={i % 4 === 0 ? "50" : "30"}
                                                        stroke="#eee"
                                                        strokeWidth="0.2"
                                                    />
                                                ))}
                                                {/* Event lines for this status, centered in row */}
                                                {renderEventLines(log.events, statusKey, 50)}
                                            </svg>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EldLog;