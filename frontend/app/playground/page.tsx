"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Zap,
  Play,
  Copy,
  Download,
  Settings,
  History,
  Sparkles,
  FileText,
  ImageIcon,
  Mic,
  Tag,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

interface ModelCard {
  id: string;
  name: string;
  type:
    | "text-generation"
    | "text-classification"
    | "image-classification"
    | "speech-recognition";
  description: string;
  author: string;
  downloads: number;
  likes: number;
  hash: string;
}

interface InferenceRequest {
  model_hash: string;
  task: string;
  input_text?: string;
  parameters: Record<string, any>;
}

interface InferenceResponse {
  success: boolean;
  result?: any;
  error?: string;
  model_info?: {
    hash: string;
    task: string;
    cached: boolean;
  };
  processing_time?: number;
  request_id: string;
}

const featuredModels: ModelCard[] = [
  {
    id: "african-gpt-7b",
    name: "African GPT-7B",
    type: "text-generation",
    description:
      "Large language model trained on African languages and contexts",
    author: "AfriAI Research",
    downloads: 15420,
    likes: 892,
    hash: "QmYwAPJzv5CZsnA8rdHaSmKRvQnHY7z15KDQzHHEd50Rj",
  },
  {
    id: "swahili-sentiment",
    name: "Swahili Sentiment Analyzer",
    type: "text-classification",
    description: "Sentiment analysis model for Swahili text",
    author: "EastAfrica NLP",
    downloads: 8340,
    likes: 456,
    hash: "QmXwBPJzv5CZsnA8rdHaSmKRvQnHY7z15KDQzHHEd50Tk",
  },
  {
    id: "african-wildlife-classifier",
    name: "African Wildlife Classifier",
    type: "image-classification",
    description: "Identifies African wildlife species from images",
    author: "Conservation AI",
    downloads: 12100,
    likes: 723,
    hash: "QmZwCPJzv5CZsnA8rdHaSmKRvQnHY7z15KDQzHHEd50Um",
  },
  {
    id: "yoruba-speech-recognizer",
    name: "Yoruba Speech Recognizer",
    type: "speech-recognition",
    description: "Speech-to-text model for Yoruba language",
    author: "WestAfrica Speech Lab",
    downloads: 6780,
    likes: 334,
    hash: "QmAwDPJzv5CZsnA8rdHaSmKRvQnHY7z15KDQzHHEd50Vm",
  },
];

