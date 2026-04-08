
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "Devix - %s",
        default: "Devix | The Kinetic IDE",
    },
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
             {children}
        </div>
    );
}
