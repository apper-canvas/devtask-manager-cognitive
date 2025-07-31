import { format } from "date-fns";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { projectService } from "@/services/api/projectService";
import ApperIcon from "@/components/ApperIcon";
import Tasks from "@/components/pages/Tasks";
import Card from "@/components/atoms/Card";

const ProjectCard = ({ project, taskCount, completedCount, onClick, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const progressPercentage = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0

const handleDelete = async (e) => {
    e.stopPropagation()
    if (showDeleteConfirm) {
      try {
        await projectService.delete(project.Id)
        onDelete(project.Id)
      } catch (error) {
        console.error('Error deleting project:', error)
        toast.error("Failed to delete project")
      }
    } else {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit()
  }

  return (
    <Card 
      className="p-6 hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-lg"
      onClick={onClick}
    >
<div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-mono font-semibold text-white mb-2 truncate">{project.Name}</h3>
          {project.description && (
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
          )}
          {project.repositoryUrl && (
            <div className="flex items-center space-x-1 mb-2">
              <ApperIcon name="Github" size={12} />
              <a 
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-accent transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                Repository
              </a>
            </div>
          )}
          <p className="text-xs text-gray-500">
            Created {format(new Date(project.createdAt), "MMM d, yyyy")}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
style={{ backgroundColor: project.color }}
          >
            {project.Name.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleEdit}
              className="p-1 rounded hover:bg-surface transition-colors"
              title="Edit project"
            >
              <ApperIcon name="Edit" size={14} className="text-gray-400 hover:text-white" />
            </button>
            
            <button
              onClick={handleDelete}
              className={`p-1 rounded transition-colors ${
                showDeleteConfirm 
                  ? "bg-error/20 hover:bg-error/30" 
                  : "hover:bg-surface"
              }`}
              title={showDeleteConfirm ? "Click again to confirm deletion" : "Delete project"}
            >
              <ApperIcon 
                name={showDeleteConfirm ? "AlertTriangle" : "Trash2"} 
                size={14} 
                className={showDeleteConfirm ? "text-error" : "text-gray-400 hover:text-error"} 
              />
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Tasks</span>
          <span className="text-white font-medium">{taskCount}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Completed</span>
          <span className="text-success font-medium">{completedCount}</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{progressPercentage}% complete</span>
          <div className="flex items-center space-x-1 text-gray-500">
            <ApperIcon name="TrendingUp" size={12} />
            <span>Active</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProjectCard