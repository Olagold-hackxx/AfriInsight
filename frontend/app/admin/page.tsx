"use client"

import { StatsDashboard } from "@/components/ui/stats-dashboard"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 py-12">
        <StatsDashboard />
      </div>
    </div>
  )
}
