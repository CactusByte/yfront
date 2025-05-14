import Image from "next/image"
import ChatInterface from "@/components/chat-interface"
import SpaceBackground from "@/components/space-background"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <SpaceBackground />

      <div className="z-10 w-full max-w-4xl px-5 py-12 flex flex-col items-center">
        <div className="relative mb-8">
          {/* Glow effect behind Yongui */}
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl"></div>

          <div className="relative w-40 h-40 md:w-48 md:h-48 animate-float-slow">
            <Image
              src="/images/yongui.png"
              alt="Yongui the alien"
              fill
              className="drop-shadow-[0_0_25px_rgba(74,255,128,0.6)]"
              priority
            />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 text-center">
          Chat with{" "}
          <span className="text-green-400 relative">
            Yongui
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-400/50 rounded-full"></span>
          </span>
        </h1>

        <p className="text-lg text-gray-300 max-w-md text-center mb-10">
          Your friendly alien companion from a galaxy far, far away
        </p>

        <ChatInterface />

        <div className="mt-8 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Yongui AI • Made with 💚 across the universe
        </div>
      </div>
    </main>
  )
}
