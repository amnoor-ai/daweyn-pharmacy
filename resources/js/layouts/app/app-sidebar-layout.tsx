import Appsidebar from '@/components/app-sidebar';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#F6F7FB]">
            <Appsidebar />
            <div className="flex flex-col flex-1">
                {/* navbar goes here later */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}