"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { MessageSquare, Brain, UserCircle, ImageIcon, Zap, Shield, type LucideIcon } from "lucide-react"

type FeatureCardProps = {
  title: string
  description: string
  icon: string
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const icons: Record<string, LucideIcon> = {
    MessageSquare,
    Brain,
    UserCircle,
    ImageIcon,
    Zap,
    Shield,
  }

  const Icon = icons[icon] || MessageSquare

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="bg-gray-900/70 backdrop-blur-sm border border-green-500/30 overflow-hidden group hover:border-green-500/50 transition-all duration-300 h-full">
        <CardContent className="p-6">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors duration-300">
            <Icon className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
