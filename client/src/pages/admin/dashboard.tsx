import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { User, Facility, FacilityProgress } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  FileBarChart, 
  Activity,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { format } from "date-fns";

// Helper to get status badge variant
function getStatusBadge(status: boolean | undefined) {
  if (status === undefined) return { variant: "outline" as const, label: "Unknown" };
  return status 
    ? { variant: "success" as const, label: "Complete" }
    : { variant: "destructive" as const, label: "Incomplete" };
}

// Custom badge variants
const badgeVariants = {
  success: "bg-green-100 text-green-800 hover:bg-green-200",
  destructive: "bg-red-100 text-red-800 hover:bg-red-200",
};

// Stat card component
function StatCard({ title, value, icon: Icon, description }: { 
  title: string; 
  value: number | string; 
  icon: React.ElementType; 
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch users data
  const { 
    data: users = [],
    isLoading: usersLoading,
  } = useQuery<Omit<User, "password">[]>({
    queryKey: ["/api/admin/users"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin
  });
  
  // Fetch facilities data
  const { 
    data: facilities = [],
    isLoading: facilitiesLoading, 
  } = useQuery<Facility[]>({
    queryKey: ["/api/facilities"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin
  });
  
  // Fetch progress data
  const { 
    data: progressData = [],
    isLoading: progressLoading, 
  } = useQuery<FacilityProgress[]>({
    queryKey: ["/api/admin/facility-progress"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin
  });
  
  const isLoading = usersLoading || facilitiesLoading || progressLoading;
  
  // Calculate compliance stats
  const complianceStats = progressData.reduce((acc, progress) => {
    if (progress.profile_complete) acc.profileComplete++;
    if (progress.assessment_complete) acc.assessmentComplete++;
    if (progress.financial_complete) acc.financialComplete++;
    if (progress.compliance_complete) acc.complianceComplete++;
    if (progress.deployment_complete) acc.deploymentComplete++;
    
    const allComplete = progress.profile_complete && 
      progress.assessment_complete && 
      progress.financial_complete && 
      progress.compliance_complete && 
      progress.deployment_complete;
      
    if (allComplete) acc.fullyCompliant++;
    return acc;
  }, {
    profileComplete: 0,
    assessmentComplete: 0, 
    financialComplete: 0,
    complianceComplete: 0,
    deploymentComplete: 0,
    fullyCompliant: 0
  });
  
  // Data for the compliance completion chart
  const complianceChartData = [
    { name: 'Profile', value: complianceStats.profileComplete },
    { name: 'Assessment', value: complianceStats.assessmentComplete },
    { name: 'Financial', value: complianceStats.financialComplete },
    { name: 'Compliance', value: complianceStats.complianceComplete },
    { name: 'Deployment', value: complianceStats.deploymentComplete },
  ];
  
  // Calculate users by role
  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Data for role distribution chart
  const roleChartData = Object.entries(usersByRole).map(([role, count]) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: count
  }));
  
  // Data for county distribution
  const facilityCountyDistribution = facilities.reduce((acc, facility) => {
    acc[facility.county] = (acc[facility.county] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to chart data and sort by count
  const countyChartData = Object.entries(facilityCountyDistribution)
    .map(([county, count]) => ({ county, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Take top 10
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  if (!isAdmin) {
    return <Redirect to="/unauthorized" />;
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6 max-w-6xl">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage facilities, users, and track compliance progress.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Summary Statistics */}
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard 
                  title="Total Facilities" 
                  value={facilities.length} 
                  icon={Building2}
                  description="Skilled nursing facilities in the system" 
                />
                <StatCard 
                  title="Registered Users" 
                  value={users.length} 
                  icon={Users}
                  description="Active platform users" 
                />
                <StatCard 
                  title="Compliance Rate" 
                  value={`${Math.round((complianceStats.fullyCompliant / (facilities.length || 1)) * 100)}%`} 
                  icon={FileBarChart}
                  description="Facilities with complete compliance" 
                />
              </div>
              
              {/* Charts Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Progress</CardTitle>
                    <CardDescription>
                      Completion rate by compliance stage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={complianceChartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="Completed" fill="#0284c7" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>User Role Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of users by role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={roleChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {roleChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* County Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Counties by Facility Count</CardTitle>
                  <CardDescription>
                    Distribution of facilities across counties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={countyChartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="county" />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0284c7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData.slice(0, 5).map((progress) => {
                      const facility = facilities.find(f => f.facility_id === progress.facility_id);
                      const user = users.find(u => u.id === progress.user_id);
                      
                      return (
                        <div key={progress.id} className="flex items-center space-x-4">
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{facility?.facility_name || 'Unknown Facility'}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>Updated by {user?.name || user?.username || 'Unknown User'}</span>
                              <span className="mx-1">•</span>
                              <span>{format(new Date(progress.last_updated), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            progress.profile_complete &&
                            progress.assessment_complete &&
                            progress.compliance_complete &&
                            progress.financial_complete &&
                            progress.deployment_complete
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }>
                            {progress.profile_complete &&
                             progress.assessment_complete &&
                             progress.compliance_complete &&
                             progress.financial_complete &&
                             progress.deployment_complete
                                ? "Complete"
                                : "In Progress"
                            }
                          </Badge>
                        </div>
                      );
                    })}
                    
                    {progressData.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent activity to display
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.name || '-'}</TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facility Compliance Status</CardTitle>
              <CardDescription>
                Track compliance progress across all facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {facilitiesLoading || progressLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Facility Name</TableHead>
                        <TableHead>County</TableHead>
                        <TableHead>Profile</TableHead>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Compliance</TableHead>
                        <TableHead>Financial</TableHead>
                        <TableHead>Deployment</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {facilities.map((facility) => {
                        const progress = progressData.find(p => p.facility_id === facility.facility_id) || {
                          profile_complete: false,
                          assessment_complete: false,
                          compliance_complete: false,
                          financial_complete: false,
                          deployment_complete: false,
                        };
                        
                        const fullyComplete = progress.profile_complete && 
                          progress.assessment_complete && 
                          progress.compliance_complete && 
                          progress.financial_complete && 
                          progress.deployment_complete;
                        
                        const inProgress = progress.profile_complete || 
                          progress.assessment_complete || 
                          progress.compliance_complete || 
                          progress.financial_complete || 
                          progress.deployment_complete;
                        
                        let statusIcon = <XCircle className="h-4 w-4 text-red-500" />;
                        if (fullyComplete) {
                          statusIcon = <CheckCircle className="h-4 w-4 text-green-500" />;
                        } else if (inProgress) {
                          statusIcon = <Clock className="h-4 w-4 text-amber-500" />;
                        }
                        
                        return (
                          <TableRow key={facility.facility_id}>
                            <TableCell className="font-medium">
                              {facility.facility_name}
                            </TableCell>
                            <TableCell>{facility.county}</TableCell>
                            <TableCell>
                              <Badge className={progress.profile_complete ? badgeVariants.success : badgeVariants.destructive}>
                                {progress.profile_complete ? "Complete" : "Incomplete"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={progress.assessment_complete ? badgeVariants.success : badgeVariants.destructive}>
                                {progress.assessment_complete ? "Complete" : "Incomplete"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={progress.compliance_complete ? badgeVariants.success : badgeVariants.destructive}>
                                {progress.compliance_complete ? "Complete" : "Incomplete"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={progress.financial_complete ? badgeVariants.success : badgeVariants.destructive}>
                                {progress.financial_complete ? "Complete" : "Incomplete"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={progress.deployment_complete ? badgeVariants.success : badgeVariants.destructive}>
                                {progress.deployment_complete ? "Complete" : "Incomplete"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {statusIcon}
                                <span className="ml-2">
                                  {fullyComplete ? "Complete" : inProgress ? "In Progress" : "Not Started"}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}