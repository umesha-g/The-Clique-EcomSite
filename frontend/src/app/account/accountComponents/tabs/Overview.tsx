import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Chart } from "./overviewComponets/Chart";

interface OverviewProps {
  earnings: any;
}

export const Overview: React.FC<OverviewProps> = ({ earnings }) => (
  <div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="">
        <CardHeader>
          <CardTitle>Earnings Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">${earnings.total}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="font-semibold">Total Earnings</div>
              <div className="text-2xl">${earnings.totalEarnings}</div>
            </div>
            <div>
              <div className="font-semibold">Item Earnings</div>
              <div className="text-2xl">${earnings.itemEarnings}</div>
            </div>
            <div>
              <div className="font-semibold">Tax Withheld</div>
              <div className="text-2xl">${earnings.taxWithheld}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your earnings this month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-500 mb-4">
            {earnings.thisMonth}
          </div>
          <Button variant="outline" className="w-full">
            Withdraw All Earnings
          </Button>
        </CardContent>
      </Card>
    </div>
    <div className="mt-5">
      <Chart />
    </div>
  </div>
);
