import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setUser } from '@/store/userSlice';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
  });

  // Initialize form data when user is available
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        emailAddress: user.emailAddress || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        emailAddress: user.emailAddress || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in Redux store
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        phoneNumber: formData.phoneNumber,
      };
      
      dispatch(setUser(updatedUser));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Please log in to view your profile.</div>
      </div>
    );
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account information and preferences</p>
      </div>

      <Card className="p-6 bg-surface border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-400">{user.emailAddress}</p>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <ApperIcon name="Edit" size={16} className="mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            {isEditing ? (
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="bg-background border-gray-600 text-white"
                placeholder="Enter first name"
              />
            ) : (
              <div className="p-3 bg-background border border-gray-600 rounded-md text-white">
                {user.firstName || 'Not provided'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            {isEditing ? (
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="bg-background border-gray-600 text-white"
                placeholder="Enter last name"
              />
            ) : (
              <div className="p-3 bg-background border border-gray-600 rounded-md text-white">
                {user.lastName || 'Not provided'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <Input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                className="bg-background border-gray-600 text-white"
                placeholder="Enter email address"
              />
            ) : (
              <div className="p-3 bg-background border border-gray-600 rounded-md text-white">
                {user.emailAddress || 'Not provided'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <Input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="bg-background border-gray-600 text-white"
                placeholder="Enter phone number"
              />
            ) : (
              <div className="p-3 bg-background border border-gray-600 rounded-md text-white">
                {user.phoneNumber || 'Not provided'}
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User ID
              </label>
              <div className="p-3 bg-background border border-gray-600 rounded-md text-gray-400">
                {user.userId || 'Not available'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company
              </label>
              <div className="p-3 bg-background border border-gray-600 rounded-md text-gray-400">
                {user.accounts?.[0]?.companyName || 'Not provided'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Status
              </label>
              <div className="p-3 bg-background border border-gray-600 rounded-md">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <ApperIcon name="CheckCircle" size={12} className="mr-1" />
                  Active
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Member Since
              </label>
              <div className="p-3 bg-background border border-gray-600 rounded-md text-gray-400">
                {user.createdDate ? new Date(user.createdDate).toLocaleDateString() : 'Not available'}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;