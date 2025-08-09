"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  Zap,
  Play,
  Copy,
  Download,
  Settings,
  History,
  Sparkles,
  ArrowLeft,
  Share,
  Heart,
  Eye,
  GitFork,
} from "lucide-react"
import Link from "next/link"
import { DeHugAPI } from "@/lib/api"

interface ModelDetails {
  id: string
  name: string
  type: string
  description: string
  author: string
  downloads: number
  likes: number
  views: number
  forks: number
  tags: string[]
  modelCard: string
  examples: string[]
}

export default function ModelPlaygroundPage() {
  const params = useParams()
  const modelId = params.id as string

  const [model, setModel] = useState<ModelDetails | null>(null)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [temperature, setTemperature] = useState([0.7])
  const [maxLength, setMaxLength] = useState([100])
  const [topP, setTopP] = useState([0.9])
  const [topK, setTopK] = useState([50])
  const [history, setHistory] = useState<Array<{ input: string; output: string; timestamp: Date; parameters: any }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadModel()
  }, [modelId])

  const loadModel = async () => {
    setIsLoading(true)
    try {
      const modelData = await DeHugAPI.getModel(modelId)
      setModel(modelData)

      // Set example input if available
      if (modelData.examples && modelData.examples.length > 0) {
        setInput(modelData.examples[0])
      }
    } catch (error) {
      console.error("Failed to load model:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!model || !input.trim()) return

    setIsGenerating(true)

    const parameters = {
      temperature: temperature[0],
      max_length: maxLength[0],
      top_p: topP[0],
      top_k: topK[0],
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockOutput = `Generated output from ${model.name}:\n\n${input}\n\nThis is a simulated response. In a real implementation, this would be the actual output from the AI model with the following parameters:\n- Temperature: ${temperature[0]}\n- Max Length: ${maxLength[0]}\n- Top P: ${topP[0]}\n- Top K: ${topK[0]}\n\nThe model would process your input and generate contextually relevant content based on its training.`

      setOutput(mockOutput)
      setHistory((prev) => [
        {
          input,
          output: mockOutput,
          timestamp: new Date(),
          parameters,
        },
        ...prev.slice(0, 9),
      ])
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
  }

  const handleShare = () => {
    const shareData = {
      input,
      output,
      model: model?.name,
      parameters: {
        temperature: temperature[0],
        max_length: maxLength[0],
        top_p: topP[0],
        top_k: topK[0],
      },
    }

    navigator.clipboard.writeText(JSON.stringify(shareData, null, 2))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6 animate-spin text-blue-400" />
              <span className="text-lg text-gray-300">Loading model playground...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Model Not Found</h1>
            <Link href="/models">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Browse Models</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/models/${modelId}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Model
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{model.name} Playground</h1>
              <p className="text-gray-400">Test this model with custom inputs and parameters</p>
            </div>
          </div>
        </div>

        {/* Model Info Card */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <div>
                  <CardTitle className="text-white text-xl">{model.name}</CardTitle>
                  <p className="text-gray-400">{model.description}</p>
                  <p className="text-sm text-gray-500 mt-1">by {model.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{model.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{model.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{model.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span>{model.forks.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-blue-600 text-white">{model.type}</Badge>
              {model.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Playground Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Input Section */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Input
                  </CardTitle>
                  <div className="flex gap-2">
                    {model.examples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800/50 text-xs bg-transparent"
                        onClick={() => setInput(example)}
                      >
                        Example {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your prompt here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[150px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 resize-none"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-400">{input.length} characters</span>
                  <Button
                    onClick={handleGenerate}
                    disabled={!input.trim() || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Output
                  </CardTitle>
                  {output && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent"
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {output ? (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono">{output}</pre>
                  </div>
                ) : (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
                    <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Ready to Generate</h3>
                    <p className="text-gray-400">Enter your input above and click Generate to see the model output</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Model Tips */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Model Tips & Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Input Guidelines:</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Be specific and clear in your prompts</li>
                      <li>• Provide context when needed</li>
                      <li>• Use examples to guide the model</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Parameter Tips:</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Lower temperature for focused outputs</li>
                      <li>• Higher temperature for creative responses</li>
                      <li>• Adjust max length based on desired output</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Parameters & History Sidebar */}
          <div className="space-y-6">
            {/* Parameters */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 text-sm">Temperature: {temperature[0]}</Label>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    max={2}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Controls randomness and creativity</p>
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Max Length: {maxLength[0]}</Label>
                  <Slider
                    value={maxLength}
                    onValueChange={setMaxLength}
                    max={1000}
                    min={10}
                    step={10}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum number of tokens to generate</p>
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Top P: {topP[0]}</Label>
                  <Slider value={topP} onValueChange={setTopP} max={1} min={0} step={0.05} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">Nucleus sampling parameter</p>
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Top K: {topK[0]}</Label>
                  <Slider value={topK} onValueChange={setTopK} max={100} min={1} step={1} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">Limits vocabulary for each step</p>
                </div>

                <Separator className="bg-gray-800" />

                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent"
                  onClick={() => {
                    setTemperature([0.7])
                    setMaxLength([100])
                    setTopP([0.9])
                    setTopK([50])
                  }}
                >
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>

            {/* Generation History */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="h-5 w-5" />
                  History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors"
                        onClick={() => {
                          setInput(item.input)
                          setOutput(item.output)
                          setTemperature([item.parameters.temperature])
                          setMaxLength([item.parameters.max_length])
                          setTopP([item.parameters.top_p])
                          setTopK([item.parameters.top_k])
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-gray-400">{item.timestamp.toLocaleTimeString()}</span>
                          <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                            T: {item.parameters.temperature}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">{item.input.substring(0, 80)}...</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No generations yet</p>
                    <p className="text-gray-500 text-xs mt-1">Your generation history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
