import {CSSProperties} from "react";

interface SMVQProps {
    css: (props: CSSProperties) => SMVQProps
}

const SMVQry = (element: HTMLElement): SMVQProps => {
    return {
        css(css) {
            for (let property in css) {
                if (Object.prototype.hasOwnProperty.call(css, property)) {

                    const camelCaseProperty: string = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
                    (element.style as any)[camelCaseProperty] = css[property as keyof CSSProperties];
                }
            }
            return this
        }
    }
};

export const $ = SMVQry;

