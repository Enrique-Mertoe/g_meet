import {FileInfo} from "@/root/GTypes";
import {toBlob} from "@/root/utility";

export default function AlbumThumb({files}: {
    files: FileInfo[]
}) {
    const imageSrc = "https://images.unsplash.com/photo-1505388763672-ee96ba65bac8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=aa2b17198c95694b3f90d9e8681d66bc&auto=format&fit=crop&w=1950&q=80";
    const [img1, img2, img3, ...rest] = files
    return (
        files.length > 0 &&
        <div className="album-thumb">
            <div className="thumb-container">
                <div className="images-container">
                    <img className="thumb-image" src={toBlob(img1.data as ArrayBuffer)} alt="Thumb 1"/>
                    {
                        img2 && img2.data &&
                        <img className="thumb-image" src={toBlob(img2.data as ArrayBuffer)} alt="Thumb 2"/>
                    }
                    {
                        img3 && img3.data &&
                        <img className="thumb-image" src={toBlob(img3.data as ArrayBuffer)} alt="Thumb 3"/>
                    }
                </div>
                {
                    rest.length &&
                    <div className="photo-count">
                        <div className="content">
                            <div className="number font-bold">+{rest.length}</div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export {
    AlbumThumb
}