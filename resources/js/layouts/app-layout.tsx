import { usePage } from '@inertiajs/react';
import * as React from 'react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

function getPageLayoutConfig(element: React.ReactNode): any {
    if (!element || typeof element !== 'object') {
return null;
}

    const elementObject = element as any;
    const type = elementObject.type;

    if (type && type.layoutConfig) {
        return {
            config: type.layoutConfig,
            props: elementObject.props,
        };
    }

    const props = elementObject.props;

    if (props && props.children) {
        return getPageLayoutConfig(props.children);
    }

    return null;
}

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pageProps = usePage().props;
    const layoutInfo = getPageLayoutConfig(children);
    let resolvedBreadcrumbs: BreadcrumbItem[] = [];

    if (layoutInfo) {
        const { config, props } = layoutInfo;
        const mergedProps = { ...pageProps, ...props };

        if (typeof config === 'function') {
            const layoutResult = config(mergedProps);
            resolvedBreadcrumbs = layoutResult?.breadcrumbs || [];
        } else if (config && typeof config === 'object') {
            resolvedBreadcrumbs = config.breadcrumbs || [];
        }
    }

    return (
        <AppLayoutTemplate breadcrumbs={resolvedBreadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
