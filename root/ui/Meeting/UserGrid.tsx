import React, {CSSProperties, useEffect, useRef, useState} from "react";
import {UList} from "@/root/ui/components/Layout/Containers";
import GCard from "@/root/ui/components/Layout/GCard";
import {UserInfo, PresentationInfo} from "@/root/fn";

interface UserGridProps {
    items: UserInfo[];
    presentationDetails: PresentationInfo
}

const gRows = ["", "grid-rows-1", "grid-rows-2", "grid-rows-3", "grid-rows-4"]
const gCols = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4"]

const UserGrid: React.FC<UserGridProps> = ({
                                               items,
                                               presentationDetails
                                           }) => {

    const gap = 5;
    const padding = 10;
    const containerRef = useRef<HTMLDivElement | null>(null),
        [ready, setReady] = useState(false);


    const [itemsPerRow, setItemsPerRow] = useState(3);
    const [itemSize, setItemSize] = useState({width: 200, height: 150});
    const [showMore, setShowMore] = useState(false);
    const [isResized, setIsResized] = useState(false);
    const [rows, setRows] = useState(3);
    const [fixedLayout, setFixedLayout] = useState(false);


    const [screenItems, setScreenItems] = useState(items);
    const [gridCols, setGridCols] = useState(itemsPerRow);
    const [gridRows, setGridRows] = useState(rows);
    const resize = (container: HTMLElement) => {

        const width = container.offsetWidth;
        const height = container.offsetHeight;

        // Available space after considering padding
        const availableWidth = width - 2 * padding;
        const availableHeight = height - 2 * padding;

        // Determine items per row based on available width
        let newItemsPerRow;
        if (availableWidth < 320) {
            newItemsPerRow = 2;
        } else if (availableWidth < 768) {
            newItemsPerRow = 2;
        } else {
            newItemsPerRow = 3;
        }

        // Calculate item width considering gaps
        const totalGapWidth = (newItemsPerRow - 1) * gap;
        const itemWidth = (availableWidth - totalGapWidth) / newItemsPerRow;

        // Calculate item height dynamically
        let itemHeight = itemWidth * 0.75;

        // Calculate number of rows that can fit
        const maxRows = Math.floor(availableHeight / (itemHeight + gap));
        const totalGapHeight = (maxRows - 1) * gap;
        let calculatedRows = Math.floor((availableHeight - totalGapHeight) / itemHeight);

        // Adjust item height if needed
        const threshold = (calculatedRows * (itemHeight + gap)) / availableHeight
        if (threshold > .5) {
            calculatedRows += 1
        }
        if ((calculatedRows * (itemHeight + gap)) > availableHeight) {
            itemHeight = availableHeight / calculatedRows - (calculatedRows * (gap / 2))
        }

        // Update states
        setItemsPerRow(prev => (prev !== newItemsPerRow ? newItemsPerRow : prev));
        setItemSize({width: itemWidth, height: itemHeight});
        setRows(prev => (prev !== calculatedRows ? calculatedRows : prev));

        // Determine the number of items to display
        const itemsToShow = screenItems.slice(0, newItemsPerRow * calculatedRows);
        // setShowMore(screenItems.length > itemsToShow.length);
        setGridCols(itemsPerRow)
        setGridRows(rows)

    }

    const [styles, setStyles] = useState<CSSProperties>({})
    const resizeFixed = () => {
        setStyles(prevState => ({
            ...prevState, position: "relative",
            left: "0", top: "0"
        }))
    }
    useEffect(() => {
        isResized && resizeFixed()
    }, [isResized]);
    useEffect(() => {
        containerRef.current && resize(containerRef.current);
        setReady(true);
        setTimeout(() => {
            resizeFixed()
        }, 300);
    }, []);

    useEffect(() => {
        // const observer = new ResizeObserver(() => {
        //     containerRef.current && resize(containerRef.current);
        // });
        // containerRef.current &&
        // observer.observe(containerRef.current);
        const handleResize = () => containerRef.current && resize(containerRef.current);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    const itemsToShow = screenItems.slice(0, itemsPerRow * rows);
    return (
        <div
            ref={containerRef}
            className={`z-2 duration-200 top-0 size-full transition-all relative ease-out`}
        >
            <div className="relative w-full h-full">
                {/*<p className={"text-white z-3 relative"}>dsfsd</p>*/}
                {ready && <UList>
                    <div className={`grid rounded  ${gCols[gridCols]} ${gRows[gridRows]} p-3 w-full h-full`}>
                        {itemsToShow.map((user, index) => {
                            user = {...user, name: `${user.name}-${index}`};

                            // const styles = fixedLayout
                            //     ? {} // Normal layout (flexbox/grid)
                            //     : {
                            //         top: `${padding + Math.floor(index / itemsPerRow) * (itemSize.height + gap)}px`,
                            //         left: `${padding + (index % itemsPerRow) * (itemSize.width + gap)}px`,
                            //         width: `${itemSize.width}px`,
                            //         height: `${itemSize.height}px`,
                            //     };

                            // setStyles(prevState => ({
                            //     ...prevState,
                            //
                            //     top: `${padding + Math.floor(index / itemsPerRow) * (itemSize.height + gap)}px`,
                            //     left: `${padding + (index % itemsPerRow) * (itemSize.width + gap)}px`,
                            //     width: `${itemSize.width}px`,
                            //     height: `${itemSize.height}px`,
                            //     ...styles
                            //
                            // }))
                            return (
                                <div   key={index} className={"p-[2px] h-full"}>
                                    <GCard
                                        info={user}
                                        type={"user"}
                                        className={`${user.name} user-${index}`}

                                        style={styles}
                                    />
                                </div>
                            );
                        })}
                        {showMore && (
                            <div className="more-items-card hidden">
                                <GCard type="presentation" info={presentationDetails}/>
                            </div>
                        )}
                    </div>
                </UList>}
            </div>
        </div>
    )
}

export default UserGrid;