"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CoachResumeOutput } from "@/ai/flows/coach-resume"
import { Separator } from "./ui/separator"
import { Lightbulb, MessageSquareQuote } from "lucide-react"

interface ResumeCoachDisplayProps {
  result: CoachResumeOutput
}

export function ResumeCoachDisplay({ result }: ResumeCoachDisplayProps) {
  if (result.length === 0) {
    return (
      <Card className="mt-4 border-primary/50">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Resume Coach Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our AI coach reviewed your resume and it looks great! No immediate suggestions found.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4 border-primary/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Resume Coach Feedback
        </CardTitle>
        <CardDescription>
          Here are some suggestions to make your resume even stronger.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.map((item, index) => (
          <div key={index}>
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <div className="flex items-start gap-3">
                    <MessageSquareQuote className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <blockquote className="italic text-muted-foreground border-l-2 border-muted-foreground/50 pl-3">
                        "{item.original_text}"
                    </blockquote>
                </div>
                <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-primary">Suggestion:</p>
                        <p className="text-sm">{item.suggestion}</p>
                    </div>
                </div>
            </div>
            {index < result.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
