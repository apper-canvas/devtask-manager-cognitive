import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddProjectModal from "@/components/molecules/AddProjectModal";
import ProjectDetailsModal from "@/components/molecules/ProjectDetailsModal";
import EditProjectModal from "@/components/molecules/EditProjectModal";
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";
import ApperIcon from "@/components/ApperIcon";
import ProjectCard from "@/components/molecules/ProjectCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Tasks from "@/components/pages/Tasks";
import Button from "@/components/atoms/Button";
const Projects = () => {
const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ])
      setProjects(projectsData)
      setTasks(tasksData)
    } catch (err) {
      setError("Failed to load projects")
    } finally {
      setLoading(false)
    }
}

  const handleProjectAdded = (newProject) => {
    setProjects(prev => [newProject, ...prev])
    setIsAddModalOpen(false)
    toast.success("Project created successfully!")
  }

  const handleProjectUpdated = (updatedProject) => {
    setProjects(prev => prev.map(p => p.Id === updatedProject.Id ? updatedProject : p))
    setIsEditModalOpen(false)
    setSelectedProject(null)
    toast.success("Project updated successfully!")
  }

const handleProjectDeleted = async (projectId) => {
    try {
      // Validate project ID before attempting deletion
      if (!projectId) {
        toast.error("Invalid project ID provided")
        return
      }

      // Find the project to get its name for better user feedback
      const projectToDelete = projects.find(p => String(p.Id) === String(projectId))
      if (!projectToDelete) {
        toast.error("Project not found in current list")
        return
      }

      console.log(`Deleting project: "${projectToDelete.name}" with ID: ${projectId}`)
      
      await projectService.delete(projectId)
      setProjects(prev => prev.filter(p => String(p.Id) !== String(projectId)))
      toast.success(`Project "${projectToDelete.name}" and associated tasks deleted successfully!`)
      
    } catch (error) {
      console.error("Error deleting project:", error)
      const errorMessage = error.message || "Unknown error occurred"
      toast.error(`Error deleting project: ${errorMessage}`)
    }
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setIsDetailsModalOpen(true)
  }

  const handleEditProject = (project) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading message="Loading projects..." />
  if (error) return <Error message={error} onRetry={loadData} />

const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId_c === projectId)
    const completed = projectTasks.filter(task => task.status_c === "done")
    return {
      total: projectTasks.length,
      completed: completed.length
    }
  }

  return (
<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Organize your tasks into meaningful projects</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <ApperIcon name="FolderOpen" size={16} />
            <span>{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={16} />
            <span>Add Project</span>
          </Button>
        </div>
      </div>

{projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
{projects.map(project => {
            const stats = getProjectStats(project.Id)
            return (
              <ProjectCard
                key={project.Id}
                project={project}
                taskCount={stats.total}
                completedCount={stats.completed}
                onClick={() => handleProjectClick(project)}
                onEdit={() => handleEditProject(project)}
                onDelete={handleProjectDeleted}
              />
            )
          })}
        </div>
      ) : (
        <Empty
          title="No projects yet"
icon="FolderOpen"
          action={() => setIsAddModalOpen(true)}
          actionLabel="Create Your First Project"
        />
      )}
      )}

      {/* Modals */}
      <AddProjectModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProjectAdded={handleProjectAdded}
      />

      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        project={selectedProject}
        tasks={selectedProject ? tasks.filter(task => task.projectId === selectedProject.Id) : []}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedProject(null)
        }}
        project={selectedProject}
        onProjectUpdated={handleProjectUpdated}
      />

      {/* Project Stats Summary */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-600">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary mb-1">
              {projects.length}
            </div>
            <div className="text-sm text-gray-400">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-warning mb-1">
              {projects.reduce((acc, project) => {
                const stats = getProjectStats(project.Id)
                return acc + stats.total
              }, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-success mb-1">
              {projects.reduce((acc, project) => {
                const stats = getProjectStats(project.Id)
                return acc + stats.completed
              }, 0)}
            </div>
            <div className="text-sm text-gray-400">Completed Tasks</div>
          </div>
</div>
      )}
    </div>
  )
}

export default Projects