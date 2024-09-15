import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface Statement {
  id: number;
  period: string;
  total: number;
  status: string;
}

interface StatementProps {
  statements: Statement[];
}

export const Statement: React.FC<StatementProps> = ({ statements }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Statements</h2>
    <div className="space-y-4">
      {statements.map((statement) => (
        <Card key={statement.id}>
          <CardHeader>
            <CardTitle>{statement.period}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total: ${statement.total}</p>
            <p>Status: {statement.status}</p>
            <Button className="mt-2">Download PDF</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
