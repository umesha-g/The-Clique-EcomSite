import React, {useCallback, useEffect, useState} from 'react';
import {
  createUser,
  deleteUser,
  getAllUsers,
  RegisterRequest, updateUserById,
  UserProfileUpdateRequest,
  UserResponse,
} from '@/api/admin/admin-user-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import debounce from 'lodash/debounce';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const UsersPanel: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [userForm, setUserForm] = useState<RegisterRequest & { id: string }>({
    id:'',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
      debounce((term: string) => {
        fetchUsers(term);
      }, 500),
      []
  );

  useEffect(() => {
    fetchUsers('');
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, currentPage, debouncedSearch]);

  const handleCreateOrUpdateUser = async () => {
    try {
      if (isEditing) {
        const updateRequest: UserProfileUpdateRequest = {
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          email: userForm.email,
          phoneNumber: userForm.phoneNumber,
          currentPassword: '',
        };
        await updateUserById(userForm.id, updateRequest);
      } else {
        await createUser(userForm);
      }
      await fetchUsers('');
      resetForm();
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
  };

  const fetchUsers = async (searchTerm: string = '') => {
    try {
      const response = await getAllUsers(currentPage,pageSize,'createdAt', searchTerm);
      setUsers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  };

  const handleUpdateClick = (user: UserResponse) => {
    setUserForm({
      id:user.id,
      firstName: user.firstName,
      lastName: user.lastName || '',
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      password:'', // Clear password field for security
    });
    setIsEditing(true);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      await fetchUsers('');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const resetForm = () => {
    setUserForm({
      id:'',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
    });
    setIsEditing(false);
  };

  return (
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
              placeholder="Search Users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-8 rounded-none"
          />
          <h4 className={'mb-4 mt-4'}>Add/Update Users</h4>
          <div className="mb-12 grid grid-cols-3 gap-4">

            <Input
                placeholder="First Name"
                value={userForm.firstName}
                className="rounded-none"
                onChange={(e) =>
                    setUserForm({ ...userForm, firstName: e.target.value })
                }
            />
            <Input
                placeholder="Last Name"
                value={userForm.lastName}
                className="rounded-none"
                onChange={(e) =>
                    setUserForm({ ...userForm, lastName: e.target.value })
                }
            />
            <Input
                placeholder="Phone"
                value={userForm.phoneNumber}
                className="rounded-none"
                onChange={(e) =>
                    setUserForm({ ...userForm, phoneNumber: e.target.value })
                }
            />
            <Input
                type="email"
                placeholder="Email"
                value={userForm.email}
                className="rounded-none"
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            />
            <Input
                type="password"
                placeholder="Password"
                value={userForm.password}
                className="rounded-none"
                onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                }
            />
            <div className="space-x-2 col-span-3">
            <Button onClick={handleCreateOrUpdateUser} className="rounded-none">
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
              {isEditing && (
                  <Button variant="outline" onClick={resetForm} className={"rounded-none"}>
                    Cancel
                  </Button>
              )}
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>E-mail</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="space-x-2">
                      <Button
                          onClick={() => handleUpdateClick(user)}
                          className="mr-2 rounded-none"
                          variant="default"
                      >
                        Update
                      </Button>
                      <Button
                          onClick={() => handleDeleteUser(user.id)}
                          variant="destructive"
                          className="mr-2 rounded-none"
                      >
                        Delete
                      </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Total items: {totalElements}
            </div>
            <div className="flex gap-2">
              <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  variant="outline"
                  className={"rounded-none"}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
              Page {currentPage + 1} of {totalPages}
            </span>
              <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  variant="outline"
                  className={"rounded-none"}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

export default UsersPanel;