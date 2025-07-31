class HobbyService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'hobby_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "customerId_c" } },
          { field: { Name: "hobbyName_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching hobbies:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching hobbies:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Hobby ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "customerId_c" } },
          { field: { Name: "hobbyName_c" } },
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
        console.error(`Error fetching hobby with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching hobby with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  async create(hobbyData) {
    try {
      // Only include Updateable fields
const hobbiesString = Array.isArray(hobbyData.hobbies) ? hobbyData.hobbies.join(', ') : (hobbyData.hobbyName_c || hobbyData.hobbyName || "");
      const params = {
        records: [{
          Name: hobbyData.Name || hobbiesString || "",
          Tags: hobbyData.Tags || "",
          Owner: hobbyData.Owner,
          customerId_c: hobbyData.customerId_c || hobbyData.customerId ? parseInt(hobbyData.customerId_c || hobbyData.customerId) : null,
          hobbyName_c: hobbiesString
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
          console.error(`Failed to create hobbies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating hobby:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating hobby:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async update(id, hobbyData) {
    try {
      if (!id) {
        throw new Error("Hobby ID is required for update");
      }

      // Only include Updateable fields
const hobbiesString = Array.isArray(hobbyData.hobbies) ? hobbyData.hobbies.join(', ') : (hobbyData.hobbyName_c || hobbyData.hobbyName || "");
      const params = {
        records: [{
          Id: parseInt(id),
          Name: hobbyData.Name || hobbiesString,
          Tags: hobbyData.Tags,
          Owner: hobbyData.Owner,
          customerId_c: hobbyData.customerId_c || hobbyData.customerId ? parseInt(hobbyData.customerId_c || hobbyData.customerId) : null,
          hobbyName_c: hobbiesString
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
          console.error(`Failed to update hobbies ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating hobby:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating hobby:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Hobby ID is required for deletion");
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
          console.error(`Failed to delete hobbies ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting hobby:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting hobby:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const hobbyService = new HobbyService();