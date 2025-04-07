"use client"
import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {Closure, DialogBuilder, FileInfo, MediaPickerType} from "@/root/GTypes";
import GIcon from "@/root/ui/components/Icons";
import {Button} from "@/root/ui/components/material-design/button";
import {useDialog} from "@/root/ui/components/Dialogs/DialogProvider";
import {fileToBase64, generateKey, generateMeetID} from "@/root/utility";

type PickerType = {
    onPick: (files: UploadFile[]) => void
    onFileRemove: (handler: (fileToRemove: UploadFile) => void) => void;
    remove: (file: UploadFile) => void
    onDispatch: (fn: (files: FileInfo[]) => void) => void
}
type UploadFile = {
    id: string;
    file: File;
};
const PickerContext = createContext<PickerType>({} as PickerType)
const PickerProvider = ({children}: { children: React.ReactNode }) => {
    const [handler, setHandler] = useState<PickerType | null>(null)
    const [files, setFiles] = useState<UploadFile[]>([])
    const dispatchers = useRef<((files: FileInfo[]) => void) | null>(null)
    const fileRemoveCallback = useRef<Closure>(null)

    async function dispatch(files: UploadFile[]) {
        const fileDetails = await Promise.all(
            Array.from(files).map(async (up) => ({
                name: up.file.name,
                type: up.file.type,
                data: await fileToBase64(up.file)
            }))
        );
        dispatchers.current?.(fileDetails)
    }

    useEffect(() => {
        if (files)
            dispatch(files).then()
    }, [files]);
    useEffect(() => {
        setHandler({
            onPick(files) {
                setFiles(files)
            },
            onDispatch(fn: (files: FileInfo[]) => void) {
                dispatchers.current = fn
            },
            onFileRemove(handler: (fileToRemove: UploadFile) => void) {
                fileRemoveCallback.current = handler
            },
            remove(f: UploadFile) {
                fileRemoveCallback.current?.(f)
            }
        })
    }, []);
    return (
        handler &&
        <PickerContext.Provider value={handler}>
            {children}
        </PickerContext.Provider>
    )
}

