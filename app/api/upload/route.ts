// app/api/upload/route.ts
import {writeFile, mkdir} from 'fs/promises';
import {join, extname} from 'path';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('name')?.toString() || file?.name;

    if (!file) {
        return NextResponse.json({error: 'No file provided'},);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = extname(filename).toLowerCase();

    // Basic type categorization based on file extension
    let fileType: 'image' | 'video' | 'docs' = 'docs'; // default
    if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)) {
        fileType = 'image';
    } else if (['.mp4', '.avi', '.mov', '.mkv', '.webm'].includes(ext)) {
        fileType = 'video';
    }

    const folder = join(process.cwd(), `storage/${fileType}`);
    const filePath = join(folder, filename);

    await mkdir(folder, {recursive: true});
    await writeFile(filePath, buffer);

    return NextResponse.json({
        ok: true,
        message: 'File uploaded',
        name: filename,
        type: fileType
    });
}

