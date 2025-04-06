import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:react-hooks/recommended"),
    {
        rules: {
            "@typescript-eslint/no-unused-expressions": [
                "error",
                {
                    "allowShortCircuit": true,  // Allows short-circuiting
                    "allowTernary": true,       // Allows ternary operators
                },
            ],
            "@typescript-eslint/no-unused-vars": [
                "off", // or "off" to disable completely
                {
                    "vars": "none",
                    "args": "none", // allow unused arguments
                    "ignoreRestSiblings": true // allow unused variables in object destructuring
                },
            ],
        },
    },
];

export default eslintConfig;
