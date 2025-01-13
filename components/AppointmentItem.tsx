import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AppointmentItemProps {
  time: string;
  onDelete: () => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ time, onDelete }) => {
  return (
    <div className="flex items-center justify-between ">
      <span className="text-sm font-medium">{time + ":00"}</span>
      <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete appointment">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AppointmentItem;

