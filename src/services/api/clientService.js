// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'client_c';

export const clientService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "income_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "customerrating_c" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching clients:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      if (!id) {
        console.error("Client ID is required");
        return null;
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "income_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "customerrating_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching client with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(clientData) {
    try {
      if (!clientData) {
        console.error("Client data is required");
        return null;
      }
// Only include Updateable fields
      const params = {
        records: [
          {
            "Name": clientData.Name || '',
            "Tags": clientData.Tags || '',
            "Owner": parseInt(clientData.Owner) || 0,
            "income_c": parseFloat(clientData.income_c || clientData.income) || 0,
            "gender_c": clientData.gender_c || clientData.gender || '',
            "website_c": clientData.website_c || clientData.website || '',
            "customerrating_c": parseInt(clientData.customerrating_c || clientData.customerRating) || 0
          }
        ]
      };
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} client records:${JSON.stringify(failedRecords)}`);
          return null;
        }
        
        return successfulRecords[0]?.data || null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating client:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, clientData) {
    try {
      if (!id) {
        console.error("Client ID is required for update");
        return null;
      }

      if (!clientData) {
        console.error("Client data is required for update");
        return null;
      }
// Only include Updateable fields plus Id
      const params = {
        records: [
          {
            "Id": parseInt(id),
            "Name": clientData.Name || '',
            "Tags": clientData.Tags || '',
            "Owner": parseInt(clientData.Owner) || 0,
            "income_c": parseFloat(clientData.income_c || clientData.income) || 0,
            "gender_c": clientData.gender_c || clientData.gender || '',
            "website_c": clientData.website_c || clientData.website || '',
            "customerrating_c": parseInt(clientData.customerrating_c || clientData.customerRating) || 0
          }
        ]
      };
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} client records:${JSON.stringify(failedUpdates)}`);
          return null;
        }
        
        return successfulUpdates[0]?.data || null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating client:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      if (!id) {
        console.error("Client ID is required for deletion");
        return false;
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} client records:${JSON.stringify(failedDeletions)}`);
          return false;
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting client:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};