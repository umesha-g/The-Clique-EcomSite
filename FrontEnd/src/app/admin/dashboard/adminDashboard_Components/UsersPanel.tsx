import {
  createUser,
  deleteUser,
  getAllUsers,
  RegisterRequest,
  UserResponse,
} from '@/api/admin/admin-user-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';

const UsersPanel: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [newUser, setNewUser] = useState<RegisterRequest>({
    firstName: '',
    email: '',
    password: '',
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(page);
      setUsers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser(newUser);
      fetchUsers();
      setNewUser({ firstName: '', email: '', password: '' });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // const handleUpdateUser = async (
  //   id: string,
  //   updatedUser: UserProfileUpdateRequest,
  // ) => {
  //   try {
  //     await updateUser(id, updatedUser);
  //     fetchUsers();
  //   } catch (error) {
  //     console.error('Error updating user:', error);
  //   }
  // };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <Input
            placeholder="First Name"
            value={newUser.firstName}
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
          />
          <Input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <Button onClick={handleCreateUser} className="col-span-3">
            Create User
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteUser(user.id)}
                    variant="destructive"
                    className="mr-2"
                  >
                    Delete
                  </Button>
                  {/* Add an edit button or modal here for updating user details */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between mt-4">
          <Button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersPanel;
