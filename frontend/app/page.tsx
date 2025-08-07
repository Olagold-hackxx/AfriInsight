"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Globe, Users, BarChart3, Upload, Search, Cpu, Sparkles, Zap, TrendingUp, Play, ChevronDown, Database, Code, FileText } from 'lucide-react'
import Link from "next/link"

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: Upload,
      title: "Decentralized Storage",
      description: "Upload ML models and datasets to IPFS/Filecoin for permanent, censorship-resistant access",
      color: "from-green-400 to-emerald-600",
      delay: "0ms"
    },
    {
      icon: Search,
      title: "Model Discovery",
      description: "Discover models by task, domain, or performance metrics with advanced filtering",
      color: "from-blue-400 to-cyan-600",
      delay: "100ms"
    },
    {
      icon: Cpu,
      title: "Decentralized Inference",
      description: "Run models in-browser or via decentralized compute networks like Bacalhau",
      color: "from-purple-400 to-violet-600",
      delay: "200ms"
    },
    {
      icon: Code,
      title: "Model Cards",
      description: "Immutable metadata, licensing info, and usage examples for every model",
      color: "from-orange-400 to-red-500",
      delay: "300ms"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Reward contributors and curate high-quality models through community governance",
      color: "from-pink-400 to-rose-600",
      delay: "400ms"
    }
  ]

  const stats = [
    { value: "2.5K+", label: "Models", icon: Brain },
    { value: "15K+", label: "Datasets", icon: Database },
    { value: "850+", label: "Contributors", icon: Users },
  ]

  const modelTypes = [
    {
      title: "Natural Language Processing",
      description: "Text classification, generation, translation, and language understanding models",
      icon: "🔤",
      gradient: "from-blue-500/20 to-cyan-500/20",
      tags: ["BERT", "GPT", "T5", "Translation"]
    },
    {
      title: "Computer Vision",
      description: "Image classification, object detection, segmentation, and generative models",
      icon: "👁️",
      gradient: "from-purple-500/20 to-violet-500/20",
      tags: ["ResNet", "YOLO", "Stable Diffusion", "ViT"]
    },
    {
      title: "Audio & Speech",
      description: "Speech recognition, text-to-speech, music generation, and audio analysis",
      icon: "🎵",
      gradient: "from-green-500/20 to-emerald-500/20",
      tags: ["Whisper", "WaveNet", "Tacotron", "AudioCraft"]
    },
    {
      title: "Multimodal",
      description: "Models that work across text, images, audio, and other modalities",
      icon: "🌐",
      gradient: "from-orange-500/20 to-red-500/20",
      tags: ["CLIP", "DALL-E", "GPT-4V", "Flamingo"]
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
          }}
        />
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
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

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div 
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Badge 
                variant="secondary" 
                className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300 px-4 py-2 text-sm font-medium backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by IPFS & Filecoin
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  DeHug
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  Decentralized ML
                </span>
              </h1>
              
              <p className="mt-6 text-xl leading-8 text-gray-300 max-w-4xl mx-auto">
                The decentralized alternative to Hugging Face. Host, share, and access{" "}
                <span className="text-blue-400 font-semibold">machine learning models</span> and{" "}
                <span className="text-purple-400 font-semibold">datasets</span> on a{" "}
                <span className="text-green-400 font-semibold">censorship-resistant</span> platform 
                built on IPFS and Filecoin.
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/upload">
                  <Button 
                    size="lg" 
                    className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Upload Your Model
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group border-gray-600 text-gray-300 hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div 
              className={`mt-20 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="group cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
                      <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Democratizing
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Machine Learning
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Build the future of AI with decentralized infrastructure that puts control back in the hands of the community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group cursor-pointer"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${feature.delay} both`
                }}
              >
                <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 h-full">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="mt-6 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Types Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Every Type of
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                AI Model
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From language models to computer vision, host and discover cutting-edge AI models across all domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modelTypes.map((modelType, index) => (
              <div
                key={modelType.title}
                className="group cursor-pointer"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
                }}
              >
                <div className={`bg-gradient-to-br ${modelType.gradient} backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105`}>
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{modelType.icon}</div>
                    <h3 className="text-2xl font-bold text-white">{modelType.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {modelType.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {modelType.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decentralization Benefits */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Why
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Decentralized?
              </span>
            </h2>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">
                    Own Your AI Models
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    No single point of failure, no corporate gatekeepers. Your models 
                    and datasets are stored permanently on IPFS/Filecoin, accessible 
                    to anyone, anywhere, anytime.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-green-400">
                      <Zap className="h-5 w-5 mr-3" />
                      <span>Censorship resistant</span>
                    </div>
                    <div className="flex items-center text-blue-400">
                      <Globe className="h-5 w-5 mr-3" />
                      <span>Globally accessible</span>
                    </div>
                    <div className="flex items-center text-purple-400">
                      <Users className="h-5 w-5 mr-3" />
                      <span>Community governed</span>
                    </div>
                    <div className="flex items-center text-orange-400">
                      <TrendingUp className="h-5 w-5 mr-3" />
                      <span>Contributor rewards</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-black/30 rounded-2xl border border-white/20 p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg">
                        <span className="text-green-300 text-sm">✓ Model uploaded to IPFS</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Permanent
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-500/20 rounded-lg">
                        <span className="text-blue-300 text-sm">✓ Metadata stored on-chain</span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          Immutable
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-500/20 rounded-lg">
                        <span className="text-purple-300 text-sm">✓ Globally accessible</span>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          24/7
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl border border-white/10 p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Decentralize AI?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join the movement to democratize machine learning. Upload your first model 
              or explore the growing collection of community-contributed AI models.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/upload">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Upload Your Model
                  <Upload className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/models">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group border-gray-600 text-gray-300 hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  Explore Models
                  <Search className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/50" />
        </div>
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
