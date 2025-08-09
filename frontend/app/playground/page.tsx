"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Play,
  Loader2,
  Settings,
  Brain,
  ImageIcon,
  Mic,
  FileText,
  Zap,
  Copy,
  CheckCircle,
  RefreshCw,
  Upload,
} from "lucide-react"
import Link from "next/link"

// Mock models data
const mockModels = [
  {
    id: "1",
    name: "GPT-2 Small Fine-tuned",
    author: "openai-community",
    task: "text-generation",
    category: "Natural Language Processing",
    description: "A fine-tuned GPT-2 model for creative writing",
    parameters: {
      max_length: { min: 10, max: 500, default: 100 },
      temperature: { min: 0.1, max: 2.0, default: 0.8 },
      top_p: { min: 0.1, max: 1.0, default: 0.9 },
      top_k: { min: 1, max: 100, default: 50 },
    },
  },
  {
    id: "2",
    name: "BERT Base Multilingual",
    author: "google",
    task: "text-classification",
    category: "Natural Language Processing",
    description: "BERT model for multilingual text classification",
    parameters: {
      max_length: { min: 10, max: 512, default: 128 },
    },
  },
  {
    id: "3",
    name: "ResNet-50 Image Classifier",
    author: "microsoft",
    task: "image-classification",
    category: "Computer Vision",
    description: "Pre-trained ResNet-50 for ImageNet classification",
    parameters: {
      confidence_threshold: { min: 0.1, max: 1.0, default: 0.5 },
    },
  },
  {
    id: "4",
    name: "Whisper Base English",
    author: "openai",
    task: "speech-recognition",
    category: "Audio",
    description: "OpenAI's Whisper model for English speech recognition",
    parameters: {
      language: { options: ["auto", "en", "es", "fr", "de"], default: "auto" },
    },
  },
]

