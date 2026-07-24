"use client"
import { useState } from "react";

export type experienceProps = {
    id: string;
    company: string;
    role: string;
    startDate: Date;
    endDate: Date | null;
    description: string;
    techUsed: string[];
    createdAt: Date;
    updatedAt: Date;
};


export const useModal3 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<experienceProps | null>(null);

    return { isOpen, setIsOpen, selectedExperience, setSelectedExperience };
};
