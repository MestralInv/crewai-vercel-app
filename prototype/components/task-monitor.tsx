"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, CheckCircle, Clock, AlertCircle, Play, Pause, Square, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Task {
  id: string
  title: string
  agent: string
  status: string
  progress: number
  startTime: string | null
  estimatedCompletion: string
}

interface TaskMonitorProps {
  tasks: Task[]
}

export function TaskMonitor({ tasks }: TaskMonitorProps) {
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "running":
        return "default"
      case "completed":
        return "secondary"
      case "queued":
        return "outline"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not started"
    return new Date(timeString).toLocaleTimeString()
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Task Monitor
        </CardTitle>
        <CardDescription>Real-time task execution monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">Assigned to {task.agent}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {task.status === "running" && (
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Started:</span>
                    <br />
                    {formatTime(task.startTime)}
                  </div>
                  <div>
                    <span className="font-medium">ETA:</span>
                    <br />
                    {formatTime(task.estimatedCompletion)}
                  </div>
                </div>

                {task.status === "running" && (
                  <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Activity className="h-3 w-3 animate-pulse" />
                      Task is currently executing...
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
