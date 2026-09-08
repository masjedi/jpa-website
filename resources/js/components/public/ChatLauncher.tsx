import { Suspense, lazy, useState } from 'react';

import { ChatLauncherButton } from '@/components/public/chat/ChatLauncherButton';

const ChatWidget = lazy(() =>
    import('@/components/public/chat/ChatWidget').then((module) => ({
        default: module.ChatWidget,
    })),
);

export function ChatLauncher() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <ChatLauncherButton
                isOpen={isOpen}
                onToggle={() => setIsOpen((current) => !current)}
            />
            {isOpen ? (
                <Suspense fallback={null}>
                    <ChatWidget
                        onClose={() => setIsOpen(false)}
                        onMinimize={() => setIsOpen(false)}
                    />
                </Suspense>
            ) : null}
        </>
    );
}
