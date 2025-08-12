"use client"

import * as React from "react"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import type { AtsScoreResumeOutput } from "@/ai/flows/ats-score-resume"
import { Separator } from "./ui/separator"

interface AtsScoreDisplayProps {
  result: AtsScoreResumeOutput
}

export function AtsScoreDisplay({ result }: AtsScoreDisplayProps) {
  const chartData = [{ name: "score", score: result.score, fill: "hsl(var(--primary))" }]
  const chartConfig = {
    score: {
      label: "Score",
    },
  }

  return (
    <Card className="mt-4 border-primary/50">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">ATS Score Analysis</CardTitle>
        <CardDescription>Your resume score against the job description.</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-270}
            endAngle={90}
            innerRadius="80%"
            outerRadius="100%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="score" background cornerRadius={10} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center p-2 font-medium">
            Your Score:
            <span className="ml-2 text-2xl font-bold text-primary">{result.score}/100</span>
        </div>
        <Separator className="my-2" />
        <div className="w-full text-left">
            <h4 className="font-semibold mb-2">Feedback & Suggestions:</h4>
            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg whitespace-pre-wrap">{result.feedback}</div>
        </div>
      </CardFooter>
    </Card>
  )
}
