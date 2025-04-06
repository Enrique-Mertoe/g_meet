import {CSSProperties} from "react";

interface SMVQProps {
    css: (props: CSSProperties) => SMVQProps
}

const SMVQry = (element: HTMLElement): SMVQProps => {
    return {
        css(css) {
            for (const property in css) {
                if (Object.prototype.hasOwnProperty.call(css, property)) {

                    const camelCaseProperty: string = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    (element.style as unknown)[camelCaseProperty] = css[property as keyof CSSProperties];
                }
            }
            return this
        }
    }
};

export const $ = SMVQry;

