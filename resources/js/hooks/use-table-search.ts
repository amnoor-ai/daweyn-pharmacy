import { router, usePage } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';

/**
 * Debounced server-side search hook.
 * Reads the initial `search` prop from Inertia and fires router.get with {q}
 * on every change after a 300 ms debounce.
 */
export function useTableSearch() {
    const page = usePage();
    const teamSlug = (page.props.currentTeam as { slug: string } | null)?.slug ?? '';
    const initialSearch = (page.props as Record<string, unknown>).search as string ?? '';

    const [query, setQuery] = useState(initialSearch);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = useCallback(
        (value: string) => {
            setQuery(value);

            if (debounceRef.current) clearTimeout(debounceRef.current);

            debounceRef.current = setTimeout(() => {
                const url = page.url;
                const searchableRoutes = [
                    'products',
                    'categories',
                    'customers',
                    'transactions',
                ];
                const matched = searchableRoutes.find((r) => url.includes(`/${r}`));

                if (matched && teamSlug) {
                    router.get(
                        `/${teamSlug}/${matched}`,
                        value ? { q: value } : {},
                        { preserveState: true, replace: true },
                    );
                }
            }, 300);
        },
        [page.url, teamSlug],
    );

    return { query, handleSearch };
}
