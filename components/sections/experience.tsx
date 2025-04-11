"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BriefcaseIcon, CalendarIcon, MapPinIcon } from "lucide-react"

const experiences = [
  {
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    location: "San Francisco, CA",
    period: "2021 - Present",
    description:
      "Led the development of responsive web applications using React and Next.js. Implemented state management solutions and optimized performance.",
  },
  {
    title: "Web Developer",
    company: "Digital Creations",
    location: "Los Angeles, CA",
    period: "2018 - 2021",
    description:
      "Developed and maintained client websites. Collaborated with designers to implement responsive layouts and interactive features.",
  },
  {
    title: "Junior Developer",
    company: "StartUp Innovations",
    location: "Seattle, WA",
    period: "2016 - 2018",
    description:
      "Assisted in the development of web applications. Gained experience in frontend technologies and agile development methodologies.",
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Experience</h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          My professional journey and the companies I've had the pleasure to work with.
        </p>
      </motion.div>

      <div className="space-y-8 max-w-3xl mx-auto">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="border-none bg-card/50 hover:bg-card/80 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-primary" />
                  {exp.title} at {exp.company}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {exp.period}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    {exp.location}
                  </div>
                </div>
                <p>{exp.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
