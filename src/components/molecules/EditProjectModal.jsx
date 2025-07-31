import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import ApperIcon from "@/components/ApperIcon"
import { projectService } from "@/services/api/projectService"

const EditProjectModal = ({ isOpen, onClose, project, onProjectUpdated }) => {
const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    phone: "",
    color: "#00D9FF"
  })
  const [loading, setLoading] = useState(false)

  const colors = [
    "#00D9FF", "#7B61FF", "#00F5A0", "#FFB800", 
    "#FF3B3B", "#FF6B6B", "#4ECDC4", "#45B7D1",
    "#96CEB4", "#FECA57", "#FF9FF3", "#54A0FF"
  ]

useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        website: project.website || project.repositoryUrl || "",
        phone: project.phone_c || "",
        color: project.color || "#00D9FF"
      })
    }
  }, [project])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error("Project name is required")
      return
    }

    setLoading(true)
    try {
const updatedProject = await projectService.update(project.Id, {
        Name: formData.name.trim(),
        description_c: formData.description.trim(),
        phone_c: formData.phone.trim(),
        website: formData.website.trim()
      })
      onProjectUpdated(updatedProject)
    } catch (error) {
      toast.error("Failed to update project")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg border border-gray-600 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-mono font-semibold text-white">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter project name"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your project (optional)"
              rows={3}
              maxLength={500}
/>
          </div>

<div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website
            </label>
            <Input
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter phone number"
              type="tel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange("color", color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color 
                      ? "border-white scale-110" 
                      : "border-gray-600 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Save" size={16} />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProjectModal