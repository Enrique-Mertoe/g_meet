import React, {CSSProperties, useEffect, useRef, useState} from "react";
import {ChatInfo, FileInfo} from "@/root/GTypes";
import {formatTime, toBlob} from "@/root/utility";

type Props = {
    items: FileInfo[];
};

const parseTextWithLinks = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, index) => {
        // Detect URLs and replace with anchor elements
        const parts = line.split(/(https?:\/\/[^\s]+)/g);

        return (
            <span key={index}>
                {parts.map((part, i) =>
                    part.match(/https?:\/\/[^\s]+/) ? (
                        <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-700"
                        >
                            {part}
                        </a>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </span>
        );
    });
};

const DynamicGrid: React.FC<Props> = ({items}) => {
    const isOdd = items.length % 2 === 1;
    const lastIndex = items.length - 1;

    const getBorderRadiusClass = (index: number) => {
        const isFirst = index === 0;
        const isLast = index === lastIndex;
        const isSecondLast = index === lastIndex - 1;

        if (items.length === 1) return 'rounded-xl';

        // For odd number and last item full width
        if (isOdd && isLast) return 'rounded-b-xl';

        // Top-left and top-right
        if (isFirst) return 'rounded-tl-xl';
        if (index === 1) return 'rounded-tr-xl';

        // Bottom-left and bottom-right
        if (isOdd && isSecondLast) return 'rounded-bl-xl';
        if (!isOdd && isLast) return 'rounded-bl-xl';
        if (!isOdd && lastIndex - 1 === index) return 'rounded-br-xl';

        return '';
    };

    return (
        <div
            className={`grid media-list gap-1 ${
                items.length === 1
                    ? 'grid-cols-1'
                    : 'grid-cols-2'
            } ${isOdd ? 'grid-odd' : ''}`}
        >
            {items.map((f, index) => (
                <div
                    key={f.name}
                    className={`media-list-item item-${index} ${
                        isOdd && index === lastIndex ? 'col-span-2' : ''
                    }`}
                >
                    <img className="rounded-inherit" src={toBlob(f.data as ArrayBuffer)} alt={f.name}/>
                </div>
            ))}
        </div>
    );
};
const MessageItem: React.FC<{ info: ChatInfo }> = ({info}) => {
    const _from = info.sender === "me" ? "from-me" : "from-them";
    const [show, setShow] = useState(false)
    const el = useRef<HTMLDivElement | null>(null)


    /* SLIDE DOWN */
    const slideDown = (target: HTMLDivElement, duration = 300) => {
        // Object.assign(target.style, {
        //     transform: "scale(.7)",
        //     transition: "all .5s"
        // })
        setTimeout(() => target.classList.remove("scale-[.7]"), 10)
    }

    useEffect(() => {
        setShow(true)
        el.current &&
        slideDown(el.current)
    }, []);

    return (
        <div ref={el}
             className={`${_from} duration-[.5s] transition-all  scale-[.7] text-sm msg ${!show && "pacity-0"}`}>
            {
                info.files &&
                <div className={"rounded-inherit"}>
                    <DynamicGrid items={info.files}/>
                </div>
            }
            <p className={"px-2 whitespace-pre-wrap"}>
                {parseTextWithLinks(info.message)}
                <small className={"float-right text-[#71bf6d] mt-[3px] ms-1"}>
                    {formatTime(info.time)}
                </small>
            </p>
        </div>
    );
};

export default MessageItem