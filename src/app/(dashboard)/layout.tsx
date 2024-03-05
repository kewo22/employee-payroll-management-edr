import SideMenu from "./_components/SideMenu";

export const metadata = {
    title: "Next.js",
    description: "Generated by Next.js",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main className="h-dvh w-full flex flex-row items-start bg-slate-100 p-5 gap-5">
        <aside className="flex-grow bg-red-400 h-full rounded-md max-w-64 w-64">
            <SideMenu />
        </aside>
        <section className="flex-grow bg-white h-full rounded-md">
            {children}
        </section>
    </main>;

}
