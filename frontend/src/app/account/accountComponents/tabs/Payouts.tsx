import React from "react";

interface Payout {
  id: number;
  amount: number;
  date: string;
  status: string;
}

interface PayoutsProps {
  payouts: Payout[];
}

export const Payouts: React.FC<PayoutsProps> = ({ payouts }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Payouts</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr key={payout.id}>
              <td className="border px-4 py-2">{payout.id}</td>
              <td className="border px-4 py-2">${payout.amount}</td>
              <td className="border px-4 py-2">{payout.date}</td>
              <td className="border px-4 py-2">{payout.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
