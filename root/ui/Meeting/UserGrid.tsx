import React, { useEffect, useRef, useState } from "react";
import { UList } from "@/root/ui/components/Layout/Containers";
import GCard from "@/root/ui/components/Layout/GCard";
import { UserInfo, PresentationInfo } from "@/root/fn";

interface UserGridProps {
    items: UserInfo[];
    presentationDetails: PresentationInfo;
}

const UserGrid: React.FC<UserGridProps> = ({ items, presentationDetails }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [gridLayout, setGridLayout] = useState({ cols: 1, rows: 1, itemWidth: 0, itemHeight: 0 });
    const [ready, setReady] = useState(false);

    const calculateGrid = () => {
        if (!containerRef.current) return;
        
        const container = containerRef.current;
        const { width, height } = container.getBoundingClientRect();
        const itemCount = items.length;
        
        if (itemCount === 0) return;
        
        // Calculate optimal grid dimensions
        let cols = Math.ceil(Math.sqrt(itemCount));
        let rows = Math.ceil(itemCount / cols);
        
        // Adjust based on container aspect ratio
        const containerRatio = width / height;
        const gridRatio = cols / rows;
        
        if (gridRatio > containerRatio * 1.5) {
            cols = Math.max(1, cols - 1);
            rows = Math.ceil(itemCount / cols);
        } else if (gridRatio < containerRatio * 0.5) {
            cols = Math.min(itemCount, cols + 1);
            rows = Math.ceil(itemCount / cols);
        }
        
        // Calculate item dimensions with padding
        const padding = 16;
        const gap = 8;
        const itemWidth = (width - padding * 2 - gap * (cols - 1)) / cols;
        const itemHeight = (height - padding * 2 - gap * (rows - 1)) / rows;
        
        setGridLayout({ cols, rows, itemWidth, itemHeight });
    };

    useEffect(() => {
        calculateGrid();
        setReady(true);
    }, [items]);

    useEffect(() => {
        const handleResize = () => calculateGrid();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [items]);

    const getItemPosition = (index: number) => {
        const row = Math.floor(index / gridLayout.cols);
        const col = index % gridLayout.cols;
        const padding = 16;
        const gap = 8;
        
        return {
            position: 'absolute' as const,
            left: padding + col * (gridLayout.itemWidth + gap),
            top: padding + row * (gridLayout.itemHeight + gap),
            width: gridLayout.itemWidth,
            height: gridLayout.itemHeight,
            transition: 'all 0.3s ease-out'
        };
    };

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden">
            {ready && (
                <UList>
                    {items.map((user, index) => (
                        <div key={user.uid || index} style={getItemPosition(index)}>
                            <GCard
                                info={user}
                                type="user"
                                className="w-full h-full"
                            />
                        </div>
                    ))}
                </UList>
            )}
        </div>
    );
};

export default UserGrid;