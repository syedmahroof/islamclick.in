import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    const isActive = (href?: string) => {
        if (!href) return false;
        return page.url.startsWith(href);
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.submenu ? (
                            <SidebarMenuSub>
                                <SidebarMenuSubButton>
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    <span>{item.title}</span>
                                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                </SidebarMenuSubButton>
                                <SidebarMenuSubItem>
                                    {item.submenu.map((subItem) => (
                                        <SidebarMenuButton 
                                            key={subItem.href} 
                                            asChild 
                                            isActive={isActive(subItem.href)}
                                            className="pl-8"
                                        >
                                            <Link href={subItem.href} prefetch>
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    ))}
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        ) : (
                            <SidebarMenuButton asChild isActive={isActive(item.href)}>
                                <Link href={item.href || '#'} prefetch>
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
