"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Database, Brain, Users, BarChart3, Upload, Search, MessageSquare, Sparkles, Zap, TrendingUp, Play, ChevronDown } from 'lucide-react'
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
      description: "Upload datasets to IPFS/Filecoin for permanent, censorship-resistant access",
      color: "from-green-400 to-emerald-600",
      delay: "0ms"
    },
    {
      icon: Search,
      title: "Dataset Explorer",
      description: "Interactive data exploration with filtering, sorting, and visualization tools",
      color: "from-blue-400 to-cyan-600",
      delay: "100ms"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Generate actionable insights with pre-built models and conversational AI",
      color: "from-purple-400 to-violet-600",
      delay: "200ms"
    },
    {
      icon: MessageSquare,
      title: "Ask AI",
      description: "Natural language queries to extract insights from your data",
      color: "from-orange-400 to-red-500",
      delay: "300ms"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Collaborate with researchers, NGOs, and developers across Africa",
      color: "from-pink-400 to-rose-600",
      delay: "400ms"
    }
  ]

  const stats = [
    { value: "50K+", label: "Datasets", icon: Database },
    { value: "12M+", label: "Data Points", icon: BarChart3 },
    { value: "2.5K+", label: "Researchers", icon: Users },
  ]

  const useCases = [
    {
      title: "Agriculture",
      description: "Predict crop yields, optimize farming practices, and forecast weather patterns",
      icon: "🌾",
      gradient: "from-green-500/20 to-emerald-500/20",
      tags: ["Crop Prediction", "Weather Analysis", "Soil Health"]
    },
    {
      title: "Public Health",
      description: "Track disease outbreaks, analyze health trends, and support policy decisions",
      icon: "🏥",
      gradient: "from-red-500/20 to-pink-500/20",
      tags: ["Disease Tracking", "Health Analytics", "Policy Support"]
    },
    {
      title: "Education",
      description: "Analyze enrollment patterns, identify learning gaps, optimize resources",
      icon: "📚",
      gradient: "from-blue-500/20 to-cyan-500/20",
      tags: ["Enrollment Analysis", "Performance Metrics", "Resource Planning"]
    },
    {
      title: "Climate",
      description: "Monitor environmental changes, predict impacts, support sustainability",
      icon: "🌡️",
      gradient: "from-teal-500/20 to-green-500/20",
      tags: ["Climate Monitoring", "Impact Assessment", "Sustainability"]
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
                Powered by Web3 & AI
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                <span className="bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
                  AfriData
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  Insights
                </span>
              </h1>
              
              <p className="mt-6 text-xl leading-8 text-gray-300 max-w-4xl mx-auto">
                Empowering African communities with{" "}
                <span className="text-blue-400 font-semibold">AI-driven insights</span> from 
                decentralized public data. Upload, explore, and interact with datasets while 
                generating actionable intelligence for agriculture, health, education, and climate.
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/upload">
                  <Button 
                    size="lg" 
                    className="group bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Start Exploring Data
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
                Democratizing Data for
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Africa
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Bridge the gap between raw data and real-world impact with our comprehensive AI-powered platform
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

      {/* Use Cases Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Real-World
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Applications
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how AfriData Insights is making a difference across key sectors in Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={useCase.title}
                className="group cursor-pointer"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
                }}
              >
                <div className={`bg-gradient-to-br ${useCase.gradient} backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105`}>
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{useCase.icon}</div>
                    <h3 className="text-2xl font-bold text-white">{useCase.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {useCase.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {useCase.tags.map(tag => (
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

      {/* AI Showcase Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Powered by
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Advanced AI
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* AI Demo Interface */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">
                    Ask AI Anything About Your Data
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Our advanced AI models can analyze complex datasets and provide 
                    insights in natural language, making data science accessible to everyone.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-green-400">
                      <Zap className="h-5 w-5 mr-3" />
                      <span>Real-time analysis</span>
                    </div>
                    <div className="flex items-center text-blue-400">
                      <TrendingUp className="h-5 w-5 mr-3" />
                      <span>Predictive modeling</span>
                    </div>
                    <div className="flex items-center text-purple-400">
                      <Brain className="h-5 w-5 mr-3" />
                      <span>Natural language queries</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  {/* Mock AI Interface */}
                  <div className="bg-black/30 rounded-2xl border border-white/20 p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-500/20 rounded-lg p-3 ml-8">
                        <p className="text-blue-300 text-sm">
                          "Which region in Kenya had the highest crop yield in 2023?"
                        </p>
                      </div>
                      
                      <div className="bg-green-500/20 rounded-lg p-3 mr-8">
                        <p className="text-green-300 text-sm">
                          Based on the agricultural dataset, Western Kenya had the highest 
                          maize yield at 3,100 tons in 2023, with optimal rainfall of 1,450mm 
                          and soil pH of 6.8.
                        </p>
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-xs">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                        AI is typing...
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
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Data into Impact?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join the growing community of researchers, NGOs, and developers using 
              AfriData Insights to drive positive change across Africa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/upload">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Upload Your First Dataset
                  <Upload className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/datasets">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group border-gray-600 text-gray-300 hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  Explore Existing Data
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
