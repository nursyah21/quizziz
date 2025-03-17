import { useEffect } from "react";

export function InfiniteScroll({ onEnd }: { onEnd: () => Promise<void> }) {

    useEffect(() => {
        const handleScroll = async () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
            onEnd();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [onEnd]);

    return null;
}