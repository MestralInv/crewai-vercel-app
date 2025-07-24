"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Play,
  Square,
  Settings,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Workflow,
  BarChart3,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Agent {
  id: string
  name: string
  status: string
  type: string
  tasksCompleted: number
  currentTask: string | null
  avatar: string
}

interface CrewTriggerProps {
  agents: Agent[]
}

const mockCrewTemplates = [
  {
    id: "1",
    name: "Content Marketing Pipeline",
    description: "Research → Write → Review → Publish content workflow",
    agents: ["Research Assistant", "Content Creator", "Code Reviewer"],
    estimatedTime: "45 minutes",
    complexity: "Medium",
  },
  {
    id: "2",
    name: "Data Analysis Workflow",
    description: "Collect → Analyze → Visualize → Report data insights",
    agents: ["Data Analyst", "Research Assistant"],
    estimatedTime: "30 minutes",
    complexity: "High",
  },
  {
    id: "3",
    name: "Product Research",
    description: "Market research → Competitor analysis → Feature recommendations",
    agents: ["Research Assistant", "Data Analyst", "Content Creator"],
    estimatedTime: "60 minutes",
    complexity: "Medium",
  },
]

const mockActiveCrews = [
  {
    id: "1",
    name: "Q1 Marketing Campaign",
    status: "running",
    progress: 65,
    currentStep: "Content Creation",
    agents: ["Research Assistant", "Content Creator"],
    startTime: "2024-01-15 10:30",
    estimatedCompletion: "2024-01-15 11:15",
  },
  {
    id: "2",
    name: "Competitor Analysis Report",
    status: "queued",
    progress: 0,
    currentStep: "Waiting to start",
    agents: ["Research Assistant", "Data Analyst"],
    startTime: null,
    estimatedCompletion: "2024-01-15 12:30",
  },
]

