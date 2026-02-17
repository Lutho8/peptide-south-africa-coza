import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Crown, Calendar, Mail, Shield, GraduationCap } from 'lucide-react';
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

interface MemberData {
  id: string;
  user_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  started_at: string | null;
  expires_at: string | null;
  price_amount: number;
  currency: string;
  profile?: {
    display_name: string | null;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    cancelledMembers: 0,
    revenue: 0,
  });

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
        _role: 'admin'
      });

      if (error) throw error;

      if (!data) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await loadMemberData();
    } catch (err) {
      console.error('Admin check failed:', err);
      toast.error('Failed to verify admin access');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadMemberData = async () => {
    try {
      const { data: memberships, error } = await supabase
        .from('user_memberships')
        .select('id, user_id, status, started_at, expires_at, price_amount, currency')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const memberIds = memberships?.map(m => m.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', memberIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedMembers = (memberships || []).map(m => ({
        ...m,
        profile: profileMap.get(m.user_id),
      }));

      setMembers(enrichedMembers);

      const active = enrichedMembers.filter(m => m.status === 'active').length;
      const cancelled = enrichedMembers.filter(m => m.status === 'cancelled').length;
      const revenue = enrichedMembers
        .filter(m => m.status === 'active')
        .reduce((sum, m) => sum + (m.price_amount || 9.99), 0);

      setStats({
        totalMembers: enrichedMembers.length,
        activeMembers: active,
        cancelledMembers: cancelled,
        revenue,
      });
    } catch (err) {
      console.error('Failed to load member data:', err);
      toast.error('Failed to load member data');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            <Crown className="h-3 w-3 mr-1" />
            Administrator
          </Badge>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger value="members" className="gap-1.5">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="crm" className="gap-1.5">
              <GraduationCap className="h-4 w-4" />
              Course CRM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Members</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalMembers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Subscriptions</CardDescription>
                  <CardTitle className="text-3xl text-green-500">{stats.activeMembers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Crown className="h-4 w-4 text-green-500" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Cancelled</CardDescription>
                  <CardTitle className="text-3xl text-destructive">{stats.cancelledMembers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar className="h-4 w-4 text-destructive" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Monthly Revenue</CardDescription>
                  <CardTitle className="text-3xl">€{stats.revenue.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-muted-foreground">Recurring</span>
                </CardContent>
              </Card>
            </div>

            {/* Members Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Members</CardTitle>
                <CardDescription>Overview of all registered members and their subscription status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No members found
                        </TableCell>
                      </TableRow>
                    ) : (
                      members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Mail className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">
                                {member.profile?.display_name || 'Unknown User'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(member.status)}</TableCell>
                          <TableCell>
                            {member.started_at
                              ? format(new Date(member.started_at), 'MMM d, yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {member.expires_at
                              ? format(new Date(member.expires_at), 'MMM d, yyyy')
                              : 'Never'}
                          </TableCell>
                          <TableCell className="text-right">
                            €{member.price_amount?.toFixed(2) || '9.99'}/{member.currency || 'EUR'}
                          </TableCell>
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
        </Tabs>
      </div>
    </div>
  );
}
