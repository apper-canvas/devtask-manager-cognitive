class CustomerService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'customer_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "income_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "customerRating_c" } },
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
        console.error("Error fetching customers:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching customers:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Customer ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "income_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "customerRating_c" } },
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
        console.error(`Error fetching customer with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching customer with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  async create(customerData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: customerData.Name || `${customerData.firstName_c || customerData.firstName || ""} ${customerData.lastName_c || customerData.lastName || ""}`.trim(),
          Tags: customerData.Tags || "",
          Owner: customerData.Owner,
          firstName_c: customerData.firstName_c || customerData.firstName || "",
          lastName_c: customerData.lastName_c || customerData.lastName || "",
          email_c: customerData.email_c || customerData.email || "",
          phone_c: customerData.phone_c || customerData.phone || "",
          address_c: customerData.address_c || customerData.address || "",
          income_c: customerData.income_c || customerData.income || 0,
          gender_c: customerData.gender_c || customerData.gender || "",
          website_c: customerData.website_c || customerData.website || "",
          customerRating_c: customerData.customerRating_c || customerData.customerRating || 0
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
          console.error(`Failed to create customers ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating customer:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating customer:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async update(id, customerData) {
    try {
      if (!id) {
        throw new Error("Customer ID is required for update");
      }

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: customerData.Name || `${customerData.firstName_c || customerData.firstName || ""} ${customerData.lastName_c || customerData.lastName || ""}`.trim(),
          Tags: customerData.Tags,
          Owner: customerData.Owner,
          firstName_c: customerData.firstName_c || customerData.firstName,
          lastName_c: customerData.lastName_c || customerData.lastName,
          email_c: customerData.email_c || customerData.email,
          phone_c: customerData.phone_c || customerData.phone,
          address_c: customerData.address_c || customerData.address,
          income_c: customerData.income_c || customerData.income,
          gender_c: customerData.gender_c || customerData.gender,
          website_c: customerData.website_c || customerData.website,
          customerRating_c: customerData.customerRating_c || customerData.customerRating
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
          console.error(`Failed to update customers ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating customer:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating customer:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Customer ID is required for deletion");
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
          console.error(`Failed to delete customers ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting customer:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting customer:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const customerService = new CustomerService();