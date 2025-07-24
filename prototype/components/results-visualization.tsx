"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Download, Share, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const performanceData = [
  { name: "Mon", tasks: 12, success: 11, errors: 1 },
  { name: "Tue", tasks: 15, success: 14, errors: 1 },
  { name: "Wed", tasks: 18, success: 17, errors: 1 },
  { name: "Thu", tasks: 22, success: 20, errors: 2 },
  { name: "Fri", tasks: 25, success: 24, errors: 1 },
  { name: "Sat", tasks: 8, success: 8, errors: 0 },
  { name: "Sun", tasks: 6, success: 6, errors: 0 },
]

const agentPerformance = [
  { name: "Data Analyst", completed: 24, success: 23, efficiency: 95.8 },
  { name: "Content Creator", completed: 18, success: 17, efficiency: 94.4 },
  { name: "Research Assistant", completed: 31, success: 30, efficiency: 96.8 },
  { name: "Code Reviewer", completed: 12, success: 10, efficiency: 83.3 },
]

const taskDistribution = [
  { name: "Analysis", value: 35, color: "#3b82f6" },
  { name: "Content", value: 25, color: "#10b981" },
  { name: "Research", value: 30, color: "#f59e0b" },
  { name: "Review", value: 10, color: "#ef4444" },
]

const recentResults = [
  {
    id: "1",
    title: "Q4 Sales Analysis Report",
    agent: "Data Analyst",
    completedAt: "2024-01-15 11:45",
    status: "success",
    insights: "Revenue increased by 23% compared to Q3",
    files: ["sales_report.pdf", "data_visualization.png"],
  },
  {
    id: "2",
    title: "Competitor Analysis",
    agent: "Research Assistant",
    completedAt: "2024-01-15 10:30",
    status: "success",
    insights: "Identified 3 key market opportunities",
    files: ["competitor_analysis.docx", "market_trends.xlsx"],
  },
  {
    id: "3",
    title: "Blog Content Generation",
    agent: "Content Creator",
    completedAt: "2024-01-15 09:15",
    status: "warning",
    insights: "Content generated but requires manual review",
    files: ["blog_draft.md", "seo_keywords.txt"],
  },
]

export function ResultsVisualization() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Results & Analytics</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Task Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2} name="Total Tasks" />
                    <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Successful" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Agent Performance Metrics</CardTitle>
              <CardDescription>Detailed performance analysis for each AI agent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentPerformance.map((agent) => (
                  <div key={agent.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{agent.name}</h4>
                      <Badge variant={agent.efficiency > 90 ? "default" : "secondary"}>
                        {agent.efficiency}% efficiency
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Completed</span>
                        <p className="font-medium">{agent.completed} tasks</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Successful</span>
                        <p className="font-medium text-green-600">{agent.success} tasks</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Failed</span>
                        <p className="font-medium text-red-600">{agent.completed - agent.success} tasks</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="space-y-4">
            {recentResults.map((result) => (
              <Card key={result.id} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>By {result.agent}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(result.completedAt).toLocaleString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                      <Badge variant={result.status === "success" ? "default" : "secondary"}>{result.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium mb-1">Key Insights</h5>
                    <p className="text-sm text-muted-foreground">{result.insights}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Generated Files</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.files.map((file) => (
                        <Badge key={file} variant="outline" className="cursor-pointer hover:bg-muted">
                          <Download className="h-3 w-3 mr-1" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="h-4 w-4 mr-2" />
                      Share Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
