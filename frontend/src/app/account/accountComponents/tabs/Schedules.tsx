import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface Schedule {
  id: number;
  name: string;
  date: string;
  time: string;
  description: string;
}

interface SchedulesProps {
  schedules: Schedule[];
}

export const Schedules: React.FC<SchedulesProps> = ({ schedules }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Schedules</h2>
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id}>
          <CardHeader>
            <CardTitle>{schedule.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Date: {schedule.date}</p>
            <p>Time: {schedule.time}</p>
            <p>{schedule.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
