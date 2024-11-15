import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Chart } from "@/app/admin/dashboard/adminDashboard_Components/OverviewPanelComponets/Chart";

export const OverviewPanel: React.FC = () => (
  <div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-[1500px]">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className={"text-xl"}>Earnings Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="font-semibold">Total Earnings</div>
              <div className="text-2xl"></div>
            </div>
            <div>
              <div className="font-semibold">Item Earnings</div>
              <div className="text-2xl"></div>
            </div>
            <div>
              <div className="font-semibold">Tax Withheld</div>
              <div className="text-2xl"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className={"text-xl"}>Your earnings this month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-500 mb-4">

          </div>
          <Button variant="outline" className="w-full rounded-none">
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
