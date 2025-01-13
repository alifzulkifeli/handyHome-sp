'use client'

import React, { useEffect, useState } from 'react';
import AppointmentItem from './AppointmentItem';
import { Button } from './ui/button';
import { pb } from '@/lib/pb';
import { useRouter } from 'next/router';
import { toast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  date: string;  // in YYYY-MM-DD format
  time: string;  // e.g. '09', '10', '15', etc.
}

const AppointmentList: React.FC = () => {
  const [User, setUser] = useState<any>(null);
  const router = useRouter();

  // Example data. Will be replaced by fetched data.
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', date: '2023-05-15', time: '09' },
    { id: '2', date: '2023-05-15', time: '20' },
    { id: '3', date: '2023-05-16', time: '10' },
    { id: '4', date: '2023-05-17', time: '11' },
    { id: '5', date: '2023-05-17', time: '15' },
    // Duplicate (date/time)
    { id: '6', date: '2023-05-15', time: '09' },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let user: { id: string } | null = null;
        const userStorage = localStorage.getItem('sp');

        if (userStorage) {
          user = JSON.parse(userStorage);
          setUser(user);
        } else {
          console.log('No user found in localStorage');
          return;
        }

        console.log(user);

        const records = await pb.collection('Availabilities').getFullList({
          filter: user ? `provider_id.id="${user.id}"` : '',
          sort: '',
        });

        const mappedRecords: Appointment[] = records.map((record: any) => ({
          id: record.id,
          date: record.date,
          time: record.time_block,
        }));

        setAppointments(mappedRecords);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const deleteAppointment = async (id: string) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));

    await pb.collection('Availabilities').delete(id);
    toast({
      title: "🗑️ Deleted",
      description: "Selected time slot has been deleted.",
      variant: "destructive"
    })
  };

  // 1. Group appointments by date, skipping duplicates (same date/time)
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }

    // Check if time already exists for this date
    const alreadyExists = acc[appointment.date].some(
      (appt) => appt.time === appointment.time
    );

    // Only add if it doesn't exist
    if (!alreadyExists) {
      acc[appointment.date].push(appointment);
    }

    return acc;
  }, {} as Record<string, Appointment[]>);

  // 2. Sort date keys (ascending)
  const sortedDates = Object.keys(groupedAppointments).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // 3. For each date, sort by time
  sortedDates.forEach((date) => {
    groupedAppointments[date].sort((a, b) => Number(a.time) - Number(b.time));
  });

  return (
    <div className="max-w-md mx-auto ">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <Button className="w-full mb-6" type="submit">
        Add new slot
      </Button>
      {sortedDates.map((date) => (
        <div key={date} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {date.substring(0, 10)}
          </h3>
          <div className="bg-white shadow rounded-lg p-4">
            {groupedAppointments[date].map((appointment) => (
              <AppointmentItem
                key={appointment.id}
                time={appointment.time}
                onDelete={() => deleteAppointment(appointment.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
