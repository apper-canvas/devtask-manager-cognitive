class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
    this.activeTaskId = null;
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 200, offset: 0 }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching tasks:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching task with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  async create(taskData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: taskData.title || taskData.title_c || taskData.Name,
          title_c: taskData.title || taskData.title_c,
          description_c: taskData.description || taskData.description_c || "",
          projectId_c: taskData.projectId ? parseInt(taskData.projectId) : (taskData.projectId_c ? parseInt(taskData.projectId_c) : null),
          priority_c: taskData.priority || taskData.priority_c || "medium",
          status_c: taskData.status || taskData.status_c || "todo",
          createdAt_c: new Date().toISOString(),
          updatedAt_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating task:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async update(id, taskData) {
    try {
      if (!id) {
        throw new Error("Task ID is required for update");
      }

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title || taskData.title_c || taskData.Name,
          title_c: taskData.title || taskData.title_c,
          description_c: taskData.description || taskData.description_c,
          projectId_c: taskData.projectId ? parseInt(taskData.projectId) : (taskData.projectId_c ? parseInt(taskData.projectId_c) : null),
          priority_c: taskData.priority || taskData.priority_c,
          status_c: taskData.status || taskData.status_c,
          updatedAt_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update tasks ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating task:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Task ID is required for deletion");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete tasks ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting task:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async deleteByProjectId(projectId) {
    try {
      if (!projectId) {
        return [];
      }

      // First, get all tasks for this project
      const params = {
        fields: [{ field: { Name: "Id" } }],
        where: [
          {
            FieldName: "projectId_c",
            Operator: "EqualTo", 
            Values: [parseInt(projectId)]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const tasks = response.data || [];
      if (tasks.length === 0) {
        return [];
      }
      
      // Delete all tasks
      const taskIds = tasks.map(task => task.Id);
      const deleteParams = {
        RecordIds: taskIds
      };
      
      const deleteResponse = await this.apperClient.deleteRecord(this.tableName, deleteParams);
      
      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        throw new Error(deleteResponse.message);
      }
      
      return tasks;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting tasks by project ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting tasks by project ID:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async setActive(id) {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      this.activeTaskId = parseInt(id);
      
      // Get the task to return it as active
      const task = await this.getById(id);
      return { ...task, isActive: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error setting active task:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error setting active task:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getActiveTask() {
    try {
      if (!this.activeTaskId) {
        return null;
      }
      
      const task = await this.getById(this.activeTaskId);
      return { ...task, isActive: true };
    } catch (error) {
      // If active task doesn't exist anymore, clear it
      this.activeTaskId = null;
      return null;
    }
  }
}

export const taskService = new TaskService()