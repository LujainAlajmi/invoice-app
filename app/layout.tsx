import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Nav from "@/components/Nav";
import { getCurrentUser } from "@/lib/session";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Frontend Mentor | Invoice app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className={`${inter.className}  px-12 space-y-6 h-screen w-full`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav user={user} />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
