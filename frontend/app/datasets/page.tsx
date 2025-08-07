"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, Calendar, User, BarChart3, Shield, Sparkles } from 'lucide-react'
import Link from "next/link"

// Mock data for datasets
const mockDatasets = [
  {
    id: "1",
    title: "Kenya Agricultural Production 2020-2023",
    description: "Comprehensive data on crop yields, rainfall patterns, and farming practices across Kenya's agricultural regions.",
    category: "Agriculture",
    author: "Kenya Ministry of Agriculture",
    uploadDate: "2024-01-15",
    downloads: 1247,
    size: "2.3 MB",
    format: "CSV",
    tags: ["agriculture", "kenya", "crops", "rainfall"],
    insights: 23,
    verified: true
  },
  {
    id: "2",
    title: "West Africa Malaria Surveillance Data",
    description: "Disease surveillance data covering malaria cases, prevention measures, and treatment outcomes across 8 West African countries.",
    category: "Health",
    author: "WHO Africa Regional Office",
    uploadDate: "2024-01-10",
    downloads: 892,
    size: "5.7 MB",
    format: "JSON",
    tags: ["health", "malaria", "west-africa", "surveillance"],
    insights: 15,
    verified: true
  },
  {
    id: "3",
    title: "South African Education Statistics 2023",
    description: "Student enrollment, performance metrics, and resource allocation data from South African schools.",
    category: "Education",
    author: "SA Department of Education",
    uploadDate: "2024-01-08",
    downloads: 634,
    size: "1.8 MB",
    format: "CSV",
    tags: ["education", "south-africa", "schools", "enrollment"],
    insights: 31,
    verified: false
  },
  {
    id: "4",
    title: "East Africa Climate Change Indicators",
    description: "Temperature, precipitation, and extreme weather event data across East African countries from 2010-2023.",
    category: "Climate",
    author: "East African Climate Observatory",
    uploadDate: "2024-01-05",
    downloads: 1156,
    size: "8.2 MB",
    format: "CSV",
    tags: ["climate", "east-africa", "temperature", "precipitation"],
    insights: 42,
    verified: true
  },
  {
    id: "5",
    title: "Nigeria Population Demographics 2023",
    description: "Detailed demographic data including age distribution, urbanization trends, and migration patterns.",
    category: "Demographics",
    author: "Nigerian Bureau of Statistics",
    uploadDate: "2024-01-03",
    downloads: 2103,
    size: "3.4 MB",
    format: "JSON",
    tags: ["demographics", "nigeria", "population", "urbanization"],
    insights: 18,
    verified: true
  },
  {
    id: "6",
    title: "Ghana Economic Indicators 2020-2023",
    description: "GDP growth, inflation rates, employment statistics, and trade data for Ghana's economic analysis.",
    category: "Economics",
    author: "Bank of Ghana",
    uploadDate: "2023-12-28",
    downloads: 756,
    size: "1.2 MB",
    format: "CSV",
    tags: ["economics", "ghana", "gdp", "employment"],
    insights: 27,
    verified: false
  }
]

const categories = ["All", "Agriculture", "Health", "Education", "Climate", "Demographics", "Economics"]

export default function DatasetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recent")

  const filteredDatasets = mockDatasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || dataset.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
    switch (sortBy) {
      case "downloads":
        return b.downloads - a.downloads
      case "insights":
        return b.insights - a.insights
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
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Discovery
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
              Dataset
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Explorer
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover and explore public datasets from across Africa. Generate insights, download data, and contribute to the community.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search datasets, tags, or descriptions..."
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px] bg-white/5 border-white/10 text-white backdrop-blur-sm h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10 text-white">
                <SelectItem value="recent" className="focus:bg-white/10">Most Recent</SelectItem>
                <SelectItem value="downloads" className="focus:bg-white/10">Most Downloaded</SelectItem>
                <SelectItem value="insights" className="focus:bg-white/10">Most Insights</SelectItem>
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
            Showing <span className="text-blue-400 font-semibold">{sortedDatasets.length}</span> of <span className="text-blue-400 font-semibold">{mockDatasets.length}</span> datasets
          </p>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedDatasets.map((dataset, index) => (
            <Card 
              key={dataset.id} 
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
                      {dataset.category}
                    </Badge>
                    {dataset.verified && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    {dataset.insights}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight text-white group-hover:text-blue-300 transition-colors">
                  {dataset.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400 line-clamp-3">
                  {dataset.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {dataset.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                    {dataset.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-300">
                        +{dataset.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {dataset.author.length > 20 ? `${dataset.author.substring(0, 20)}...` : dataset.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(dataset.uploadDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      {dataset.downloads.toLocaleString()}
                    </div>
                    <div>
                      {dataset.size} • {dataset.format}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/datasets/${dataset.id}`} className="flex-1">
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Explore
                      </Button>
                    </Link>
                    <Link href={`/insights?dataset=${dataset.id}`}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
                      >
                        <BarChart3 className="h-3 w-3 mr-1" />
                        AI
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {sortedDatasets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No datasets found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search criteria or browse all categories.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
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
              Load More Datasets
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
