"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center pt-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Hi, I'm <span className="text-primary">Neil Dandekar</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">Software Developer & Designer</p>
          <p className="text-muted-foreground mb-8 max-w-md">
            I build exceptional digital experiences with a focus on performance and user experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href="#projects">View My Work</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20">
            <Image
              src="/placeholder.svg?height=320&width=320"
              alt="Neil Dandekar"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about" aria-label="Scroll down">
          <ArrowDownIcon className="h-6 w-6" />
        </a>
      </div>
    </section>
  )
}
