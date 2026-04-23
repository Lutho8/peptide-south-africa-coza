import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Mail, Shield, GraduationCap, Tag, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import CRMEnrollmentsTable from '@/components/admin/CRMEnrollmentsTable';
import VialLabelMaker from '@/components/admin/VialLabelMaker';
import COAUploadManager from '@/components/admin/COAUploadManager';

interface UserRow {
  id: string;
  display_name: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });

      if (error) throw error;

      if (!data) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await loadUsers();
    } catch (err) {
      console.error('Admin check failed:', err);
      toast.error('Failed to verify admin access');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data as UserRow[]) || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Failed to load users');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            <Shield className="h-3 w-3 mr-1" />
            Administrator
          </Badge>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="crm" className="gap-1.5">
              <GraduationCap className="h-4 w-4" />
              Course CRM
            </TabsTrigger>
            <TabsTrigger value="labels" className="gap-1.5">
              <Tag className="h-4 w-4" />
              Label Maker
            </TabsTrigger>
            <TabsTrigger value="coa" className="gap-1.5">
              <Upload className="h-4 w-4" />
              COA Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Users</CardDescription>
                  <CardTitle className="text-3xl">{users.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>New (Last 30 Days)</CardDescription>
                  <CardTitle className="text-3xl text-primary">
                    {
                      users.filter(
                        (u) => new Date(u.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
                      ).length
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar className="h-4 w-4 text-primary" />
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Free-access overview of all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Mail className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">{u.display_name || 'Unknown User'}</span>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(u.created_at), 'MMM d, yyyy')}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crm">
            <CRMEnrollmentsTable />
          </TabsContent>

          <TabsContent value="labels">
            <VialLabelMaker />
          </TabsContent>

          <TabsContent value="coa">
            <COAUploadManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