export function CrewTrigger({ agents }: CrewTriggerProps) {
  const [activeTab, setActiveTab] = useState("trigger")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [customCrew, setCustomCrew] = useState({
    name: "",
    description: "",
    goal: "",
    selectedAgents: [] as string[],
    sequential: true,
  })
  const [activeCrews, setActiveCrews] = useState(mockActiveCrews)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-4 w-4 text-blue-500" />
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

  const triggerCrew = (templateId?: string) => {
    const newCrew = {
      id: Date.now().toString(),
      name: templateId ? mockCrewTemplates.find((t) => t.id === templateId)?.name || "Custom Crew" : customCrew.name,
      status: "running",
      progress: 0,
      currentStep: "Initializing",
      agents: templateId ? mockCrewTemplates.find((t) => t.id === templateId)?.agents || [] : customCrew.selectedAgents,
      startTime: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 45 * 60000).toISOString(),
    }
    setActiveCrews([...activeCrews, newCrew])

    // Trigger actual CrewAI workflow
    triggerActualCrew(customCrew.goal || "AI implementation in the investment industry", newCrew.id)
  }

  const triggerActualCrew = async (topic: string, crewId: string) => {
    try {
      const response = await fetch('/api/crew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic,
          mode: 'prototype' // Use prototype mode for Vercel deployment
        })
      })

      const result = await response.json()

      if (result.success) {
        // Update crew status to completed
        setActiveCrews(prevCrews => 
          prevCrews.map(crew => 
            crew.id === crewId 
              ? { 
                  ...crew, 
                  status: 'completed', 
                  progress: 100,
                  currentStep: 'Completed',
                  result: result.result
                }
              : crew
          )
        )
      } else {
        // Update crew status to error
        setActiveCrews(prevCrews => 
          prevCrews.map(crew => 
            crew.id === crewId 
              ? { 
                  ...crew, 
                  status: 'error', 
                  currentStep: 'Error: ' + result.error
                }
              : crew
          )
        )
      }
    } catch (error) {
      console.error('Failed to trigger crew:', error)
      setActiveCrews(prevCrews => 
        prevCrews.map(crew => 
          crew.id === crewId 
            ? { 
                ...crew, 
                status: 'error', 
                currentStep: 'Connection error'
              }
            : crew
        )
      )
    }
  }

  const stopCrew = (crewId: string) => {
    setActiveCrews(activeCrews.map((crew) => (crew.id === crewId ? { ...crew, status: "stopped" } : crew)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">CrewAI Orchestration</h2>
          <p className="text-muted-foreground">Trigger and manage multi-agent workflows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Crew Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="trigger">Trigger Crew</TabsTrigger>
          <TabsTrigger value="active">Active Crews</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="trigger" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Start Templates */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Start Templates
                </CardTitle>
                <CardDescription>Pre-configured crew workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCrewTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <Badge variant="outline">{template.complexity}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {template.agents.length} agents
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.estimatedTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {template.agents.map((agentName, index) => (
                        <div key={agentName} className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {agentName}
                          </Badge>
                          {index < template.agents.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>

                    <Button size="sm" className="w-full" onClick={() => triggerCrew(template.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Crew
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Custom Crew Builder */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Custom Crew Builder
                </CardTitle>
                <CardDescription>Build your own multi-agent workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crew-name">Crew Name</Label>
                  <Input
                    id="crew-name"
                    placeholder="Enter crew name"
                    value={customCrew.name}
                    onChange={(e) => setCustomCrew({ ...customCrew, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crew-goal">Goal</Label>
                  <Textarea
                    id="crew-goal"
                    placeholder="What should this crew accomplish?"
                    value={customCrew.goal}
                    onChange={(e) => setCustomCrew({ ...customCrew, goal: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Agents</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={agent.id}
                          checked={customCrew.selectedAgents.includes(agent.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomCrew({
                                ...customCrew,
                                selectedAgents: [...customCrew.selectedAgents, agent.name],
                              })
                            } else {
                              setCustomCrew({
                                ...customCrew,
                                selectedAgents: customCrew.selectedAgents.filter((name) => name !== agent.name),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={agent.id} className="text-sm">
                          {agent.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sequential"
                    checked={customCrew.sequential}
                    onCheckedChange={(checked) => setCustomCrew({ ...customCrew, sequential: checked })}
                  />
                  <Label htmlFor="sequential">Sequential execution</Label>
                </div>

                <Button
                  className="w-full"
                  disabled={!customCrew.name || customCrew.selectedAgents.length === 0}
                  onClick={() => triggerCrew()}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Custom Crew
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="space-y-4">
            {activeCrews.map((crew) => (
              <Card key={crew.id} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(crew.status)}
                        {crew.name}
                      </CardTitle>
                      <CardDescription>Current step: {crew.currentStep}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={crew.status === "running" ? "default" : "secondary"}>{crew.status}</Badge>
                      {crew.status === "running" && (
                        <Button size="sm" variant="destructive" onClick={() => stopCrew(crew.id)}>
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {crew.status === "running" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{crew.progress}%</span>
                      </div>
                      <Progress value={crew.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Agents:</span>
                    {crew.agents.map((agentName, index) => (
                      <div key={agentName} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {agentName}
                        </Badge>
                        {index < crew.agents.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Started:</span>
                      <br />
                      {crew.startTime ? new Date(crew.startTime).toLocaleTimeString() : "Not started"}
                    </div>
                    <div>
                      <span className="font-medium">ETA:</span>
                      <br />
                      {new Date(crew.estimatedCompletion).toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCrewTemplates.map((template) => (
              <Card key={template.id} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Complexity:</span>
                    <Badge variant="outline">{template.complexity}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span>{template.estimatedTime}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Crew Execution History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Content Marketing Pipeline</h4>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Duration: 42 minutes • Success Rate: 100%</p>
                    <p>Completed: 2024-01-15 09:30</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Data Analysis Workflow</h4>
                    <Badge variant="destructive">Failed</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Duration: 15 minutes • Error: Agent timeout</p>
                    <p>Failed: 2024-01-15 08:45</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
