import styles from './DropImage.module.css'
import { useState } from 'react';
import Image from 'next/image'

export default function DropImage(props){
    const [draggingOver, setDraggingOver] = useState(false);
    const [overlay, setOverlay] = useState(false);

    function dragOverHandler(ev){
        ev.preventDefault();
        setOverlay(true);
    }

    function dragEndHandler(ev){
        ev.preventDefault();
        setOverlay(false);
    }

    function dragLeaveHandler(ev){
        ev.preventDefault();
        setOverlay(false);
    }

    return (
        <>
            <div className={`hidden md:block ${styles.drop_image} p-8 relative`} onDrop={props.drop} onDragOver={dragOverHandler} onDragEnd={dragEndHandler} onDragLeave={dragLeaveHandler}>
                <Image width={150} height={150} className="mx-auto text-center" src="/upload.svg"/>
                <p className={`text-center font-semibold ${styles.text} mt-12`}>Drag & Drop your image here</p>
                <div className={`absolute w-full h-full flex transition-opacity duration-150 ease justify-center items-center bg-gray-500 top-0 left-0 rounded-lg bg-opacity-80 ${overlay ? 'opacity-100' : 'opacity-0'}`}>
                    <h1 className="text-2xl text-white font-semibold">Drop image here</h1>
                </div>

            </div>
        </>
    )
}   