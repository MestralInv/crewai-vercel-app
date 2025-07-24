"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Play, Pause, Settings, MoreHorizontal, Activity, CheckCircle } from "lucide-react"

interface Agent {
  id: string
  name: string
  status: string
  type: string
  tasksCompleted: number
  currentTask: string | null
  avatar: string
}

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "busy":
        return "secondary"
      case "idle":
        return "outline"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={agent.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}
              />
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription>{agent.type}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Activity className="h-4 w-4 mr-2" />
                View Logs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={getStatusVariant(agent.status)}>
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            {agent.tasksCompleted} tasks
          </div>
        </div>

        {agent.currentTask && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">Current Task</p>
            <p className="text-sm text-muted-foreground">{agent.currentTask}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant={agent.status === "active" ? "secondary" : "default"} className="flex-1">
            {agent.status === "active" ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
