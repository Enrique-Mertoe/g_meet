"use client";
import React, {useCallback, useEffect, useRef, useState} from "react";
import SignalBox from "@/app/manage/SignalBox";
import {sSm} from "@/app/manage/ScreenShare/Screenshare";
import Alert from "@/app/ui/components/Dialogs/Alert";
import TimeDisplay from "@/app/ui/Meeting/Controls/TimeDisplay";
import DView from "@/app/ui/Meeting/Controls/DView";
import ControlItem from "@/app/ui/Meeting/Controls/ControlItem";
import {ControlParams} from "@/app/ui/Meeting/Controls/Controls";


const GControl: React.FC<ControlParams> = React.memo(({mute}) => {
    const [isSharing, setIsSharing] = useState(false);
    const callback = useRef<(state: boolean) => void>(null);

    const listener = useCallback((active: boolean) => {
        if (!active) {
            callback.current?.(false);
            SignalBox.trigger("screenShare", null);
        }
    }, []);

    useEffect(() => {
        sSm.addListener(listener);
        return () => {
            sSm.removeListener(listener);
        };
    }, [listener]);


    const toggleScreenShare = useCallback(async (cb: (state: boolean) => void) => {
        callback.current = cb;
        if (!sSm.isSharing()) {
            sSm.start((stream) => {
                SignalBox.trigger("screenShare", stream);
                callback.current?.(true);
            });
        } else {
            sSm.stop();
        }

    }, []);

    return (
        <div className="fixed z-5 right-0 left-0 bottom-0 pb-1">
            <div className="w-full flex justify-center items-center">
                <div
                    className="w-auto me-auto ms-6 gap-4 text-white font-bold bg-dark rounded-full p-2 flex justify-center items-center">
                    <TimeDisplay/>
                </div>
                <div className="mx-auto gap-4 bg-dark me-auto rounded-full p-2 flex justify-center items-center">
                    <ControlItem
                        tooltip={"Microphone"}
                        extra={<></>}
                        icon="mic|mic-off"
                        isActive={true}
                        colors={"bg-[#333537] text[#601410] | bg-[#f9dedcaa] text-[#601410]"}
                        onToggle={(ev) => {

                        }}
                    />
                    <ControlItem
                        tooltip={"Camera"}
                        extra={<></>}
                        colors={"bg-[#333537] text[#601410] | bg-[#f9dedcaa] text-[#601410]"}
                        isActive={true}
                        icon="video|video-off"
                        onToggle={(ev) => {

                        }}
                    />
                    <ControlItem
                        tooltip={"Present now"}
                        onAction={(e) => {
                            e.preventDefault();

                            // sSm.ac = !sSm.ac;
                            SignalBox.trigger("ssm-options");
                            // SignalBox.trigger("screenShare", sSm.ac);
                            // e.active(sSm.ac)
                            // toggleScreenShare((state) => e.active(state)).then();\

                        }}
                        isActive={false}
                        colors="bg-[#a8c7fa]"
                        icon="screen-share"

                        options={{
                            view: sSm.Options,
                            handler: (ref, e) => {
                                // e.active(true)
                                if (ref == "screen")
                                    toggleScreenShare((state) => e.active(state)).then();
                                else {
                                    Alert.warn("Coming soon!")
                                }
                            }
                        }}
                    />
                    <ControlItem tooltip={"Raise hand"} colors="bg-[#a8c7fa]" icon="hand" onToggle={(e) => {
                        Alert.confirm("Quit", handler => {
                            handler.positiveFeedback("yes", () => {
                            });
                            handler.negativeFeedback("No")
                        });
                    }}/>
                    <ControlItem tooltip={"More options"} className="px-1" colors="#333537" icon="more-vertical"/>
                    <ControlItem tooltip={"Leave"} className="px-6" isActive={true}
                                 colors="bg-[#dc362e] hover:bg-[#df463e]|bg-[#dc362e] hover:bg-[#df463e]" icon="phone"/>
                </div>
                <div className="ms-auto">
                    <DView/>
                </div>
            </div>
        </div>
    );
});


export default GControl;
