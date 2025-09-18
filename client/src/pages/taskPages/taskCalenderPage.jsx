import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Sidebar from "../../components/sidebar";
import { AuthContext } from "../../components/authContext";
import { Dialog } from "@mui/material";

const localizer = momentLocalizer(moment);

const TaskCalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || !token) return;
      try {
        const response = await axios.get(
          `https://internal-task-management-system.onrender.com/api/task/allTasksAssignedTo/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally{
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token, user]);

  // Convert tasks into calendar events (Only on Deadline Date)
  const events = tasks.map((task) => ({
    id: task._id,
    title: task.title,
    start: new Date(task.deadline), // Only show on deadline
    end: new Date(task.deadline),   // Only show on deadline
    taskData: task,
  }));

  // Handle task click
  const handleSelectEvent = (event) => {
    setSelectedTask(event.taskData);
  };
  if(loading)return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
  return (
    <>
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="ml-64  p-6 bg-gray-100 min-h-screen overflow-auto">
        <h2 className="text-2xl font-semibold text-center mb-4">Task Calendar</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "80vh" }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => ({
              style: { backgroundColor: "#007bff", color: "white", borderRadius: "5px" },
            })}
          />
        </div>

        {/* Task Details Popup */}
        <Dialog open={!!selectedTask} onClose={() => setSelectedTask(null)}>
          {selectedTask && (
            <div className="p-6 bg-white rounded-lg">
              <h3 className="text-xl font-semibold">{selectedTask.title}</h3>
              <p className="text-gray-600">{selectedTask.description}</p>
              <p><strong>Status:</strong> {selectedTask.status}</p>
              <p><strong>Priority:</strong> {selectedTask.priority}</p>
              <p><strong>Deadline:</strong> {moment(selectedTask.deadline).format("LL")}</p>
              <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => setSelectedTask(null)}>
                Close
              </button>
            </div>
          )}
        </Dialog>
      </div>
    </div>
    </>
  );
};

export default TaskCalendarPage;
