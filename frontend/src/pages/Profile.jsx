import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Phone, Mail, MapPin } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary">
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({ name: user.name, phone: user.phone });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{user?.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Addresses */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
        {user?.addresses?.length > 0 ? (
          <div className="space-y-3">
            {user.addresses.map((address, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">{address.label}</p>
                    <p className="text-sm text-gray-600">
                      {address.street}, {address.city}, {address.state} {address.zipCode}
                    </p>
                    {address.isDefault && (
                      <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No saved addresses yet</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
