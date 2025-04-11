"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CodeIcon, PenToolIcon, UsersIcon } from "lucide-react"

const skills = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "HTML/CSS", "Tailwind CSS", "Git"]

export default function About() {
  return (
    <section id="about" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">About Me</h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          I'm a passionate developer with a strong focus on creating elegant, efficient, and user-friendly applications.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: <CodeIcon className="h-10 w-10 text-primary" />,
            title: "Development",
            description: "I enjoy building applications from the ground up, bringing ideas to life in the browser.",
          },
          {
            icon: <PenToolIcon className="h-10 w-10 text-primary" />,
            title: "Design",
            description: "I value simple, clean design patterns and thoughtful interactions.",
          },
          {
            icon: <UsersIcon className="h-10 w-10 text-primary" />,
            title: "Collaboration",
            description: "I thrive in collaborative environments and enjoy working with cross-functional teams.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="border-none bg-card/50 hover:bg-card/80 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl font-bold mb-6 text-center">My Skills</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-card/50 px-4 py-2 rounded-full text-sm"
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
