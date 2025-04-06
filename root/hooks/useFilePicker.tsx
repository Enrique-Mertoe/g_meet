"use client"
import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {DialogBuilder, FileInfo, MediaPickerType} from "@/root/GTypes";
import GIcon from "@/root/ui/components/Icons";
import {Button} from "@/root/ui/components/material-design/button";
import {useDialog} from "@/root/ui/components/Dialogs/DialogProvider";

type PickerType = {
    onPick: (files: FileList) => void
    onDispatch: (files: FileInfo) => void
}
const PickerContext = createContext<PickerType>({} as PickerType)
const PickerProvider = ({children}: { children: React.ReactNode }) => {
    const [handler, setHandler] = useState<PickerType>({} as PickerType)
    const [, setFiles] = useState<FileList | null>(null)

    // const h:PickerType = useCallback(()=>{
    //
    // },[{}])
    useEffect(() => {
        setHandler({
            onPick(files) {
                setFiles(files)
            },
            onDispatch(files) {
                console.log(files)
            }
        })
    }, []);
    return (
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
const FileItem = ({file}: { file: File }) => {

    const [src, setSrc] = useState<string | null>(null);
    const [fName,] = useState<string | null>(file.name);
    const [fSize, setFSize] = useState<string>("...");
    const [loaded, setLoaded] = useState(false);
    const [scale, setScale] = useState(false);
    useEffect(() => {
        const reader = new FileReader();
        reader.onloadend = function () {
            setLoaded(true)
            setTimeout(() => setScale(true), 10)
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
    return (
        <fieldset className="smv-uploader--data col">
            <div className={`smv-upload--file  ${loaded && "loaded"}`}>
                <div className="smv-uploader-progress">
                    <span className="smv-upload--file-name"></span>
                    <span>
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <rect className="spinner_jCIR" x="1" y="6" width="2.8" height="12"/>
                                <rect className="spinner_jCIR spinner_upm8" x="5.8" y="6" width="2.8" height="12"/>
                                <rect className="spinner_jCIR spinner_2eL5" x="10.6" y="6" width="2.8" height="12"/>
                                <rect className="spinner_jCIR spinner_Rp9l" x="15.4" y="6" width="2.8" height="12"/>
                                <rect className="spinner_jCIR spinner_dy3W" x="20.2" y="6" width="2.8" height="12"/>
                            </svg>
                            </span>
                </div>

                <div
                    className={`smv-uploader-media scale-3d transform scale-[1.25] ${scale && "scale-[1]"} duration-300`}
                    style={{backgroundImage: `url(${src})`}}
                >
                    {src && <img src={src} alt={"preview"}/>}
                </div>
                <div className="smv-uploader-control bg-gradient-to-b from-gray-800 to-transparent">
                    <div>
                                <span className="control-close">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-x" viewBox="0 0 16 16">
                                      <path
                                          d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                </span>
                    </div>
                    <div className="vstack">
                        <span className="smv-upload--file-name">{fName}</span>
                        <span className="smv-upload--file-size">{fSize}</span>
                    </div>
                </div>
            </div>
        </fieldset>
    )
}
const FileUploader = () => {
    const p = usePicker()
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [count, setCount] = useState(0)
    const [files, setFiles] = useState<FileList | null>(null)

    const processFiles = function (files: FileList | null) {
        if (!files) return;
        if (count >= 4)
            return;
        setCount(prev => prev + files.length)
        setFiles(files)
    }
    useEffect(() => {
        if (files)
            p.onPick(files)
    }, [files, p]);
    return (
        <>
            <div className="smv-uploader--wrapper">
                <div className="">
                    <input ref={inputRef} className="smv-uploader--browser" type="file" id="smv-uploader--browser"
                           accept="image/png,image/jpeg,video/mp4,video/mov"
                           onChange={(e) => processFiles(e.target.files)}
                    />

                    <div

                        className="border-dashed flex justify-center rounded flex-col  items-center border border-gray-500 ">

                        {count <= 4 &&
                            <div
                                onClick={() => inputRef.current?.click()}
                                className="p-2 flex-col w-full items-center min-h-[160px] cursor-pointer justify-center flex ">
                                <Button design={"primary"} className="mb-3 !py-3"
                                        icon={<GIcon name={"cloud-upload"}/>}
                                        text={"Upload Photos/Documents/Videos"}
                                /><span className="opacity-70">or drag them in</span>
                            </div>
                        }
                        <div className="row px-3 grid grid-cols-2 g-3 w-100">
                            {
                                files && Array.from(files).map((file, index) => {
                                    return <FileItem file={file} key={index}/>
                                })
                            }
                        </div>
                    </div>

                </div>
            </div>
        </>
    )

}

interface PVListener {
    onClose(): void
}

export const PickerView: React.FC<{
    listener: PVListener
}> = ({listener}) => {
    const [files, setFiles] = useState([]);
    console.log(files, setFiles)
    return (
        <div className={"tab-content"}>
            <div className="container  h-[500px]">
                <input type="radio" id="tab1" name="tab" onChange={() => {
                }} defaultChecked={true}/>
                <label htmlFor="tab1"><i className="fa fa-code"></i> Recent files</label>


                <input type="radio" id="tab2" name="tab"/>
                <label htmlFor="tab2"><i className="fa fa-history"></i> Upload</label>
                <div className="line"></div>
                <div className="content-container">
                    <div className="content" id="c1">
                        <h3>Features</h3>
                        <p>There really are a lot of features.</p>
                    </div>
                    <div className="content" id="c2">
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
                            design={"primary-soft"} className={"me-3"}/>
                    <Button
                        onClick={() => {
                            listener.onClose()
                        }}
                        icon={<GIcon name={"x"} size={16} color={"text-current"}/>}
                        text={"Close"} design={"primary-soft"}/>
                </div>
            </div>
        </div>
    )
}
const MediaPicker = () => {
    const dialog = useRef<DialogBuilder | null>(null);
    const modal = useDialog();
    //
    const listener: PVListener = {
        onClose() {
            dialog.current?.dismiss()
        }
    }
    return {
        pick() {
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