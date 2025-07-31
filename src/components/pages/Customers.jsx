import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { customerService } from '@/services/api/customerService';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    firstName_c: '',
    lastName_c: '',
    email_c: '',
    phone_c: '',
    address_c: '',
    income_c: '',
    gender_c: '',
    website_c: '',
    customerRating_c: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const newCustomer = await customerService.create(formData);
      setCustomers(prev => [newCustomer, ...prev]);
      setShowAddModal(false);
      setFormData({
        firstName_c: '',
        lastName_c: '',
        email_c: '',
        phone_c: '',
        address_c: '',
        income_c: '',
        gender_c: '',
        website_c: '',
        customerRating_c: ''
      });
      toast.success('Customer added successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();
    try {
      const updatedCustomer = await customerService.update(editingCustomer.Id, formData);
      setCustomers(prev => prev.map(customer => 
        customer.Id === editingCustomer.Id ? updatedCustomer : customer
      ));
      setShowEditModal(false);
      setEditingCustomer(null);
      setFormData({
        firstName_c: '',
        lastName_c: '',
        email_c: '',
        phone_c: '',
        address_c: '',
        income_c: '',
        gender_c: '',
        website_c: '',
        customerRating_c: ''
      });
      toast.success('Customer updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.delete(customerId);
        setCustomers(prev => prev.filter(customer => customer.Id !== customerId));
        toast.success('Customer deleted successfully');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName_c: customer.firstName_c || '',
      lastName_c: customer.lastName_c || '',
      email_c: customer.email_c || '',
      phone_c: customer.phone_c || '',
      address_c: customer.address_c || '',
      income_c: customer.income_c || '',
      gender_c: customer.gender_c || '',
      website_c: customer.website_c || '',
      customerRating_c: customer.customerRating_c || ''
    });
    setShowEditModal(true);
  };

  const filteredCustomers = customers.filter(customer =>
    (customer.firstName_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.lastName_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email_c || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCustomers} />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <Empty message="No customers found" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Gender</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Income</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.Id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-sm">
                      {`${customer.firstName_c || ''} ${customer.lastName_c || ''}`.trim() || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">{customer.email_c || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{customer.phone_c || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{customer.gender_c || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      {customer.income_c ? `$${customer.income_c.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {customer.customerRating_c ? `${customer.customerRating_c}/10` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(customer)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.Id)}
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Customer</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <Input
                label="First Name"
                type="text"
                required
                value={formData.firstName_c}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName_c: e.target.value }))}
              />
              <Input
                label="Last Name"
                type="text"
                required
                value={formData.lastName_c}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName_c: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                required
                value={formData.email_c}
                onChange={(e) => setFormData(prev => ({ ...prev, email_c: e.target.value }))}
              />
              <Input
                label="Phone"
                type="text"
                value={formData.phone_c}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_c: e.target.value }))}
              />
              <Textarea
                label="Address"
                value={formData.address_c}
                onChange={(e) => setFormData(prev => ({ ...prev, address_c: e.target.value }))}
              />
              <Input
                label="Income"
                type="number"
                min="0"
                step="0.01"
                value={formData.income_c}
                onChange={(e) => setFormData(prev => ({ ...prev, income_c: e.target.value }))}
              />
              <Select
                label="Gender"
                value={formData.gender_c}
                onChange={(e) => setFormData(prev => ({ ...prev, gender_c: e.target.value }))}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
              <Input
                label="Website"
                type="url"
                value={formData.website_c}
                onChange={(e) => setFormData(prev => ({ ...prev, website_c: e.target.value }))}
              />
              <Input
                label="Customer Rating (1-10)"
                type="number"
                min="1"
                max="10"
                value={formData.customerRating_c}
                onChange={(e) => setFormData(prev => ({ ...prev, customerRating_c: e.target.value }))}
              />
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Customer</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
            <form onSubmit={handleEditCustomer} className="space-y-4">
              <Input
                label="First Name"
                type="text"
                required
                value={formData.firstName_c}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName_c: e.target.value }))}
              />
              <Input
                label="Last Name"
                type="text"
                required
                value={formData.lastName_c}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName_c: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                required
                value={formData.email_c}
                onChange={(e) => setFormData(prev => ({ ...prev, email_c: e.target.value }))}
              />
              <Input
                label="Phone"
                type="text"
                value={formData.phone_c}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_c: e.target.value }))}
              />
              <Textarea
                label="Address"
                value={formData.address_c}
                onChange={(e) => setFormData(prev => ({ ...prev, address_c: e.target.value }))}
              />
              <Input
                label="Income"
                type="number"
                min="0"
                step="0.01"
                value={formData.income_c}
                onChange={(e) => setFormData(prev => ({ ...prev, income_c: e.target.value }))}
              />
              <Select
                label="Gender"
                value={formData.gender_c}
                onChange={(e) => setFormData(prev => ({ ...prev, gender_c: e.target.value }))}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
              <Input
                label="Website"
                type="url"
                value={formData.website_c}
                onChange={(e) => setFormData(prev => ({ ...prev, website_c: e.target.value }))}
              />
              <Input
                label="Customer Rating (1-10)"
                type="number"
                min="1"
                max="10"
                value={formData.customerRating_c}
                onChange={(e) => setFormData(prev => ({ ...prev, customerRating_c: e.target.value }))}
              />
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Customer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;