"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, Calendar, User, BarChart3, Shield, Sparkles, Brain, Cpu, Zap } from 'lucide-react'
import Link from "next/link"

// Mock data for ML models
const mockModels = [
  {
    id: "1",
    title: "GPT-2 Small Fine-tuned",
    description: "A fine-tuned GPT-2 model for text generation with improved performance on creative writing tasks.",
    category: "Natural Language Processing",
    task: "Text Generation",
    author: "OpenAI Community",
    uploadDate: "2024-01-15",
    downloads: 12470,
    size: "548 MB",
    format: "PyTorch",
    tags: ["gpt-2", "text-generation", "creative-writing", "fine-tuned"],
    likes: 234,
    verified: true,
    license: "MIT",
    framework: "transformers"
  },
  {
    id: "2",
    title: "ResNet-50 Image Classifier",
    description: "Pre-trained ResNet-50 model for image classification on ImageNet dataset with 76.1% top-1 accuracy.",
    category: "Computer Vision",
    task: "Image Classification",
    author: "Microsoft Research",
    uploadDate: "2024-01-12",
    downloads: 8920,
    size: "102 MB",
    format: "ONNX",
    tags: ["resnet", "image-classification", "imagenet", "computer-vision"],
    likes: 189,
    verified: true,
    license: "Apache 2.0",
    framework: "pytorch"
  },
  {
    id: "3",
    title: "Whisper Base English",
    description: "OpenAI's Whisper model for automatic speech recognition, optimized for English language.",
    category: "Audio",
    task: "Speech Recognition",
    author: "OpenAI",
    uploadDate: "2024-01-10",
    downloads: 15600,
    size: "290 MB",
    format: "PyTorch",
    tags: ["whisper", "speech-recognition", "audio", "english"],
    likes: 456,
    verified: true,
    license: "MIT",
    framework: "transformers"
  },
  {
    id: "4",
    title: "YOLO v8 Object Detection",
    description: "State-of-the-art object detection model with real-time performance and high accuracy.",
    category: "Computer Vision",
    task: "Object Detection",
    author: "Ultralytics",
    uploadDate: "2024-01-08",
    downloads: 6780,
    size: "22 MB",
    format: "PyTorch",
    tags: ["yolo", "object-detection", "real-time", "computer-vision"],
    likes: 312,
    verified: false,
    license: "GPL-3.0",
    framework: "ultralytics"
  },
  {
    id: "5",
    title: "BERT Base Multilingual",
    description: "BERT model pre-trained on 104 languages for multilingual natural language understanding tasks.",
    category: "Natural Language Processing",
    task: "Text Classification",
    author: "Google Research",
    uploadDate: "2024-01-05",
    downloads: 9340,
    size: "714 MB",
    format: "TensorFlow",
    tags: ["bert", "multilingual", "classification", "nlp"],
    likes: 278,
    verified: true,
    license: "Apache 2.0",
    framework: "transformers"
  },
  {
    id: "6",
    title: "Stable Diffusion v2.1",
    description: "Text-to-image diffusion model capable of generating high-quality images from text prompts.",
    category: "Computer Vision",
    task: "Text-to-Image",
    author: "Stability AI",
    uploadDate: "2024-01-03",
    downloads: 23100,
    size: "5.2 GB",
    format: "PyTorch",
    tags: ["stable-diffusion", "text-to-image", "diffusion", "generative"],
    likes: 892,
    verified: true,
    license: "CreativeML Open RAIL-M",
    framework: "diffusers"
  }
]

const categories = ["All", "Natural Language Processing", "Computer Vision", "Audio", "Multimodal", "Reinforcement Learning"]
const tasks = ["All", "Text Generation", "Image Classification", "Object Detection", "Speech Recognition", "Text-to-Image", "Text Classification"]

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTask, setSelectedTask] = useState("All")
  const [sortBy, setSortBy] = useState("recent")

  const filteredModels = mockModels.filter(model => {
    const matchesSearch = model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || model.category === selectedCategory
    const matchesTask = selectedTask === "All" || model.task === selectedTask
    return matchesSearch && matchesCategory && matchesTask
  })

  const sortedModels = [...filteredModels].sort((a, b) => {
    switch (sortBy) {
      case "downloads":
        return b.downloads - a.downloads
      case "likes":
        return b.likes - a.likes
      case "recent":
      default:
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20" />
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge 
            variant="secondary" 
            className="mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300 px-4 py-2 backdrop-blur-sm"
          >
            <Brain className="w-4 h-4 mr-2" />
            Decentralized Models
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
              Model
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
              Hub
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover and download machine learning models stored permanently on IPFS. From language models to computer vision, find the perfect model for your project.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search models, tasks, or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500/50 backdrop-blur-sm h-12"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[200px] bg-white/5 border-white/10 text-white backdrop-blur-sm h-12">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10 text-white">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="focus:bg-white/10">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger className="w-full lg:w-[200px] bg-white/5 border-white/10 text-white backdrop-blur-sm h-12">
                <SelectValue placeholder="Task" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10 text-white">
                {tasks.map(task => (
                  <SelectItem key={task} value={task} className="focus:bg-white/10">
                    {task}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px] bg-white/5 border-white/10 text-white backdrop-blur-sm h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10 text-white">
                <SelectItem value="recent" className="focus:bg-white/10">Most Recent</SelectItem>
                <SelectItem value="downloads" className="focus:bg-white/10">Most Downloaded</SelectItem>
                <SelectItem value="likes" className="focus:bg-white/10">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-400">
            Showing <span className="text-blue-400 font-semibold">{sortedModels.length}</span> of <span className="text-blue-400 font-semibold">{mockModels.length}</span> models
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedModels.map((model, index) => (
            <Card 
              key={model.id} 
              className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 cursor-pointer"
              style={{ 
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300 text-xs"
                    >
                      {model.task}
                    </Badge>
                    {model.verified && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Zap className="h-3 w-3 mr-1" />
                    {model.likes}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight text-white group-hover:text-blue-300 transition-colors">
                  {model.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400 line-clamp-3">
                  {model.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {model.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                    {model.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-300">
                        +{model.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {model.author.length > 15 ? `${model.author.substring(0, 15)}...` : model.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(model.uploadDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      {model.downloads.toLocaleString()}
                    </div>
                    <div>
                      {model.size} • {model.format}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/models/${model.id}`} className="flex-1">
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Model
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
                    >
                      <Cpu className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {sortedModels.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No models found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search criteria or browse all categories.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setSelectedTask("All")
              }}
              className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30 px-8 py-3"
            >
              Load More Models
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
