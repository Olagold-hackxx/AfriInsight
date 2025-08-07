"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Brain, Upload, Search, Users, Sparkles, Cpu } from 'lucide-react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-black/80 backdrop-blur-md border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              DeHug
            </span>
            <Badge variant="secondary" className="hidden sm:inline-flex bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white hover:bg-white/10">
                Explore
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px] bg-black/90 backdrop-blur-md border border-white/10 rounded-lg">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/models"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Models</div>
                        <div className="text-sm text-gray-400">Browse ML models</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/datasets"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Search className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Datasets</div>
                        <div className="text-sm text-gray-400">Discover training data</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/inference"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Cpu className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Inference</div>
                        <div className="text-sm text-gray-400">Run models online</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/upload" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Upload
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/community" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Community
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Docs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden text-gray-300 hover:text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-black/95 backdrop-blur-md border-l border-white/10">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/models"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">Models</span>
                </Link>
                <Link
                  href="/datasets"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Search className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">Datasets</span>
                </Link>
                <Link
                  href="/upload"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">Upload</span>
                </Link>
                <Link
                  href="/community"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">Community</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