const taskExamples = {
  "text-generation": [
    "Once upon a time in a distant galaxy",
    "The future of artificial intelligence is",
    "In the heart of Africa, there lived",
    "Climate change is affecting our planet by",
  ],
  "text-classification": [
    "I love this new restaurant! The food was amazing.",
    "This movie was terrible, I want my money back.",
    "The weather today is perfect for a picnic.",
    "I'm feeling anxious about the upcoming exam.",
  ],
  "image-classification": [
    "Upload an image to classify objects",
    "Drag and drop your image here",
    "Supported formats: JPG, PNG, GIF",
  ],
  "speech-recognition": [
    "Upload an audio file to transcribe",
    "Supported formats: MP3, WAV, M4A",
    "Maximum duration: 30 seconds",
  ],
}

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [parameters, setParameters] = useState<any>({})
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [copiedOutput, setCopiedOutput] = useState(false)

  useEffect(() => {
    if (selectedModel) {
      // Initialize parameters with default values
      const defaultParams: any = {}
      Object.entries(selectedModel.parameters).forEach(([key, param]: [string, any]) => {
        if (param.default !== undefined) {
          defaultParams[key] = param.default
        }
      })
      setParameters(defaultParams)
      setInput("")
      setOutput("")
      setUploadedFile(null)
    }
  }, [selectedModel])

  const handleModelSelect = (modelId: string) => {
    const model = mockModels.find((m) => m.id === modelId)
    setSelectedModel(model)
  }

  const handleParameterChange = (key: string, value: any) => {
    setParameters((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleRun = async () => {
    if (!selectedModel || (!input && !uploadedFile)) return

    setIsLoading(true)
    setOutput("")

    // Simulate API call
    setTimeout(
      () => {
        let mockOutput = ""

        switch (selectedModel.task) {
          case "text-generation":
            mockOutput =
              input +
              " and the adventure began with unexpected twists and turns. The characters discovered hidden secrets that would change their lives forever. Through challenges and triumphs, they learned the true meaning of courage and friendship."
            break
          case "text-classification":
            const sentiments = ["Positive", "Negative", "Neutral"]
            const confidence = Math.random() * 0.4 + 0.6 // 0.6-1.0
            mockOutput = JSON.stringify(
              {
                label: sentiments[Math.floor(Math.random() * sentiments.length)],
                confidence: confidence.toFixed(3),
                scores: {
                  Positive: (Math.random() * 0.5 + 0.3).toFixed(3),
                  Negative: (Math.random() * 0.3).toFixed(3),
                  Neutral: (Math.random() * 0.4 + 0.1).toFixed(3),
                },
              },
              null,
              2,
            )
            break
          case "image-classification":
            mockOutput = JSON.stringify(
              {
                predictions: [
                  { label: "Golden Retriever", confidence: 0.892 },
                  { label: "Labrador", confidence: 0.076 },
                  { label: "Dog", confidence: 0.032 },
                ],
              },
              null,
              2,
            )
            break
          case "speech-recognition":
            mockOutput = JSON.stringify(
              {
                text: "Hello, this is a sample transcription of the uploaded audio file. The speech recognition model has processed your audio and converted it to text.",
                confidence: 0.94,
                language: "en",
              },
              null,
              2,
            )
            break
          default:
            mockOutput = "Model output will appear here..."
        }

        setOutput(mockOutput)
        setIsLoading(false)
      },
      2000 + Math.random() * 2000,
    ) // 2-4 seconds
  }

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopiedOutput(true)
    setTimeout(() => setCopiedOutput(false), 2000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setInput(`Uploaded file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
    }
  }

  const getTaskIcon = (task: string) => {
    switch (task) {
      case "text-generation":
      case "text-classification":
        return <FileText className="h-4 w-4" />
      case "image-classification":
        return <ImageIcon className="h-4 w-4" />
      case "speech-recognition":
        return <Mic className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const renderInputSection = () => {
    if (!selectedModel) return null

    const task = selectedModel.task as keyof typeof taskExamples
    const examples = taskExamples[task] || []

    if (task === "image-classification") {
      return (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-2">Click to upload an image</p>
              <p className="text-sm text-slate-500">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
          {uploadedFile && (
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-300">
                <strong>File:</strong> {uploadedFile.name}
              </p>
              <p className="text-sm text-slate-400">
                <strong>Size:</strong> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      )
    }

    if (task === "speech-recognition") {
      return (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors">
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" id="audio-upload" />
            <label htmlFor="audio-upload" className="cursor-pointer">
              <Mic className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-2">Click to upload an audio file</p>
              <p className="text-sm text-slate-500">MP3, WAV, M4A up to 25MB</p>
            </label>
          </div>
          {uploadedFile && (
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-300">
                <strong>File:</strong> {uploadedFile.name}
              </p>
              <p className="text-sm text-slate-400">
                <strong>Size:</strong> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <Textarea
          placeholder={`Enter your ${task === "text-generation" ? "prompt" : "text"} here...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[120px] bg-slate-800/20 border-slate-700 text-white placeholder:text-slate-400 focus:border-slate-500"
        />

        {examples.length > 0 && (
          <div>
            <Label className="text-slate-300 text-sm mb-2 block">Try these examples:</Label>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(example)}
                  className="text-xs bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600"
                >
                  {example.length > 30 ? example.substring(0, 30) + "..." : example}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderParameterControls = () => {
    if (!selectedModel || !selectedModel.parameters) return null

    return (
      <div className="space-y-6">
        {Object.entries(selectedModel.parameters).map(([key, param]: [string, any]) => (
          <div key={key} className="space-y-2">
            <Label className="text-slate-300 capitalize">{key.replace(/_/g, " ")}</Label>

            {param.options ? (
              <Select value={parameters[key]} onValueChange={(value) => handleParameterChange(key, value)}>
                <SelectTrigger className="bg-slate-800/20 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {param.options.map((option: string) => (
                    <SelectItem key={option} value={option} className="focus:bg-slate-800">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : param.min !== undefined && param.max !== undefined ? (
              <div className="space-y-2">
                <Slider
                  value={[parameters[key] || param.default]}
                  onValueChange={(value) => handleParameterChange(key, value[0])}
                  min={param.min}
                  max={param.max}
                  step={key === "temperature" || key === "top_p" || key === "confidence_threshold" ? 0.1 : 1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{param.min}</span>
                  <span className="text-slate-300 font-medium">{parameters[key] || param.default}</span>
                  <span>{param.max}</span>
                </div>
              </div>
            ) : (
              <Input
                value={parameters[key] || ""}
                onChange={(e) => handleParameterChange(key, e.target.value)}
                className="bg-slate-800/20 border-slate-700 text-white placeholder:text-slate-400 focus:border-slate-500"
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge
            variant="outline"
            className="mb-6 border-slate-600 text-slate-300 px-4 py-2 backdrop-blur-sm bg-slate-900/50"
          >
            <Zap className="w-4 h-4 mr-2" />
            AI Model Playground
          </Badge>
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-none">
            <span className="text-white">Test & Explore</span>
            <br />
            <span className="text-slate-400 font-thin">AI Models</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Try out AI models directly in your browser. Test different parameters, upload your own data, and see results
            in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Model Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">Select Model</CardTitle>
                <CardDescription className="text-slate-400 font-light">Choose an AI model to test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedModel?.id === model.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-800/20 hover:border-slate-600 hover:bg-slate-800/30"
                    }`}
                    onClick={() => handleModelSelect(model.id)}
                  >
                    <div className="flex items-center mb-2">
                      {getTaskIcon(model.task)}
                      <span className="ml-2 font-medium text-white text-sm">{model.name}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{model.author}</p>
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-300 bg-slate-800/30">
                      {model.category}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Playground Area */}
          <div className="lg:col-span-3">
            {!selectedModel ? (
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-light text-white mb-2">Select a Model to Begin</h3>
                  <p className="text-slate-400 font-light">Choose an AI model from the sidebar to start testing</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Model Info */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white font-light text-2xl flex items-center">
                          {getTaskIcon(selectedModel.task)}
                          <span className="ml-3">{selectedModel.name}</span>
                        </CardTitle>
                        <CardDescription className="text-slate-400 font-light mt-2">
                          by {selectedModel.author} • {selectedModel.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/models/${selectedModel.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Tabs defaultValue="test" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-900/30 border border-slate-800">
                    <TabsTrigger
                      value="test"
                      className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
                    >
                      Test Model
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
                    >
                      Parameters
                    </TabsTrigger>
                  </TabsList>

                  {/* Test Tab */}
                  <TabsContent value="test" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Input Section */}
                      <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                        <CardHeader>
                          <CardTitle className="text-white font-light text-lg">Input</CardTitle>
                          <CardDescription className="text-slate-400 font-light">
                            {selectedModel.task === "text-generation"
                              ? "Enter a prompt to generate text"
                              : selectedModel.task === "text-classification"
                                ? "Enter text to classify"
                                : selectedModel.task === "image-classification"
                                  ? "Upload an image to classify"
                                  : "Upload an audio file to transcribe"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {renderInputSection()}

                          <div className="mt-6 flex gap-3">
                            <Button
                              onClick={handleRun}
                              disabled={isLoading || (!input && !uploadedFile)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Running...
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Run Model
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setInput("")
                                setOutput("")
                                setUploadedFile(null)
                              }}
                              className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Output Section */}
                      <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-white font-light text-lg">Output</CardTitle>
                              <CardDescription className="text-slate-400 font-light">
                                Model results will appear here
                              </CardDescription>
                            </div>
                            {output && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyOutput}
                                className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
                              >
                                {copiedOutput ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                              <div className="text-center">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
                                <p className="text-slate-300 font-light">Processing your request...</p>
                                <p className="text-sm text-slate-500 mt-2">This may take a few seconds</p>
                              </div>
                            </div>
                          ) : output ? (
                            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-lg">
                              <pre className="text-slate-300 text-sm leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
                                {output}
                              </pre>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-40 border-2 border-dashed border-slate-700 rounded-lg">
                              <div className="text-center">
                                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-400 font-light">Output will appear here</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Parameters Tab */}
                  <TabsContent value="settings" className="space-y-6">
                    <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                      <CardHeader>
                        <CardTitle className="text-white font-light text-lg flex items-center">
                          <Settings className="h-5 w-5 mr-3" />
                          Model Parameters
                        </CardTitle>
                        <CardDescription className="text-slate-400 font-light">
                          Adjust these parameters to control the model's behavior
                        </CardDescription>
                      </CardHeader>
                      <CardContent>{renderParameterControls()}</CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-16">
          <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
            <CardHeader>
              <CardTitle className="text-white font-light text-xl">How to Use the Playground</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-slate-400" />
                  </div>
                  <h4 className="font-light text-white mb-2">1. Select Model</h4>
                  <p className="text-sm text-slate-400 font-light">Choose from available AI models in the sidebar</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                    <Settings className="h-6 w-6 text-slate-400" />
                  </div>
                  <h4 className="font-light text-white mb-2">2. Configure</h4>
                  <p className="text-sm text-slate-400 font-light">Adjust parameters and provide input data</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                    <Play className="h-6 w-6 text-slate-400" />
                  </div>
                  <h4 className="font-light text-white mb-2">3. Run & Test</h4>
                  <p className="text-sm text-slate-400 font-light">Execute the model and view results instantly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
