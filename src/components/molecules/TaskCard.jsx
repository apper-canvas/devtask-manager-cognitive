import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import { format } from "date-fns"
import { taskService } from "@/services/api/taskService"
import { toast } from "react-toastify"

const TaskCard = ({ task, project, onTaskUpdate, onTaskClick }) => {
  const [isUpdating, setIsUpdating] = useState(false)

const handleStatusToggle = async (e) => {
    e.stopPropagation() // Prevent modal from opening
    setIsUpdating(true)
    try {
      const statusMap = {
        todo: "inProgress",
        inProgress: "done",
        done: "todo"
      }
      
      const updatedTask = await taskService.update(task.Id, {
        ...task,
        status_c: statusMap[task.status_c],
        updatedAt_c: new Date().toISOString()
      })
      
      onTaskUpdate(updatedTask)
      toast.success("Task status updated!")
    } catch (error) {
      toast.error(error.message || "Failed to update task status")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo": return "Circle"
      case "inProgress": return "Clock"
      case "done": return "CheckCircle2"
      default: return "Circle"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "text-error"
      case "high": return "text-warning"
      case "medium": return "text-info"
      case "low": return "text-gray-400"
      default: return "text-gray-400"
    }
  }

  return (
<Card 
      className="p-4 hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10" 
      onClick={() => onTaskClick?.(task)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
<h3 className="font-mono font-semibold text-white mb-1">{task.title_c}</h3>
          {task.description_c && (
            <p className="text-sm text-gray-400 mb-2">{task.description_c}</p>
          )}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{project?.Name || "No Project"}</span>
            <span>•</span>
            <span>{format(new Date(task.createdAt_c || task.CreatedOn), "MMM d")}</span>
          </div>
        </div>
        
        <button
          onClick={handleStatusToggle}
          disabled={isUpdating}
          className="ml-4 p-2 rounded-lg hover:bg-surface/50 transition-colors disabled:opacity-50"
        >
          <ApperIcon 
            name={getStatusIcon(task.status)} 
            size={20}
            className={`${task.status === "done" ? "text-success" : "text-gray-400"} ${isUpdating ? "animate-pulse" : ""}`}
          />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant={task.priority}>{task.priority}</Badge>
          <Badge variant={task.status}>
            {task.status === "inProgress" ? "In Progress" : task.status}
          </Badge>
        </div>
        
        <ApperIcon 
          name="Flag" 
          size={16} 
          className={getPriorityColor(task.priority)}
        />
      </div>
    </Card>
  )
}

export default TaskCard