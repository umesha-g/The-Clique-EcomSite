import React, { useCallback, useEffect, useState } from 'react';
import {
  deleteUser,
  getAllUsers,
  UserResponse,
} from '@/api/admin/admin-user-api';
import { Button } from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
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
import { Edit, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import AddEditUserDialog from './UserPanelComponents/AddEditUserDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import {Pagination} from "@/app/components/PaginationComponent";
import {prefix} from "@/utils/apiConfig";
import Image from "next/image";

const UsersPanel: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const { toast } = useToast();

  const debouncedSearch = useCallback(
      debounce((term: string) => {
        fetchUsers(term);
      }, 500),
      []
  );

  const fetchUsers = async (searchTerm: string = '') => {
    try {
      const response = await getAllUsers(currentPage, 10, 'createdAt', searchTerm);
      setUsers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching Users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUsers('');
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, currentPage, debouncedSearch]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddDialogOpen(true);
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setIsAddDialogOpen(true);
  };

  const handleDeleteClick = (user: UserResponse) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      await fetchUsers(searchTerm);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user"+error,
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
      <Card className="rounded-none w-[1500px] h-auto">
        <CardHeader>
          <CardTitle className={"text-xl"}>Users Management</CardTitle>
          <CardDescription>{totalElements -1} Users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-10">
            <Input
                placeholder="Search Users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm rounded-none"
            />
            <Button onClick={handleAddUser} className="rounded-none">
              Add User
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Picture</TableHead>
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
                    <TableCell>{user.userDPUrl &&(
                        <div className={" flex ml-10"}>
                            <Image
                                src={prefix + user.userDPUrl}
                                alt={`${user.firstName} DP`}
                                width={100}
                                height={100}
                                className="w-12 rounded-full h-12 object-contain"
                            />
                        </div>)
                    }</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button
                            onClick={() => handleEditUser(user)}
                            variant="outline"
                            className="rounded-none"
                            size="icon"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => handleDeleteClick(user)}
                            variant="destructive"
                            className="rounded-none"
                            size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 &&
            <div className="mt-8 flex justify-center">
              <Pagination
                  currentPage = {currentPage + 1}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
              />
            </div>
          }

          <AddEditUserDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              user={selectedUser}
              onSuccess={() => fetchUsers(searchTerm)}
          />

          <DeleteConfirmationDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              onConfirm={handleDeleteConfirm}
              type={"User"}
          />
        </CardContent>
      </Card>
  );
};

export default UsersPanel;