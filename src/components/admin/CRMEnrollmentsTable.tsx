import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { GraduationCap, Mail, Phone, MessageSquare, CheckCircle2, Download } from 'lucide-react';

interface Enrollment {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  sms_consent: boolean;
  enrolled_at: string;
  course_completed_at: string | null;
}

export default function CRMEnrollmentsTable() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('id, full_name, email, phone, sms_consent, enrolled_at, course_completed_at')
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (err) {
      console.error('Failed to load enrollments:', err);
      toast.error('Failed to load course enrollments');
    } finally {
      setLoading(false);
    }
  };

  const totalEnrolled = enrollments.length;
  const completed = enrollments.filter(e => e.course_completed_at).length;
  const smsOptIns = enrollments.filter(e => e.sms_consent).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* CRM Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Enrollments</CardDescription>
            <CardTitle className="text-3xl">{totalEnrolled}</CardTitle>
          </CardHeader>
          <CardContent>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Course Completed</CardDescription>
            <CardTitle className="text-3xl text-green-500">{completed}</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>SMS Opt-ins</CardDescription>
            <CardTitle className="text-3xl text-blue-500">{smsOptIns}</CardTitle>
          </CardHeader>
          <CardContent>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      {/* Enrollments Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Course Enrollments (CRM)</CardTitle>
            <CardDescription>All leads from the free peptide therapy course — use for email campaigns</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={enrollments.length === 0}
            onClick={() => {
              const headers = ['Name', 'Email', 'Phone', 'SMS Consent', 'Enrolled', 'Completed'];
              const rows = enrollments.map(e => [
                `"${e.full_name}"`,
                e.email,
                e.phone || '',
                e.sms_consent ? 'Yes' : 'No',
                format(new Date(e.enrolled_at), 'yyyy-MM-dd'),
                e.course_completed_at ? format(new Date(e.course_completed_at), 'yyyy-MM-dd') : '',
              ].join(','));
              const csv = [headers.join(','), ...rows].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `course-enrollments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success('CSV downloaded');
            }}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>SMS</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No enrollments yet
                  </TableCell>
                </TableRow>
              ) : (
                enrollments.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.full_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{e.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {e.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{e.phone}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {e.sms_consent ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(e.enrolled_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {e.course_completed_at ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Completed</Badge>
                      ) : (
                        <Badge variant="outline">In Progress</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