const usePicker = () => {
    const context = useContext(PickerContext);
    if (!context) {
        throw new Error('usePicker must be used within a PickerContext');
    }
    return context
}
const FileItem: React.FC<{ uFile: UploadFile, index: number }> = React.memo(function FileItem({uFile, index}) {
    const picker = usePicker()
    const file = uFile.file
    const [src, setSrc] = useState<string | null>(null);
    const [fName,] = useState<string | null>(file.name);
    const [fSize, setFSize] = useState<string>("...");
    const [loaded, setLoaded] = useState(false);
    const [show, setS] = useState("");
    const [scale, setScale] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null)
    const imgContainerRef = useRef<HTMLDivElement | null>(null)
    const parentRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {

        if (!show)
            setTimeout(() => setS("show"))
    }, [show]);


    useEffect(() => {
        setSrc(URL.createObjectURL(file))
        const reader = new FileReader();
        reader.onloadend = function () {
            setLoaded(true)
            setSrc(reader.result as string)
        };
        reader.readAsDataURL(file);

        setFSize(() => {
            const sizeInBytes = file.size
            if (sizeInBytes < 1024) {
                return `${sizeInBytes} B`;
            } else if (sizeInBytes < 1024 * 1024) {
                return `${(sizeInBytes / 1024).toFixed(2)} KB`;
            } else if (sizeInBytes < 1024 * 1024 * 1024) {
                return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
            } else {
                return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
            }
        })

    }, [file]);
    const [itemSize, setItemSize] = useState({width: 200, height: 150});
    const [rows, setRows] = useState(3);

    const time = useRef(800)
    useEffect(() => {
        if (!scale || !imgRef.current || !imgContainerRef.current) return;
        const img = imgRef.current, cont = imgContainerRef.current;
        cont.style.height = `${img.offsetHeight}px`;
        const p = parentRef.current?.parentElement
        setItemSize({
            height: img.offsetHeight,
            width: p ? ((p?.offsetWidth - 10) / 2) : img.offsetWidth
        });
        if (parentRef.current?.parentElement?.parentElement)
            setRows(Math.floor(parentRef.current?.parentElement?.parentElement.offsetHeight / img.height))

        const nthRow = Math.floor(index / 2) + 1;
        setTimeout(() => {

            const cur = parentRef.current;
            if (!p || !cur) return;

            let totalHeight = 0;

            const columnIndex = index % 2;
            for (let i = 0; i < p.children.length; i++) {
                const child = p.children[i] as HTMLElement;
                if (nthRow > 1 && i % 2 === columnIndex) {
                    if (i < index) {
                        totalHeight += child.scrollHeight + gap;
                    }
                }
                if (i === index) break;
            }
            cur.style.top = `${padding + totalHeight}px`;
        }, time.current);
        time.current = 500
    }, [index, scale, time]);
    const padding = 0;
    const gap = 5;
    return (
        <div
            className={""}
            ref={parentRef}
            style={{
                top: `${padding + Math.floor(index / 2) * (itemSize.width + gap)}px`,
                left: `${padding + (index % 2) * (itemSize.width + gap)}px`,
                width: `${itemSize.width}px`,
                transition: "all .5s ease",
                position: "absolute"
            }}>


            <fieldset className={`smv-uploader--data relative ${show} size-full`}

            >


                <div className={`smv-upload--file relative size-full  loaded`}>
                    <div ref={imgContainerRef} className="smv-uploader-media-cont !w-full">
                        <div

                            className={`smv-uploader-media`}
                        >
                            {src && <img ref={imgRef} src={src}
                                         onLoad={() => {
                                             setTimeout(() => setScale(true), 10)
                                         }}
                                         className={`w-full scale-[1.35] transition-all`}
                                         alt={"preview"}/>}
                        </div>
                    </div>
                    <div className="smv-uploader-control bg-gradient-to-b from-gray-800 to-transparent">
                        <div className="relative w-full gap-1 p-2 flex ">
                            <div

                                onClick={() => {
                                    imgRef.current?.classList.remove("scale-[1.35]")
                                    if (imgContainerRef.current) imgContainerRef.current.style.height = "0"
                                    if (imgContainerRef.current) imgContainerRef.current.style.transitionDuration = ".15s"
                                    setTimeout(() => picker.remove(uFile), 150)
                                }}
                            >
                                <span className="control-close">
                                    <GIcon name={"x"} color={"text-white"}/>
                                </span>
                            </div>
                            <div className="vstack ">
                                <div className={"w-[142px]"}><span
                                    className="smv-upload--file-name text-sm truncate">{fName}</span></div>
                                <span className="smv-upload--file-size">{fSize}</span>
                            </div>
                            {
                                !scale && <div className={"ms-auto"}>
                                    <span className={"smv-loader sm z-3"}></span>
                                </div>
                            }


                        </div>

                    </div>
                </div>
            </fieldset>
        </div>
    )
})
const FileUploader: React.FC = React.memo(function FileUploader() {
    const p = usePicker();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const gridRef = useRef<HTMLDivElement | null>(null);
    const [count, setCount] = useState(0)
    const [files, setFiles] = useState<UploadFile[]>([])
    const time = useRef(1000)

    const processFiles = function (files: FileList | null) {
        if (!files) return;
        setCount(prev => prev + files.length)
        setFiles(Array.from(files).map(file => ({
            id: generateKey(),
            file
        })));
        time.current = 1000
    }
    useEffect(() => {
        if (files)
            p.onPick(files)
        p.onFileRemove(f => {
            setFiles(prev => prev.filter(f2 => f.id != f2.id))
            time.current = 300
        })

        setTimeout(() => {
            if (gridRef.current) {
                const p = gridRef.current
                let tHP = 0;
                let tHN = 0;

                const pCol = 1, nCol = 0;
                for (let i = 0; i < p.children.length; i++) {
                    const child = p.children[i] as HTMLElement;
                    if (i % 2 === pCol) {
                        tHP += child.clientHeight + 10;

                    }
                    if (i % 2 === nCol) {
                        tHN += child.clientHeight + 10;

                    }
                }

                gridRef.current.style.height = Math.max(tHP, tHN) + "px"
            }
        }, time.current)

    }, [files, p]);
    return (
        <>
            <div className={`smv-uploader--wrapper w-full`}>
                <div className="w-fill">
                    <input ref={inputRef} className="smv-uploader--browser" type="file" id="smv-uploader--browser"
                           accept="image/png,image/jpeg,video/mp4,video/mov"
                           multiple
                           onChange={(e) => processFiles(e.target.files)}
                    />

                    <div

                        className="border-dashed p-2 flex justify-center rounded flex-col  items-center border border-gray-500 ">

                        {
                            <div
                                onClick={() => inputRef.current?.click()}
                                className="p-2 flex-col w-full items-center min-h-[160px] cursor-pointer justify-center flex ">
                                <Button design={"primary"} className="mb-3 !py-3"
                                        icon={<GIcon name={"cloud-upload"}/>}
                                        text={"Upload Photos/Documents/Videos"}
                                /><span className="opacity-70">or drag them in</span>
                            </div>
                        }
                        <div ref={gridRef}
                             className="grid transition-all duration-300 relative grid-cols-2 gap-2 w-full">
                            {
                                files.map((file, index) => {
                                    return <FileItem index={index} uFile={file} key={file.id}/>
                                })
                            }
                        </div>
                    </div>

                </div>
            </div>
        </>
    )

})

