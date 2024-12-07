"use client"

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent, ChartTooltip, ChartConfig,
} from "@/components/ui/chart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts'

import { getPlatformStatistics } from '@/api/admin/admin-platform-statistics-api'

export const OverviewPanel: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange |undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  })
  const [statistics, setStatistics] = useState<any[]>([])
  const [aggregatedStats, setAggregatedStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    newRegistrations: 0,
    pendingDisputes: 0
  })

  useEffect(() => {
    const fetchStatistics = async () => {
      if (dateRange?.from && dateRange?.to) {
        try {
          const stats = await getPlatformStatistics(dateRange.from, dateRange.to)
          setStatistics(stats)

          const aggregated = stats.reduce((acc, curr) => ({
            totalRevenue: acc.totalRevenue + (curr.totalRevenue || 0),
            totalOrders: acc.totalOrders + (curr.totalOrders || 0),
            newRegistrations: acc.newRegistrations + (curr.newRegistrations || 0),
            pendingDisputes: acc.pendingDisputes + (curr.pendingDisputes || 0)
          }), {
            totalRevenue: 0,
            totalOrders: 0,
            newRegistrations: 0,
            pendingDisputes: 0
          })

          setAggregatedStats(aggregated)
        } catch (error) {
          console.error('Failed to fetch platform statistics', error)
        }
      }
    }

    fetchStatistics()
  }, [dateRange])

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'hsl(var(--chart-1))'
    },
    orders: {
      label: 'Orders',
      color: 'hsl(var(--chart-2))'
    }
  } satisfies ChartConfig

  return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[260px] justify-start text-left font-normal rounded-none",
                        !dateRange?.from && "text-muted-foreground"
                    )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                      dateRange?.to ? (
                          <>
                            {format(dateRange?.from, 'LLL dd, y')} -{' '}
                            {format(dateRange?.to, 'LLL dd, y')}
                          </>
                      ) : (
                          format(dateRange?.from, 'LLL dd, y')
                      )
                  ) : (
                      <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-none" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col gap-4 mx-auto w-[1500px]">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-xl">Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4">
              <div className={"border p-4"}  >
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold">
                  ${aggregatedStats.totalRevenue.toLocaleString()}
                </div>
              </div>
              <div className={"border p-4"}>
                <div className="text-sm text-muted-foreground">Total Orders</div>
                <div className="text-2xl font-bold">
                  {aggregatedStats.totalOrders.toLocaleString()}
                </div>
              </div>
              <div className={"border p-4"}>
                <div className="text-sm text-muted-foreground">New Registrations</div>
                <div className="text-2xl font-bold">
                  {aggregatedStats.newRegistrations.toLocaleString()}
                </div>
              </div>
              <div className={"border p-4"}>
                <div className="text-sm text-muted-foreground">Pending Disputes</div>
                <div className="text-2xl font-bold text-red-500">
                  {aggregatedStats.pendingDisputes.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-xl">Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                  <LineChart accessibilityLayer data={statistics} >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                    />
                    <YAxis/>
                    <CartesianGrid vertical={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Line
                        name="Revenue"
                        type="monotone"
                        dataKey="totalRevenue"
                        strokeWidth={2}
                        stroke="var(--color-revenue)"
                        dot={false}
                    />
                    <Line
                        name="Orders"
                        type="monotone"
                        dataKey="totalOrders"
                        strokeWidth={2}
                        stroke="var(--color-orders)"
                        dot={false}
                    />
                  </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}