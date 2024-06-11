import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Button, ButtonGroup } from "@nextui-org/button";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen min-h-[750px] font-sans overflow-hidden grid">
        <header className="w-screen h-max flex items-center justify-center pt-2 gap-x-2 self-start">
          <div className="flex flex-col">
            <h2 className="w-full text-center font-bold">Doador</h2>
            <ButtonGroup>
              <Button>
              <Link href="/">
                Registrar
              </Link>
              </Button>
              <Button>
              <Link href="/buscaDoador">
                Buscar
              </Link>
              </Button>
              <Button>
              <Link href="/mudaDoador">
                Mudar
              </Link>
              </Button>
            </ButtonGroup>
          </div>
          <div className="flex flex-col">
            <h2 className="w-full text-center font-bold">Doação</h2>
            <ButtonGroup>
            <Button>
              <Link href="/doacao">
                Doar
              </Link>
              </Button>
              <Button>
              <Link href="/buscaDoacao">
                Buscar
              </Link>
              </Button>
            </ButtonGroup>
          </div>
        </header>
        <div className="h-max flex items-center justify-center self-start">
          {children}
        </div>
        </body>
    </html>
  );
}