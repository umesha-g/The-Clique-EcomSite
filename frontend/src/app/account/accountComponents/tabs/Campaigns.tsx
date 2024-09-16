import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface Campaign {
  id: number;
  name: string;
  status: string;
  budget: number;
  startDate: string;
  endDate: string;
}

interface CampaignsProps {
  campaigns: Campaign[];
}

export const Campaigns: React.FC<CampaignsProps> = ({ campaigns }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Campaigns</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <CardTitle>{campaign.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={`${
                campaign.status === "Active" ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {campaign.status}
            </Badge>
            <p className="mt-2">Budget: ${campaign.budget}</p>
            <p>Start: {campaign.startDate}</p>
            <p>End: {campaign.endDate}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
