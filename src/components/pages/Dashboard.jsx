import { useState, useEffect } from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { taskService } from "@/services/api/taskService"
import { projectService } from "@/services/api/projectService"
import { format } from "date-fns"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ])
      setTasks(tasksData)
      setProjects(projectsData)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading message="Loading dashboard..." />
  if (error) return <Error message={error} onRetry={loadData} />

const recentTask = tasks
    .sort((a, b) => new Date(b.updatedAt_c || b.ModifiedOn) - new Date(a.updatedAt_c || a.ModifiedOn))
    .find(task => task.status_c === "inProgress") || tasks[0]

  const recentTaskProject = recentTask ? projects.find(p => p.Id === recentTask.projectId_c) : null

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === "done").length,
    inProgressTasks: tasks.filter(t => t.status === "inProgress").length,
    totalProjects: projects.length
  }

  const recentActivity = tasks
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your tasks.</p>
      </div>

      {/* What was I doing? */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center space-x-3 mb-4">
          <ApperIcon name="Clock" size={24} className="text-primary" />
          <h2 className="text-xl font-mono font-semibold text-white">What was I doing?</h2>
        </div>
        
        {recentTask ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{recentTask.title}</h3>
                {recentTask.description && (
                  <p className="text-gray-400 text-sm mb-2">{recentTask.description}</p>
                )}
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{recentTaskProject?.name || "No Project"}</span>
                  <span>•</span>
                  <span>Last updated {format(new Date(recentTask.updatedAt), "MMM d 'at' h:mm a")}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge variant={recentTask.priority}>{recentTask.priority}</Badge>
                <Badge variant={recentTask.status}>
                  {recentTask.status === "inProgress" ? "In Progress" : recentTask.status}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No recent tasks found. Time to create your first task!</p>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Tasks</p>
              <p className="text-2xl font-mono font-bold text-white">{stats.totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={24} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Completed</p>
              <p className="text-2xl font-mono font-bold text-success">{stats.completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle2" size={24} className="text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">In Progress</p>
              <p className="text-2xl font-mono font-bold text-warning">{stats.inProgressTasks}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Projects</p>
              <p className="text-2xl font-mono font-bold text-secondary">{stats.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="FolderOpen" size={24} className="text-secondary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ApperIcon name="Activity" size={20} className="text-primary" />
          <h2 className="text-lg font-mono font-semibold text-white">Recent Activity</h2>
        </div>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
{recentActivity.map(task => {
              const project = projects.find(p => p.Id === task.projectId_c)
              return (
                <div key={task.Id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{task.title_c}</p>
                    <p className="text-xs text-gray-500">
                      {project?.Name || "No Project"} • {format(new Date(task.updatedAt_c || task.ModifiedOn), "MMM d 'at' h:mm a")}
                    </p>
                  </div>
                  <Badge variant={task.status_c} className="flex-shrink-0">
                    {task.status_c === "inProgress" ? "In Progress" : task.status_c}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <Empty
            title="No recent activity"
            description="Start working on tasks to see your activity here"
            icon="Activity"
          />
        )}
      </Card>
    </div>
  )
}

export default Dashboard