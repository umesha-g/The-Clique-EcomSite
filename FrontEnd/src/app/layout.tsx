import type { Metadata } from "next";
import "./globals.css";
import {CartProvider} from "@/contexts/cartContext";
import {AuthProvider} from "@/contexts/authContext";
import {NotificationsProvider} from "@/contexts/notificationContext";
import {Toaster} from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "The Clique | Best Collection in the World",
  description: "Online Fashion Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <body className={`antialiased font-literata bg-white`}>
              <main>{children}</main>
              <Toaster />
            </body>
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </html>
  );
}
