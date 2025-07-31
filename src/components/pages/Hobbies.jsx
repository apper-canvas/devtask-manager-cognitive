import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { hobbyService } from '@/services/api/hobbyService';
import { customerService } from '@/services/api/customerService';

function Hobbies() {
  const [hobbies, setHobbies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHobby, setEditingHobby] = useState(null);
  const [formData, setFormData] = useState({
    hobbyName_c: '',
    customerId_c: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [hobbiesData, customersData] = await Promise.all([
        hobbyService.getAll(),
        customerService.getAll()
      ]);
      setHobbies(hobbiesData);
      setCustomers(customersData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHobby = async (e) => {
    e.preventDefault();
    try {
      const newHobby = await hobbyService.create(formData);
      setHobbies(prev => [newHobby, ...prev]);
      setShowAddModal(false);
      setFormData({
        hobbyName_c: '',
        customerId_c: ''
      });
      toast.success('Hobby added successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditHobby = async (e) => {
    e.preventDefault();
    try {
      const updatedHobby = await hobbyService.update(editingHobby.Id, formData);
      setHobbies(prev => prev.map(hobby => 
        hobby.Id === editingHobby.Id ? updatedHobby : hobby
      ));
      setShowEditModal(false);
      setEditingHobby(null);
      setFormData({
        hobbyName_c: '',
        customerId_c: ''
      });
      toast.success('Hobby updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteHobby = async (hobbyId) => {
    if (confirm('Are you sure you want to delete this hobby?')) {
      try {
        await hobbyService.delete(hobbyId);
        setHobbies(prev => prev.filter(hobby => hobby.Id !== hobbyId));
        toast.success('Hobby deleted successfully');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const openEditModal = (hobby) => {
    setEditingHobby(hobby);
    setFormData({
      hobbyName_c: hobby.hobbyName_c || '',
      customerId_c: hobby.customerId_c?.Id || hobby.customerId_c || ''
    });
    setShowEditModal(true);
  };

  const getCustomerName = (customerId) => {
    if (typeof customerId === 'object' && customerId?.Name) {
      return customerId.Name;
    }
    const customer = customers.find(c => c.Id === customerId);
    return customer ? `${customer.firstName_c || ''} ${customer.lastName_c || ''}`.trim() : 'Unknown Customer';
  };

  const filteredHobbies = hobbies.filter(hobby =>
    (hobby.hobbyName_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCustomerName(hobby.customerId_c).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hobbies</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Hobby
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search hobbies or customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredHobbies.length === 0 ? (
        <Empty message="No hobbies found" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Hobby Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredHobbies.map((hobby) => (
                  <tr key={hobby.Id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-sm">{hobby.hobbyName_c || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{getCustomerName(hobby.customerId_c)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(hobby)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHobby(hobby.Id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Hobby Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Hobby</h2>
            <form onSubmit={handleAddHobby} className="space-y-4">
              <Input
                label="Hobby Name"
                type="text"
                required
                value={formData.hobbyName_c}
                onChange={(e) => setFormData(prev => ({ ...prev, hobbyName_c: e.target.value }))}
              />
              <Select
                label="Customer"
                required
                value={formData.customerId_c}
                onChange={(e) => setFormData(prev => ({ ...prev, customerId_c: e.target.value }))}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.Id} value={customer.Id}>
                    {`${customer.firstName_c || ''} ${customer.lastName_c || ''}`.trim() || customer.email_c || `Customer ${customer.Id}`}
                  </option>
                ))}
              </Select>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Hobby</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Hobby Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Hobby</h2>
            <form onSubmit={handleEditHobby} className="space-y-4">
              <Input
                label="Hobby Name"
                type="text"
                required
                value={formData.hobbyName_c}
                onChange={(e) => setFormData(prev => ({ ...prev, hobbyName_c: e.target.value }))}
              />
              <Select
                label="Customer"
                required
                value={formData.customerId_c}
                onChange={(e) => setFormData(prev => ({ ...prev, customerId_c: e.target.value }))}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.Id} value={customer.Id}>
                    {`${customer.firstName_c || ''} ${customer.lastName_c || ''}`.trim() || customer.email_c || `Customer ${customer.Id}`}
                  </option>
                ))}
              </Select>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Hobby</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hobbies;