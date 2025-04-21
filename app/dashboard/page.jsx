import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const Dashboard = () => {
  return (
    <div className="p-8" >
      <h2 className="font-semibold text-xl" >Dashboard</h2>
      <h2 className="text-gray-600" >Create and start your AI Mockup Interview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 my-4" >
        <AddNewInterview/>
      </div>

      <InterviewList/>
    </div>
  );
};

export default Dashboard;
