import Link from "next/link"
import { Brain, Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">DeHug</span>
            </div>
            <p className="text-gray-400 text-sm">
              The decentralized Hugging Face. Host, share, and access ML models on IPFS/Filecoin.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/models" className="hover:text-white transition-colors">Browse Models</Link></li>
              <li><Link href="/datasets" className="hover:text-white transition-colors">Datasets</Link></li>
              <li><Link href="/upload" className="hover:text-white transition-colors">Upload</Link></li>
              <li><Link href="/inference" className="hover:text-white transition-colors">Inference</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/tutorials" className="hover:text-white transition-colors">Tutorials</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Community</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/community" className="hover:text-white transition-colors">Discord</Link></li>
              <li><Link href="/forum" className="hover:text-white transition-colors">Forum</Link></li>
              <li><Link href="/contribute" className="hover:text-white transition-colors">Contribute</Link></li>
              <li><Link href="/governance" className="hover:text-white transition-colors">Governance</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 DeHug. Decentralizing AI for everyone. Built on IPFS & Filecoin.</p>
        </div>
      </div>
    </footer>
  )
}
