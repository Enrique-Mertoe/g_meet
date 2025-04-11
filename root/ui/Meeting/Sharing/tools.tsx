import {FileInfo} from "@/root/GTypes";
import {toBlob} from "@/root/utility";
import {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "@/root/ui/components/material-design/button";

export default function AlbumThumb({files}: {
    files: FileInfo[]
}) {
    const [img1, img2, img3, ...rest] = files
    const refPointDiv = useRef<HTMLDivElement>(null)
    const refDivWithItemsToMigrate = useRef<HTMLDivElement>(null)
    const [prevOpen, setPOpen] = useState(false)
    const [opened, setOpened] = useState(false)
    const cloneDataRef = useRef<{ from: DOMRect, items: DOMRect[] } | null>(null);

    const animIn = () => {
        // if (!prevOpen) return;
        const pointDiv = refPointDiv.current;
        const container = refDivWithItemsToMigrate.current;

        if (!pointDiv || !container) return;
        setTimeout(() => setOpened(true), 10)
        const from = pointDiv.getBoundingClientRect();
        const items = Array.from(container.children).map(child =>
            (child as HTMLElement).getBoundingClientRect()
        );

        cloneDataRef.current = {from, items};

        Array.from(container.children).forEach((child, index) => {
            const to = child.getBoundingClientRect();

            const clone = (child as HTMLElement).cloneNode(true) as HTMLElement;
            const dx = to.left - from.left;
            const dy = to.top - from.top;
            // Style the clone
            Object.assign(clone.style, {
                position: 'fixed',
                left: `${from.left}px`,
                top: `${from.top}px`,
                width: `${from.width}px`,
                height: `${from.height}px`,
                zIndex: '9999',
                transition: 'all 0.5s ease-out, opacity 0.3s ease-in',
                transform: `translate(0px, 0px) scale(1)`,
                pointerEvents: 'none',
                opacity: '.6',
            });

            // Append to body
            document.body.appendChild(clone);
            // Animate in next frame
            requestAnimationFrame(() => {
                clone.style.transform = `translate(${dx}px, ${dy}px)`;
                Object.assign(clone.style, {
                    width: `${to.width}px`,
                    height: `${to.height}px`,
                });
                clone.style.opacity = '1';

            });
            setTimeout(() => {

                clone.remove();
                (child as HTMLDivElement).style.opacity = "1";
            }, 700 + index * 50);
        });
    }


    const revertAnimation = useCallback(() => {
        if (!prevOpen) return;
        setPOpen(false)
        const container = refDivWithItemsToMigrate.current;
        const cloneData = cloneDataRef.current;

        if (!container || !cloneData) return;

        const {from,} = cloneData;

        Array.from(container.children).forEach((child, index) => {
            const fromNow = (child as HTMLElement).getBoundingClientRect();
            const dx = from.left - fromNow.left;
            const dy = from.top - fromNow.top;

            const clone = (child as HTMLElement).cloneNode(true) as HTMLElement;
            Object.assign(clone.style, {
                position: 'fixed',
                left: `${fromNow.left}px`,
                top: `${fromNow.top}px`,
                width: `${fromNow.width}px`,
                height: `${fromNow.height}px`,
                zIndex: '9999',
                transition: 'all 0.3s ease-in-out',
                transform: 'translate(0px, 0px)',
                pointerEvents: 'none',
            });
            if (container.parentElement) {
                container.parentElement.style.width = "0"
                container.parentElement.style.opacity = "0"
                container.parentElement.style.height = `${container.parentElement.offsetHeight}px`
                setTimeout(() => {
                    if (container.parentElement)
                        container.parentElement.style.height = "0"
                })
            }

            document.body.appendChild(clone);

            requestAnimationFrame(() => {
                clone.style.transform = `translate(${dx}px, ${dy}px)`;
                Object.assign(clone.style, {
                    width: `${from.width}px`,
                    height: `${from.height}px`,
                });
                setTimeout(() => {
                    clone.style.opacity = "0"
                }, 150)
            });

            setTimeout(() => {
                setOpened(false)
                clone.remove();
            }, 600 + index * 50);
        });
    }, [prevOpen])


    const reDropdown = useRef<HTMLDivElement | null>(null);
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (prevOpen && reDropdown.current && !reDropdown.current.contains(event.target as Node)) {
            revertAnimation()
        }
    }, [prevOpen, revertAnimation]);
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [handleClickOutside]);
    return (
        files.length > 0 &&

        <div>
            <div className="album-thumb">
                <div ref={refPointDiv}
                     onClick={() => {
                         setPOpen(prev => {
                             if (prev) return prev
                             return true
                         })
                         setTimeout(() => animIn())
                     }}
                     className="thumb-container">
                    <div className="images-container">
                        <img className="thumb-image" src={toBlob(img1.data as ArrayBuffer)} alt="Thumb 1"/>
                        {
                            img2 && img2.data &&
                            <img className="thumb-image" src={toBlob(img2.data as ArrayBuffer)} alt="Thumb 2"/>
                        }
                        {
                            img3 && img3.data &&
                            <img className="thumb-image" src={toBlob(img3.data as ArrayBuffer)} alt="Thumb 3"/>
                        }
                    </div>
                    {
                        rest.length > 0 &&
                        <div className="photo-count">
                            <div className="content">
                                <div className="number font-bold">+{rest.length}</div>
                            </div>
                        </div>
                    }
                </div>

            </div>
            {
                prevOpen &&
                <div
                    ref={reDropdown}
                    className={`${opened && "opacity-100"} opacity-0 transition-all duration-300`}>
                    <div
                        className={`preview-album mt-16 w-96 p-2 absolute end-0 rounded top-0 `}
                        style={{background: "rgba(255,255,255,0.3"}}>
                        <div
                            ref={refDivWithItemsToMigrate}
                            className={`grid gap-1  grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] `}>
                            {
                                files.map((f, i) => (
                                    <div key={i + f.name} className="card">
                                        <img src={toBlob(f.data as ArrayBuffer)} alt={f.name}
                                             className="size-full aspect-square rounded-inherit"/>
                                    </div>
                                ))
                            }

                        </div>
                        <div className="hstack mt-2">
                            <Button text={"close"}
                                    design={"primary-soft"}

                                    onClick={() => revertAnimation()}
                                    className={"!py-1 ms-auto"}/>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export {
    AlbumThumb
}