import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { User, Facility, FacilityProgress } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
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
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { 
  Button,
  buttonVariants
} from "@/components/ui/button";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Building2, 
  FileBarChart, 
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Calendar,
  CircleDollarSign,
  ExternalLink,
  UserCheck
} from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { AB2511Deadline } from "@/lib/countdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

// Key metrics component
function KeyMetricCard({ title, value, trend, icon: Icon, description, color = "primary" }: { 
  title: string; 
  value: number | string; 
  trend?: { value: number; label: string; direction: 'up' | 'down' | 'neutral' };
  icon: React.ElementType; 
  description?: string;
  color?: "primary" | "orange" | "green" | "red";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    orange: "bg-orange-500/10 text-orange-600",
    green: "bg-green-500/10 text-green-600",
    red: "bg-red-500/10 text-red-600"
  };

  const trendColor = trend?.direction === 'up' 
    ? 'text-green-600' 
    : trend?.direction === 'down' 
      ? 'text-red-600' 
      : 'text-muted-foreground';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center mt-1">
            <span className={cn("text-xs flex items-center", trendColor)}>
              {trend.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
              {trend.direction === 'down' && <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

// Risk level badge
function RiskBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const colorMap = {
    'High': 'bg-red-100 text-red-800 hover:bg-red-200',
    'Medium': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    'Low': 'bg-green-100 text-green-800 hover:bg-green-200'
  };
  
  return (
    <Badge className={colorMap[level]} variant="outline">
      {level}
    </Badge>
  );
}

// Get days until deadline
function getDaysRemaining(deadline: Date = AB2511Deadline): number {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Days remaining badge
function DaysRemainingBadge({ days }: { days: number }) {
  let variant = "outline";
  if (days < 30) variant = "destructive";
  else if (days < 90) variant = "default";
  
  return (
    <Badge variant={variant as any}>
      {days} days
    </Badge>
  );
}

// Action required table
function ActionRequiredTable() {
  const priorityFacilities = [
    { 
      id: 'SNF12345', 
      name: 'Pinecrest Health', 
      location: 'San Diego, CA', 
      action: 'Verification Required', 
      risk: 'High', 
      days: 21,
      staff: null
    },
    { 
      id: 'SNF23456', 
      name: 'Lakeside Care Center', 
      location: 'Fresno, CA', 
      action: 'Installation Needed', 
      risk: 'High', 
      days: 45,
      staff: 'James Wilson'
    },
    { 
      id: 'SNF34567', 
      name: 'Golden Oaks Nursing', 
      location: 'Sacramento, CA', 
      action: 'Technical Support', 
      risk: 'Medium', 
      days: 60,
      staff: null
    },
    { 
      id: 'SNF45678', 
      name: 'Serenity Skilled Care', 
      location: 'San Jose, CA', 
      action: 'Verification Required', 
      risk: 'Medium', 
      days: 75,
      staff: 'Maria Rodriguez'
    },
    { 
      id: 'SNF56789', 
      name: 'Bayview Nursing Home', 
      location: 'Alameda, CA', 
      action: 'Documentation Missing', 
      risk: 'Low', 
      days: 90,
      staff: null
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Priority Management</CardTitle>
            <CardDescription>Facilities requiring immediate attention</CardDescription>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="verification">Verification</SelectItem>
              <SelectItem value="installation">Installation</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facility</TableHead>
              <TableHead>Action Required</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Days Remaining</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priorityFacilities.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell>
                  <div className="font-medium">{facility.name}</div>
                  <div className="text-sm text-muted-foreground">{facility.location}</div>
                </TableCell>
                <TableCell>{facility.action}</TableCell>
                <TableCell>
                  <RiskBadge level={facility.risk as any} />
                </TableCell>
                <TableCell>
                  <DaysRemainingBadge days={facility.days} />
                </TableCell>
                <TableCell>
                  {facility.staff ? (
                    facility.staff
                  ) : (
                    <Button variant="outline" size="sm">
                      <UserCheck className="h-3.5 w-3.5 mr-1" />
                      Assign
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost">
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="text-sm text-muted-foreground">
          Showing 5 of 32 facilities requiring action
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </CardFooter>
    </Card>
  );
}

// Financial Impact Widget
function FinancialImpactWidget() {
  const savingsData = [
    { month: 'Jan', savings: 120000 },
    { month: 'Feb', savings: 180000 },
    { month: 'Mar', savings: 250000 },
    { month: 'Apr', savings: 310000 },
    { month: 'May', savings: 420000 },
    { month: 'Jun', savings: 520000 },
    { month: 'Jul', savings: 640000 },
    { month: 'Aug', savings: 780000 },
    { month: 'Sep', savings: 950000 },
    { month: 'Oct', savings: 1120000 },
    { month: 'Nov', savings: 1340000 },
    { month: 'Dec', savings: 1500000 },
  ];

  const projectionData = [
    { month: 'Jan', actual: 120000, projected: 100000 },
    { month: 'Feb', actual: 180000, projected: 170000 },
    { month: 'Mar', actual: 250000, projected: 230000 },
    { month: 'Apr', actual: 310000, projected: 300000 },
    { month: 'May', actual: 420000, projected: 380000 },
    { month: 'Jun', actual: 520000, projected: 470000 },
    { month: 'Jul', actual: 640000, projected: 570000 },
    { month: 'Aug', actual: 780000, projected: 680000 },
    { month: 'Sep', actual: 950000, projected: 800000 },
    { month: 'Oct', actual: 1120000, projected: 950000 },
    { month: 'Nov', actual: 1340000, projected: 1150000 },
    { month: 'Dec', actual: 1500000, projected: 1350000 },
    { month: 'Jan 2026', actual: null, projected: 1700000 },
    { month: 'Feb 2026', actual: null, projected: 1900000 },
    { month: 'Mar 2026', actual: null, projected: 2100000 },
    { month: 'Apr 2026', actual: null, projected: 2350000 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Financial Impact</CardTitle>
            <CardDescription>Cost savings for clients across California</CardDescription>
          </div>
          <div className="flex items-center px-3 py-1 rounded-full bg-green-100">
            <CircleDollarSign className="h-4 w-4 text-green-700 mr-1" />
            <span className="text-sm font-medium text-green-700">$1.5M saved to date</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={projectionData}
              margin={{ top: 20, right: 30, left: 25, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorActual)" 
                name="Actual Savings"
                connectNulls
              />
              <Area 
                type="monotone" 
                dataKey="projected" 
                stroke="#82ca9d" 
                fillOpacity={1} 
                fill="url(#colorProjected)"
                name="Projected Savings" 
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="text-sm text-center w-full font-medium text-green-700">
          Great progress! On track to save $2.3 million by compliance deadline
        </div>
      </CardFooter>
    </Card>
  );
}

// Activity timeline
function ActivityTimeline() {
  const today = new Date();
  const activities = [
    { 
      id: 1,
      type: 'assessment',
      facility: 'Pinecrest Health',
      user: 'James Wilson',
      action: 'completed an assessment',
      timestamp: new Date(today.getTime() - 30 * 60000).toISOString(),
    },
    { 
      id: 2,
      type: 'verification',
      facility: 'Golden Oaks Nursing',
      user: 'Sarah Matthews',
      action: 'verified battery installation',
      timestamp: new Date(today.getTime() - 2 * 60 * 60000).toISOString(),
    },
    { 
      id: 3,
      type: 'upload',
      facility: 'Lakeside Care Center',
      user: 'Maria Rodriguez',
      action: 'uploaded new utility bills',
      timestamp: new Date(today.getTime() - 4 * 60 * 60000).toISOString(),
    },
    { 
      id: 4,
      type: 'registration',
      facility: 'Bayview Nursing Home',
      user: 'System',
      action: 'registered as a new facility',
      timestamp: new Date(today.getTime() - 1 * 24 * 60 * 60000).toISOString(),
    },
    { 
      id: 5,
      type: 'schedule',
      facility: 'Serenity Skilled Care',
      user: 'Thomas Chen',
      action: 'scheduled installation for',
      date: new Date(today.getTime() + 7 * 24 * 60 * 60000).toISOString(),
      timestamp: new Date(today.getTime() - 2 * 24 * 60 * 60000).toISOString(),
    },
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const mins = Math.floor(diffInHours * 60);
        return `${mins} minute${mins === 1 ? '' : 's'} ago`;
      }
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  // Icon map for activity types
  const iconMap: Record<string, React.ReactNode> = {
    assessment: <FileBarChart className="h-4 w-4 text-blue-600" />,
    verification: <CheckCircle className="h-4 w-4 text-green-600" />,
    upload: <Activity className="h-4 w-4 text-purple-600" />,
    registration: <Building2 className="h-4 w-4 text-indigo-600" />,
    schedule: <Calendar className="h-4 w-4 text-orange-600" />,
  };

  const upcoming = [
    {
      id: 1,
      facility: 'Golden Oaks Nursing',
      date: addDays(today, 2),
      type: 'Installation',
      staff: 'Thomas Chen'
    },
    {
      id: 2,
      facility: 'Serenity Skilled Care',
      date: addDays(today, 5),
      type: 'Verification',
      staff: 'Sarah Matthews'
    },
    {
      id: 3,
      facility: 'Pinecrest Health',
      date: addDays(today, 7),
      type: 'Assessment',
      staff: 'James Wilson'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity & Timeline</CardTitle>
        <CardDescription>Recent activity and upcoming deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="m-0">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                    {iconMap[activity.type]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {activity.facility}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{activity.user}</span>
                      {' '}
                      {activity.action}
                      {activity.date && (
                        <> <span className="font-medium">{format(new Date(activity.date), 'MMM d, yyyy')}</span></>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="m-0">
            <div className="space-y-4">
              {upcoming.map((event) => (
                <div key={event.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="text-xs uppercase text-muted-foreground">
                      {format(event.date, 'MMM')}
                    </div>
                    <div className="text-xl font-bold">
                      {format(event.date, 'd')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{event.facility}</div>
                    <div className="text-sm flex items-center text-muted-foreground">
                      <span className="mr-2">{event.type}</span>
                      <Badge variant="outline">{event.staff}</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" /> 
                    Details
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="ghost" className="w-full" asChild>
          <div className="flex items-center justify-center">
            View All Activities
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Assessment Status Breakdown
function AssessmentStatusChart() {
  const data = [
    { name: 'Not Started', value: 350, color: '#e11d48' },
    { name: 'In Progress', value: 630, color: '#f97316' },
    { name: 'Complete', value: 220, color: '#22c55e' }
  ];
  
  const COLORS = ['#e11d48', '#f97316', '#22c55e'];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Status</CardTitle>
        <CardDescription>Breakdown of facility assessment progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-between">
        <div className="grid grid-cols-3 gap-4 w-full text-center">
          {data.map((status) => (
            <div key={status.name}>
              <div className="text-lg font-bold">{status.value}</div>
              <div className="text-xs text-muted-foreground">{status.name}</div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

// Implementation Status Card
function ImplementationStatusCard() {
  const data = [
    { name: 'Ready for Installation', value: 187, trend: '+12%' },
    { name: 'Verification Needed', value: 102, trend: '+5%' },
    { name: 'Completed', value: 63, trend: '+18%' },
    { name: 'Not Started', value: 848, trend: '-3%' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Implementation Status</CardTitle>
        <CardDescription>Microgrid installation progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{item.name}</p>
                <div className="text-2xl font-bold">{item.value}</div>
              </div>
              <div className={cn(
                "text-sm",
                item.trend.startsWith('+') ? "text-green-600" : "text-red-600"
              )}>
                {item.trend}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}

// Risk Assessment Card
function RiskAssessmentCard() {
  const data = [
    { name: 'High Risk', value: 120, color: '#e11d48' },
    { name: 'Medium Risk', value: 310, color: '#f97316' },
    { name: 'Low Risk', value: 770, color: '#22c55e' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
        <CardDescription>Facilities by risk level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${(item.value / 1200) * 100}%`,
                    backgroundColor: item.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="w-full">View Risk Report</Button>
      </CardFooter>
    </Card>
  );
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const daysRemaining = getDaysRemaining();
  
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
  
  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Monitor compliance progress, facility status, and key metrics
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Section */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <KeyMetricCard 
                title="Total SNFs" 
                value="1,200" 
                trend={{ value: 5, label: "from last month", direction: "up" }}
                icon={Building2}
                description="Skilled nursing facilities in California" 
              />
              <KeyMetricCard 
                title="Assessment Status" 
                value={Math.round((220 / 1200) * 100) + "%"}
                trend={{ value: 12, label: "from last month", direction: "up" }}
                icon={FileBarChart}
                description="Facilities with completed assessments"
                color="green"
              />
              <KeyMetricCard 
                title="Implementation Status" 
                value={Math.round((63 / 1200) * 100) + "%"}
                trend={{ value: 18, label: "from last month", direction: "up" }}
                icon={CheckCircle}
                description="Facilities with completed installation"
                color="orange"
              />
              <KeyMetricCard 
                title="At-Risk Facilities" 
                value="120"
                trend={{ value: 8, label: "requiring attention", direction: "down" }}
                icon={AlertTriangle}
                description="High-priority sites needing attention"
                color="red"
              />
            </div>
            
            {/* Priority Management */}
            <div className="mt-6">
              <ActionRequiredTable />
            </div>
            
            {/* Financial Impact */}
            <div className="mt-6">
              <FinancialImpactWidget />
            </div>
            
            {/* Activity & Timeline */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <ActivityTimeline />
              {isMobile ? (
                <div className="space-y-6">
                  <AssessmentStatusChart />
                  <ImplementationStatusCard />
                  <RiskAssessmentCard />
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    <AssessmentStatusChart />
                    <div className="grid grid-cols-2 gap-6">
                      <ImplementationStatusCard />
                      <RiskAssessmentCard />
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}