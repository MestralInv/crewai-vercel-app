"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Settings,
  Play,
  Square,
  RefreshCw,
  Database,
  Globe,
  FileText,
  Code,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const mockMCPServers = [
  {
    id: "1",
    name: "Database Tools",
    type: "database",
    url: "mcp://localhost:3001",
    status: "running",
    description: "PostgreSQL and MongoDB query tools",
    tools: ["query_db", "create_table", "insert_data", "analyze_schema"],
    lastPing: "2024-01-15 12:30:45",
    version: "1.2.0",
  },
  {
    id: "2",
    name: "Web Scraper",
    type: "web",
    url: "mcp://localhost:3002",
    status: "stopped",
    description: "Web scraping and content extraction tools",
    tools: ["scrape_url", "extract_text", "get_links", "screenshot"],
    lastPing: "2024-01-15 11:45:22",
    version: "2.1.1",
  },
  {
    id: "3",
    name: "File System",
    type: "filesystem",
    url: "mcp://localhost:3003",
    status: "running",
    description: "File operations and document processing",
    tools: ["read_file", "write_file", "list_directory", "convert_pdf"],
    lastPing: "2024-01-15 12:31:12",
    version: "1.0.5",
  },
  {
    id: "4",
    name: "Code Analysis",
    type: "code",
    url: "mcp://localhost:3004",
    status: "error",
    description: "Code review and analysis tools",
    tools: ["analyze_code", "check_syntax", "find_bugs", "generate_docs"],
    lastPing: "2024-01-15 10:15:33",
    version: "3.0.0",
  },
]

const serverTypeIcons = {
  database: Database,
  web: Globe,
  filesystem: FileText,
  code: Code,
}

export function MCPServerManager() {
  const [servers, setServers] = useState(mockMCPServers)
  const [isAddingServer, setIsAddingServer] = useState(false)
  const [newServer, setNewServer] = useState({
    name: "",
    type: "database",
    url: "",
    description: "",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500"
      case "stopped":
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
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "stopped":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleServerAction = (serverId: string, action: string) => {
    setServers(
      servers.map((server) => {
        if (server.id === serverId) {
          switch (action) {
            case "start":
              return { ...server, status: "running" }
            case "stop":
              return { ...server, status: "stopped" }
            case "restart":
              return { ...server, status: "running" }
            default:
              return server
          }
        }
        return server
      }),
    )
  }

  const addServer = () => {
    const server = {
      id: Date.now().toString(),
      ...newServer,
      status: "stopped",
      tools: [],
      lastPing: new Date().toISOString(),
      version: "1.0.0",
    }
    setServers([...servers, server])
    setNewServer({ name: "", type: "database", url: "", description: "" })
    setIsAddingServer(false)
  }

  const removeServer = (serverId: string) => {
    setServers(servers.filter((server) => server.id !== serverId))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">MCP Server Management</h2>
          <p className="text-muted-foreground">Manage Model Context Protocol servers and tools</p>
        </div>
        <Dialog open={isAddingServer} onOpenChange={setIsAddingServer}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add MCP Server
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New MCP Server</DialogTitle>
              <DialogDescription>Configure a new Model Context Protocol server</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-name">Server Name</Label>
                <Input
                  id="server-name"
                  placeholder="Enter server name"
                  value={newServer.name}
                  onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="server-type">Server Type</Label>
                <Select value={newServer.type} onValueChange={(value) => setNewServer({ ...newServer, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="filesystem">File System</SelectItem>
                    <SelectItem value="code">Code Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="server-url">Server URL</Label>
                <Input
                  id="server-url"
                  placeholder="mcp://localhost:3000"
                  value={newServer.url}
                  onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="server-description">Description</Label>
                <Textarea
                  id="server-description"
                  placeholder="Describe what this server does"
                  value={newServer.description}
                  onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
                />
              </div>
              <Button onClick={addServer} className="w-full">
                Add Server
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="servers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="tools">Available Tools</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servers.map((server) => {
              const IconComponent = serverTypeIcons[server.type as keyof typeof serverTypeIcons]
              return (
                <Card key={server.id} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{server.name}</CardTitle>
                          <CardDescription>{server.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(server.status)}
                        <Badge variant={server.status === "running" ? "default" : "secondary"}>{server.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">URL:</span>
                        <p className="font-mono text-xs">{server.url}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Version:</span>
                        <p>{server.version}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tools:</span>
                        <p>{server.tools.length} available</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Ping:</span>
                        <p>{new Date(server.lastPing).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {server.status === "running" ? (
                        <Button size="sm" variant="secondary" onClick={() => handleServerAction(server.id, "stop")}>
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleServerAction(server.id, "start")}>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleServerAction(server.id, "restart")}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Restart
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Config
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => removeServer(server.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers
              .filter((s) => s.status === "running")
              .map((server) => (
                <Card key={server.id} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {React.createElement(serverTypeIcons[server.type as keyof typeof serverTypeIcons], {
                        className: "h-5 w-5",
                      })}
                      {server.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {server.tools.map((tool) => (
                        <div key={tool} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="font-mono text-sm">{tool}</span>
                          <Button size="sm" variant="ghost">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Server Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-green-600">[12:30:45] Database Tools: Connected successfully</div>
                  <div className="text-blue-600">[12:30:44] Database Tools: Starting server on port 3001</div>
                  <div className="text-yellow-600">[12:30:43] Web Scraper: Connection timeout, retrying...</div>
                  <div className="text-red-600">[12:30:42] Code Analysis: Error loading plugin</div>
                  <div className="text-green-600">[12:30:41] File System: Tool 'read_file' registered</div>
                  <div className="text-green-600">[12:30:40] File System: Tool 'write_file' registered</div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
