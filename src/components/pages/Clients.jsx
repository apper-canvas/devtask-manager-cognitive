import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { clientService } from '@/services/api/clientService';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    Owner: '',
    income_c: '',
    gender_c: '',
    website_c: '',
    customerrating_c: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    setFormData({
      Name: '',
      Tags: '',
      Owner: '',
      income_c: '',
      gender_c: '',
      website_c: '',
      customerrating_c: ''
    });
    setShowAddModal(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setFormData({
      Name: client.Name || '',
      Tags: client.Tags || '',
      Owner: client.Owner?.Name || client.Owner || '',
      income_c: client.income_c || '',
      gender_c: client.gender_c || '',
      website_c: client.website_c || '',
      customerrating_c: client.customerrating_c || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (showAddModal) {
        const newClient = await clientService.create(formData);
        if (newClient) {
          toast.success('Client created successfully');
          setShowAddModal(false);
          loadClients();
        } else {
          toast.error('Failed to create client');
        }
      } else if (showEditModal) {
        const updated = await clientService.update(selectedClient.Id, formData);
        if (updated) {
          toast.success('Client updated successfully');
          setShowEditModal(false);
          loadClients();
        } else {
          toast.error('Failed to update client');
        }
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const confirmDelete = async () => {
    try {
      const success = await clientService.delete(selectedClient.Id);
      if (success) {
        toast.success('Client deleted successfully');
        setShowDeleteModal(false);
        loadClients();
      } else {
        toast.error('Failed to delete client');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatWebsite = (url) => {
    if (!url) return '-';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseInt(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <ApperIcon
          key={i}
          name="Star"
          size={16}
          className={i <= numRating ? "text-yellow-400 fill-current" : "text-gray-400"}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadClients} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-gray-400 mt-1">Manage your client information</p>
        </div>
        <Button onClick={handleAddClient} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Client
        </Button>
      </div>

      {/* Clients List */}
      {clients.length === 0 ? (
        <Empty 
          title="No clients found"
          description="Get started by adding your first client"
          action={
            <Button onClick={handleAddClient} className="flex items-center gap-2">
              <ApperIcon name="Plus" size={16} />
              Add Client
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.Id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white text-lg">{client.Name}</h3>
                  {client.Tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {client.Tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClient(client)}
                  >
                    <ApperIcon name="Edit" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClient(client)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Income:</span>
                  <span className="text-white font-medium">
                    {formatCurrency(client.income_c)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Gender:</span>
                  <span className="text-white">{client.gender_c || '-'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Website:</span>
                  {client.website_c ? (
                    <a
                      href={formatWebsite(client.website_c)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline"
                    >
                      Visit
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Rating:</span>
                  {renderStars(client.customerrating_c)}
                </div>
                
                {client.Owner && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Owner:</span>
                    <span className="text-white">{client.Owner.Name || client.Owner}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {showAddModal ? 'Add Client' : 'Edit Client'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <Input
                  value={formData.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <Input
                  value={formData.Tags}
                  onChange={(e) => handleInputChange('Tags', e.target.value)}
                  placeholder="Enter tags (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Owner
                </label>
                <Input
                  value={formData.Owner}
                  onChange={(e) => handleInputChange('Owner', e.target.value)}
                  placeholder="Enter owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Income
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.income_c}
                  onChange={(e) => handleInputChange('income_c', e.target.value)}
                  placeholder="Enter income amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <div className="space-y-2">
                  {['Male', 'Female', 'Other'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={formData.gender_c === option}
                        onChange={(e) => handleInputChange('gender_c', e.target.value)}
                        className="mr-2 text-primary focus:ring-primary"
                      />
                      <span className="text-white">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <Input
                  type="url"
                  value={formData.website_c}
                  onChange={(e) => handleInputChange('website_c', e.target.value)}
                  placeholder="Enter website URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Rating (1-5)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.customerrating_c}
                  onChange={(e) => handleInputChange('customerrating_c', e.target.value)}
                  placeholder="Enter rating (1-5)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {showAddModal ? 'Add Client' : 'Update Client'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Delete Client</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{selectedClient?.Name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Clients;