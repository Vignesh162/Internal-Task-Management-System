  // ✅ Function to return status badges based on task status & deadline
  export const getStatusBadge = (status, deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);

    if (status === "completed") {
      return <span className="badge bg-success">Completed</span>;
    } else if (deadlineDate < today) {
      return <span className="badge bg-danger">Past Deadline</span>;
    } else if (status === "in-progress") {
      return <span className="badge bg-warning text-dark">In Progress</span>;
    }
    else{
      return <span className="badge bg-info">Pending</span>;
    }
  };