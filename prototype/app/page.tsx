"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Settings, Activity, Users, BarChart3, Plus, Clock, CheckCircle, AlertCircle, Zap } from "lucide-react"
import { AgentCard } from "@/components/agent-card"
import { TaskCreator } from "@/components/task-creator"
import { TaskMonitor } from "@/components/task-monitor"
import { ResultsVisualization } from "@/components/results-visualization"

// Add new imports for MCP and Crew management
import { MCPServerManager } from "@/components/mcp-server-manager"
import { CrewTrigger } from "@/components/crew-trigger"

const mockAgents = [
  {
    id: "1",
    name: "Data Analyst",
    status: "active",
    type: "Analytics",
    tasksCompleted: 24,
    currentTask: "Processing sales data",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Content Creator",
    status: "idle",
    type: "Creative",
    tasksCompleted: 18,
    currentTask: null,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Research Assistant",
    status: "busy",
    type: "Research",
    tasksCompleted: 31,
    currentTask: "Market research analysis",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Code Reviewer",
    status: "error",
    type: "Development",
    tasksCompleted: 12,
    currentTask: "Code quality assessment",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockTasks = [
  {
    id: "1",
    title: "Analyze Q4 Sales Data",
    agent: "Data Analyst",
    status: "running",
    progress: 75,
    startTime: "2024-01-15 10:30",
    estimatedCompletion: "2024-01-15 11:45",
  },
  {
    id: "2",
    title: "Generate Marketing Content",
    agent: "Content Creator",
    status: "queued",
    progress: 0,
    startTime: null,
    estimatedCompletion: "2024-01-15 14:00",
  },
  {
    id: "3",
    title: "Competitor Analysis Report",
    agent: "Research Assistant",
    status: "completed",
    progress: 100,
    startTime: "2024-01-15 09:00",
    estimatedCompletion: "2024-01-15 10:30",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedAgent, setSelectedAgent] = useState(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "idle":
        return "bg-gray-400"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "queued":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Agent Command Center
            </h1>
            <p className="text-muted-foreground mt-2">Manage and monitor your AI workforce</p>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Active Agents</CardTitle>
              <Bot className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAgents.filter((a) => a.status === "active" || a.status === "busy").length}
              </div>
              <p className="text-xs opacity-90">+2 from last hour</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tasks Completed</CardTitle>
              <CheckCircle className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85</div>
              <p className="text-xs opacity-90">+12 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs opacity-90">+2.1% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Avg Response Time</CardTitle>
              <Zap className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2s</div>
              <p className="text-xs opacity-90">-0.3s improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Status Overview */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Agent Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={agent.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {agent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">{agent.type}</p>
                        </div>
                      </div>
                      <Badge variant={agent.status === "active" ? "default" : "secondary"}>{agent.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Tasks */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="space-y-2 p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className="font-medium">{task.title}</span>
                        </div>
                        <Badge variant="outline">{task.agent}</Badge>
                      </div>
                      {task.status === "running" && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">AI Agents</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <MCPServerManager />
          </TabsContent>

          <TabsContent value="crew" className="space-y-6">
            <CrewTrigger agents={mockAgents} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TaskCreator />
              </div>
              <div className="lg:col-span-2">
                <TaskMonitor tasks={mockTasks} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <ResultsVisualization />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
