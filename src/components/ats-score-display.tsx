
"use client"

import * as React from "react"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Separator } from "./ui/separator"
import type { KeywordAtsResult } from "@/lib/ats-keyword-scorer"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"

interface AtsScoreDisplayProps {
  result: KeywordAtsResult
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
        <CardDescription>Your resume's keyword match against the job description.</CardDescription>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
            <div>
                <h4 className="font-semibold mb-2">Matched Keywords ({result.matchedKeywords.length})</h4>
                 <ScrollArea className="h-40">
                    <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg">
                        {result.matchedKeywords.map(kw => <Badge key={kw} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{kw}</Badge>)}
                    </div>
                </ScrollArea>
            </div>
             <div>
                <h4 className="font-semibold mb-2">Missing Keywords ({result.missingKeywords.length})</h4>
                 <ScrollArea className="h-40">
                    <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg">
                        {result.missingKeywords.map(kw => <Badge key={kw} variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">{kw}</Badge>)}
                    </div>
                </ScrollArea>
            </div>
        </div>
      </CardFooter>
    </Card>
  )
}
