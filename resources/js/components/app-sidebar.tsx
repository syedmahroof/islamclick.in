import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { Folder, LayoutGrid, BarChart, Settings, MessageCircle, ListTodo, Image, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: (NavItem | NavGroup)[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Articles',
        href: route('admin.articles.index'),
        icon: MessageCircle,
        items: [
            {
                title: 'All Articles',
                href: route('admin.articles.index'),
            },
            {
                title: 'Add New',
                href: route('admin.articles.create'),
            },
            {
                title: 'Drafts',
                href: route('admin.articles.index', { status: 'draft' }),
            },
        ],
    },
    {
        title: 'Categories',
        href: route('admin.categories.index'),
        icon: Folder,
    },
    {
        title: 'Tags',
        href: route('admin.tags.index'),
        icon: ListTodo,
    },
    {
        title: 'Media Library',
        href: route('admin.media.index'),
        icon: Image,
    },
    {
        title: 'Authors',
        href: '/admin/authors',
        icon: Users,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: BarChart,
    },
  
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>  
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