interface PVListener {
    onClose(): void

    onFiles(files: FileInfo[]): void
}

export const PickerView: React.FC<{
    listener: PVListener
}> = ({listener}) => {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [activeTab, setActiveTab] = useState("tab1")
    const uploader = usePicker();
    useEffect(() => {
        uploader.onDispatch(files => setFiles(files))
    }, [uploader]);
    const disabledClass = files.length == 0 ? "pointer-events-none opacity-[0.65]" : ""
    return (
        <div className={"tab-content vstack"}>
            <div className="container  h-[500px]">
                <div className="tab-control px-1">
                    <input type="radio" id="tab1" name="tab" onChange={() => {
                    }} defaultChecked={true}/>
                    <label htmlFor="tab1"
                           onClick={() => setActiveTab("tab1")}
                    > <span className="hstack p-2 gap-1"><GIcon color={"text-current"} name={"history"}/> Recent files</span></label>


                    <input type="radio" id="tab2" name="tab"/>
                    <label htmlFor="tab2"
                           onClick={() => setActiveTab("tab2")}
                    ><span className="hstack p-2 gap-1"><GIcon name={"upload"} color={"text-current"}/> Upload</span></label>
                    <div className="line"></div>
                </div>
                <div className="content-container flex1">
                    <div className={`content ${activeTab === "tab1" && "show"}`} id="c1">
                        <h3>Features</h3>
                        <p>There really are a lot of features.</p>
                    </div>
                    <div
                        className={`content ${activeTab === "tab2" && "show"} overflow-y-auto overflow-x-hidden size-full scroll-smooth`}
                        id="c2">
                        <div
                            className="bg-amber-100 border border-amber-600 hstack mb-4 px-2 rounded text-amber-600">
                            {/*<i className="bi-exclamation-circle me-2 me-sm-3"></i>*/}
                            <div className="me-2">
                                <GIcon name={"alert-triangle"} color={"text-amber-600"}/>
                            </div>
                            <p className="extra-small mb-1">The maximum photo size is 8 MB. Formats: jpeg, jpg,
                                png.<br/>The maximum video size is 10 MB. Formats: mp4, mov.</p>
                        </div>
                        <FileUploader/>
                    </div>
                </div>

            </div>
            <div className="hstack px-2  py-3">
                <div className="ms-auto">
                    <Button text={"Select"} icon={<GIcon name={"check"} size={16} color={"text-current"}/>}
                            onClick={() => {
                                listener.onFiles(files)
                            }}
                            design={"primary-soft"} className={`me-3 !py-2 ${disabledClass}`}/>
                    <Button
                        onClick={() => {
                            listener.onClose()
                        }}
                        className={"!py-2"}
                        icon={<GIcon name={"x"} size={16} color={"text-current"}/>}
                        text={"Close"} design={"light-soft"}/>
                </div>
            </div>

        </div>
    )
}
const MediaPicker = () => {
    const dialog = useRef<DialogBuilder | null>(null);
    const cb = useRef<(file: FileInfo[]) => void>(null);
    const modal = useDialog();
    //
    const listener: PVListener = {
        onClose() {
            dialog.current?.dismiss()
        },
        onFiles(files: FileInfo[]) {
            cb.current?.(files)
            dialog.current?.dismiss()
        }
    }
    return {
        pick(fn: (file: FileInfo[]) => void) {
            cb.current = fn
            dialog.current = modal.create(
                {
                    content: <PickerProvider><PickerView listener={listener}/></PickerProvider>
                }
            )
        }
    }
}
export const useFilePicker = (): MediaPickerType => {
    return MediaPicker()
}