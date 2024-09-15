import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

export const Settings: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <Input type="email" id="email" placeholder="your@email.com" />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              New Password
            </label>
            <Input type="password" id="password" placeholder="New password" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1">
              Confirm New Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  </div>
);
