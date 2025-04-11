// app/api/files/[type]/[name]/route.ts

import {readFile} from 'fs/promises';
import {join} from 'path';
import {NextRequest, NextResponse} from 'next/server';

const VALID_TYPES = ['images', 'videos', 'docs'];

export async function GET(
    req: NextRequest,
    {params}: { params: { type: string; name: string } }
) {
    const {type, name} = params;

    if (!VALID_TYPES.includes(type)) {
        return NextResponse.json({error: 'Invalid file type'}, {status: 400});
    }

    const filePath = join(process.cwd(), `storage/${type}`, name);

    try {
        const fileBuffer = await readFile(filePath);

        // You can optionally use better MIME type detection here
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename=${name}`,
            },
        });
    } catch (err) {
        return NextResponse.json({error: 'File not found'}, {status: 404});
    }
}
