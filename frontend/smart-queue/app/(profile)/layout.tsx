import Sidebar from "../(admin)/AdminComponents/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <main className="flex-1 overflow-auto py-8 px-16">{children}</main>
    </div>
  );
}
