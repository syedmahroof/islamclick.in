import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          <span className="text-blue-500">Articles:</span> {payload[0].value}
        </p>
        <p className="text-sm">
          <span className="text-green-500">Users:</span> {payload[1].value}
        </p>
      </div>
    );
  }
  return null;
};

interface DashboardProps {
  stats: {
    articles: {
      total: number;
      published: number;
      drafts: number;
    };
    categories: {
      total: number;
    };
    tags: {
      total: number;
    };
    users: {
      total: number;
      new_this_month: number;
    };
    media: {
      total: number;
      total_size: number;
    };
  };
  recentActivities: {
    articles: Array<{
      id: number;
      title: string;
      author: string;
      created_at: string;
      status: string;
    }>;
    users: Array<{
      id: number;
      name: string;
      email: string;
      created_at: string;
    }>;
  };
  chartData: Array<{
    name: string;
    articles: number;
    users: number;
  }>;
}

export default function Dashboard({
  stats,
  recentActivities,
  chartData,
}: DashboardProps) {
  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />
      
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => window.location.href = route('admin.articles.index')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📝</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.articles.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.articles.published} published, {stats.articles.drafts} drafts
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => window.location.href = route('admin.categories.index')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📂</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tags</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">🏷️</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tags.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">👥</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users.total}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.users.new_this_month} this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Media</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">🖼️</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.media.total}</div>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(stats.media.total_size)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                    <XAxis 
                      dataKey="name" 
                      className="text-xs"
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis 
                      className="text-xs"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="articles" 
                      fill="#3b82f6" 
                      name="Articles" 
                      radius={[4, 4, 0, 0]}
                      className="fill-blue-500"
                    />
                    <Bar 
                      dataKey="users" 
                      fill="#10b981" 
                      name="New Users" 
                      radius={[4, 4, 0, 0]}
                      className="fill-green-500"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Articles */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{article.title}</p>
                      <p className="text-sm text-muted-foreground">
                        By {article.author} • <span className="capitalize">{article.status}</span>
                      </p>
                    </div>
                    <div className="ml-4 text-xs text-muted-foreground">
                      {article.created_at}
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-medium mb-2">New Users</h3>
                  <div className="space-y-3">
                    {recentActivities.users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{user.created_at}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