const examplePrompts = {
  "text-generation": [
    "Write a short story about life in Lagos, Nigeria",
    "Explain the importance of Ubuntu philosophy in African culture",
    "Describe traditional African music instruments",
  ],
  "text-classification": [
    "Hii ni habari nzuri sana! (This is very good news!)",
    "Nimechoka na hali hii (I'm tired of this situation)",
    "Asante kwa msaada wako (Thank you for your help)",
  ],
};

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState<ModelCard | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [temperature, setTemperature] = useState([0.7]);
  const [maxLength, setMaxLength] = useState([100]);
  const [topP, setTopP] = useState([0.9]);
  const [topK, setTopK] = useState([50]);
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.5]);
  const [returnTimestamps, setReturnTimestamps] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8000");
  const [history, setHistory] = useState<
    Array<{
      input: string;
      output: string;
      timestamp: Date;
      parameters: any;
      processingTime?: number;
      requestId?: string;
    }>
  >([]);

  const handleGenerate = async () => {
    if (!selectedModel || (!input.trim() && !selectedFile)) return;

    setIsGenerating(true);

    try {
      let response: Response;
      let result: InferenceResponse;

      if (
        selectedModel.type === "image-classification" ||
        selectedModel.type === "speech-recognition"
      ) {
        if (!selectedFile) {
          toast.error("Please select a file for this task type");
          return;
        }

        // Handle file upload
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("model_hash", selectedModel.hash);
        formData.append("task", selectedModel.type);

        const parameters =
          selectedModel.type === "image-classification"
            ? { top_k: topK[0], confidence_threshold: confidenceThreshold[0] }
            : { return_timestamps: returnTimestamps };

        formData.append("parameters", JSON.stringify(parameters));

        response = await fetch(`${apiEndpoint}/infer-with-files`, {
          method: "POST",
          body: formData,
        });
      } else {
        // Handle text-based tasks
        const requestBody: InferenceRequest = {
          model_hash: selectedModel.hash,
          task: selectedModel.type,
          input_text: input,
          parameters:
            selectedModel.type === "text-generation"
              ? {
                  temperature: temperature[0],
                  max_length: maxLength[0],
                  top_p: topP[0],
                  top_k: topK[0],
                }
              : {
                  confidence_threshold: confidenceThreshold[0],
                  top_k: topK[0],
                },
        };

        response = await fetch(`${apiEndpoint}/infer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      result = await response.json();

      if (result.success) {
        let formattedOutput = "";

        if (selectedModel.type === "text-generation") {
          formattedOutput =
            result.result?.generated_text ||
            result.result?.text ||
            "No output generated";
        } else if (selectedModel.type === "text-classification") {
          const predictions = result.result?.predictions || [];
          formattedOutput = predictions
            .map(
              (pred: any) => `${pred.label}: ${(pred.score * 100).toFixed(2)}%`
            )
            .join("\n");
        } else if (selectedModel.type === "image-classification") {
          const predictions = result.result?.predictions || [];
          formattedOutput = predictions
            .map(
              (pred: any) => `${pred.label}: ${(pred.score * 100).toFixed(2)}%`
            )
            .join("\n");
        } else if (selectedModel.type === "speech-recognition") {
          formattedOutput =
            result.result?.transcription?.text ||
            result.result?.transcription ||
            "No transcription available";
        }

        setOutput(formattedOutput);

        setHistory((prev) => [
          {
            input: selectedFile ? `File: ${selectedFile.name}` : input,
            output: formattedOutput,
            timestamp: new Date(),
            parameters:
              selectedModel.type === "text-generation"
                ? {
                    temperature: temperature[0],
                    max_length: maxLength[0],
                    top_p: topP[0],
                    top_k: topK[0],
                  }
                : {
                    confidence_threshold: confidenceThreshold[0],
                    top_k: topK[0],
                  },
            processingTime: result.processing_time,
            requestId: result.request_id,
          },
          ...prev.slice(0, 9),
        ]);

        toast.success(
          `Generated successfully in ${result.processing_time?.toFixed(2)}s`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      toast.error(`Generation failed: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });

      setOutput(`Error: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Output copied to clipboard", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setInput(
        `Selected file: ${file.name} (${(file.size / 1024 / 1024).toFixed(
          2
        )} MB)`
      );
      toast.info(`File selected: ${file.name}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/health`);
      if (response.ok) {
        const data = await response.json();
        toast.success(
          `Connection successful! Server is healthy. ${data.cached_models} models cached.`,
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
      } else {
        throw new Error("Server not responding");
      }
    } catch (error) {
      toast.error(
        "Could not connect to inference server. Please check the endpoint.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case "text-generation":
        return <FileText className="h-4 w-4" />;
      case "text-classification":
        return <Tag className="h-4 w-4" />;
      case "image-classification":
        return <ImageIcon className="h-4 w-4" />;
      case "speech-recognition":
        return <Mic className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case "text-generation":
        return "bg-blue-600";
      case "text-classification":
        return "bg-green-600";
      case "image-classification":
        return "bg-purple-600";
      case "speech-recognition":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI Playground</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Test and experiment with AI models interactively. Connect to your
            inference server and see results in real-time.
          </p>
        </div>

        {/* API Configuration */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label className="text-gray-300 text-sm whitespace-nowrap">
                Inference Server:
              </Label>
              <Input
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="http://localhost:8000"
                className="bg-gray-800/50 border-gray-700 text-white"
              />
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent whitespace-nowrap"
                onClick={testConnection}
              >
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Model Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Select Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedModel?.id === model.id
                        ? "border-blue-500 bg-blue-600/20"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70"
                    }`}
                    onClick={() => {
                      setSelectedModel(model);
                      toast.info(`Selected model: ${model.name}`, {
                        position: "top-right",
                        autoClose: 2000,
                      });
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getModelIcon(model.type)}
                        <h3 className="font-medium text-white text-sm">
                          {model.name}
                        </h3>
                      </div>
                      <Badge
                        className={`${getModelTypeColor(
                          model.type
                        )} text-white text-xs`}
                      >
                        {model.type.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {model.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>{model.author}</span>
                      <span>{model.downloads.toLocaleString()} downloads</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      Hash: {model.hash.substring(0, 12)}...
                    </div>
                  </div>
                ))}

                <Separator className="bg-gray-800" />

                <Link href="/models">
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent"
                  >
                    Browse All Models
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Playground Area */}
          <div className="lg:col-span-3">
            {selectedModel ? (
              <div className="space-y-6">
                {/* Model Info */}
                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getModelIcon(selectedModel.type)}
                        <div>
                          <CardTitle className="text-white">
                            {selectedModel.name}
                          </CardTitle>
                          <p className="text-gray-400 text-sm">
                            {selectedModel.description}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-1">
                            Model Hash: {selectedModel.hash}
                          </p>
                        </div>
                      </div>
                      <Link href={`/models/${selectedModel.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Input & Controls */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Input Section */}
                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Input
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedModel.type === "image-classification" ? (
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-400 mb-2">
                                Upload an image to classify
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="image-upload"
                              />
                              <label htmlFor="image-upload">
                                <Button
                                  variant="outline"
                                  className="border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent cursor-pointer"
                                  asChild
                                >
                                  <span>Choose Image File</span>
                                </Button>
                              </label>
                            </div>
                            {selectedFile && (
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>
                                  {selectedFile.name} (
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB)
                                </span>
                              </div>
                            )}
                          </div>
                        ) : selectedModel.type === "speech-recognition" ? (
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                              <Mic className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-400 mb-2">
                                Upload an audio file to transcribe
                              </p>
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="audio-upload"
                              />
                              <label htmlFor="audio-upload">
                                <Button
                                  variant="outline"
                                  className="border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent cursor-pointer"
                                  asChild
                                >
                                  <span>Choose Audio File</span>
                                </Button>
                              </label>
                            </div>
                            {selectedFile && (
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>
                                  {selectedFile.name} (
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB)
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Textarea
                            placeholder={`Enter your ${
                              selectedModel.type === "text-generation"
                                ? "prompt"
                                : "text to classify"
                            } here...`}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="min-h-[120px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 resize-none"
                          />
                        )}

                        {/* Example Prompts */}
                        {examplePrompts[
                          selectedModel.type as keyof typeof examplePrompts
                        ] &&
                          !selectedFile && (
                            <div>
                              <Label className="text-gray-300 text-sm">
                                Example prompts:
                              </Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {examplePrompts[
                                  selectedModel.type as keyof typeof examplePrompts
                                ].map((prompt, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent"
                                    onClick={() => setInput(prompt)}
                                  >
                                    {prompt.length > 30
                                      ? `${prompt.substring(0, 30)}...`
                                      : prompt}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                        <Button
                          onClick={handleGenerate}
                          disabled={
                            (!input.trim() && !selectedFile) || isGenerating
                          }
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Generate
                            </>
                          )}
                        </Button>
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
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-gray-300 hover:bg-gray-800/50 bg-transparent"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {output ? (
                          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                            <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                              {output}
                            </pre>
                          </div>
                        ) : (
                          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                            <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400">
                              Output will appear here after generation
                            </p>
                          </div>
                        )}
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
                        {selectedModel.type === "text-generation" && (
                          <>
                            <div>
                              <Label className="text-gray-300 text-sm">
                                Temperature: {temperature[0]}
                              </Label>
                              <Slider
                                value={temperature}
                                onValueChange={setTemperature}
                                max={2}
                                min={0}
                                step={0.1}
                                className="mt-2"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Controls randomness
                              </p>
                            </div>

                            <div>
                              <Label className="text-gray-300 text-sm">
                                Max Length: {maxLength[0]}
                              </Label>
                              <Slider
                                value={maxLength}
                                onValueChange={setMaxLength}
                                max={500}
                                min={10}
                                step={10}
                                className="mt-2"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Maximum output length
                              </p>
                            </div>

                            <div>
                              <Label className="text-gray-300 text-sm">
                                Top P: {topP[0]}
                              </Label>
                              <Slider
                                value={topP}
                                onValueChange={setTopP}
                                max={1}
                                min={0}
                                step={0.05}
                                className="mt-2"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Nucleus sampling
                              </p>
                            </div>

                            <div>
                              <Label className="text-gray-300 text-sm">
                                Top K: {topK[0]}
                              </Label>
                              <Slider
                                value={topK}
                                onValueChange={setTopK}
                                max={100}
                                min={1}
                                step={1}
                                className="mt-2"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Limits vocabulary
                              </p>
                            </div>
                          </>
                        )}

                        {selectedModel.type === "text-classification" && (
                          <>
                            <div>
                              <Label className="text-gray-300 text-sm">
                                Confidence Threshold: {confidenceThreshold[0]}
                              </Label>
                              <Slider
                                value={confidenceThreshold}
                                onValueChange={setConfidenceThreshold}
                                max={1}
                                min={0}
                                step={0.05}
                                className="mt-2"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Minimum confidence for classification
                              </p>
                            </div>

                            <div>
                              <Label className="text-gray-300 text-sm">
                                Top K: {topK[0]}
                              </Label>
                              <Slider
                                value={topK}
                                onValueChange={setTopK}
                                max={10}
                                min={1}
                                step={1}
                                className="mt-2"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Number of predictions
                              </p>
                            </div>
                          </>
                        )}

                        {selectedModel.type === "image-classification" && (
                          <>
                            <div>
                              <Label className="text-gray-300 text-sm">
                                Confidence Threshold: {confidenceThreshold[0]}
                              </Label>
                              <Slider
                                value={confidenceThreshold}
                                onValueChange={setConfidenceThreshold}
                                max={1}
                                min={0}
                                step={0.05}
                                className="mt-2"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Minimum confidence for classification
                              </p>
                            </div>

                            <div>
                              <Label className="text-gray-300 text-sm">
                                Top K: {topK[0]}
                              </Label>
                              <Slider
                                value={topK}
                                onValueChange={setTopK}
                                max={10}
                                min={1}
                                step={1}
                                className="mt-2"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Number of predictions
                              </p>
                            </div>
                          </>
                        )}

                        {selectedModel.type === "speech-recognition" && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="timestamps"
                              checked={returnTimestamps}
                              onChange={(e) =>
                                setReturnTimestamps(e.target.checked)
                              }
                              className="rounded border-gray-700"
                            />
                            <Label
                              htmlFor="timestamps"
                              className="text-gray-300 text-sm"
                            >
                              Return Timestamps
                            </Label>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* History */}
                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <History className="h-5 w-5" />
                          History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {history.length > 0 ? (
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {history.map((item, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors"
                                onClick={() => {
                                  if (!item.input.startsWith("File:")) {
                                    setInput(item.input);
                                  }
                                  setOutput(item.output);
                                  toast.info("Loaded from history", {
                                    position: "top-right",
                                    autoClose: 2000,
                                  });
                                }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <p className="text-xs text-gray-400">
                                    {item.timestamp.toLocaleTimeString()}
                                  </p>
                                  {item.processingTime && (
                                    <span className="text-xs text-blue-400">
                                      {item.processingTime.toFixed(2)}s
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-300 truncate">
                                  {item.input.substring(0, 50)}...
                                </p>
                                {item.requestId && (
                                  <p className="text-xs text-gray-500 font-mono mt-1">
                                    ID: {item.requestId.substring(0, 8)}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <History className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">
                              No history yet
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Select a Model to Get Started
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Choose an AI model from the sidebar to start testing and
                    experimenting
                  </p>
                  <Link href="/models">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Browse Models
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
