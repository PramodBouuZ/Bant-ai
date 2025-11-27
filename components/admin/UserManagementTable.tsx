
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { UserProfile, UserRole, UserStatus } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Stores ID of user being updated

  const fetchUsers = async () => {
    setLoading(true);
    // In a real app, this would be a Supabase query to the 'users' table
    // For now, we fetch from the public table. Note: RLS must allow admins to select all.
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users.');
    } else {
      // Map data and ensure status defaults to 'active' if missing
      const mappedUsers: UserProfile[] = (data || []).map((u: any) => ({
        ...u,
        status: u.status || 'active'
      }));
      setUsers(mappedUsers);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Failed to update user status.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  if (error) return <div className="text-red-600 p-4 bg-red-50 rounded">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 
                      user.role === UserRole.VENDOR ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'suspended' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {actionLoading === user.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      {/* Vendor Approval Logic */}
                      {user.role === UserRole.VENDOR && user.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-green-600 hover:text-green-900 font-bold mr-2"
                        >
                          Approve
                        </button>
                      )}

                      {/* Suspend / Activate Logic */}
                      {user.status === 'suspended' ? (
                        <button
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          className="text-red-600 hover:text-red-900"
                          // Prevent banning other admins for safety in this demo
                          disabled={user.role === UserRole.ADMIN}
                        >
                          Suspend
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
