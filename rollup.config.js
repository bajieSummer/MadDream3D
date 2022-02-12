import * as fs from 'fs';
import { uglify } from "rollup-plugin-uglify";

function addShader() {
    return {
        transform(code, id) {
            if (id.includes('MaterialUtil.js') === false) return;
            const content = fs.readFileSync('src/md_shader/built_in_shader.js', { encoding: 'utf8' })
            code = content + "\n" + code;
            return {
                code: code,
                map: null
            };
        },
    };
}

export default [
    {
        input: 'src/MadDream.js',
        plugins: [addShader()],
        output: {
            file: 'dist/maddream.js',
            name: 'Mad3D',
            format: 'iife',
        },
    },
    {
        input: 'src/MadDream.js',
        plugins: [addShader(), uglify()],
        output: {
            file: 'dist/maddream.min.js',
            name: 'Mad3D',
            format: 'iife',
        },
    }
]