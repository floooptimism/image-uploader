import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'

import DropImage from '../components/DropImage/DropImage';
import { Line } from 'rc-progress';
import { useSnackbar } from 'react-simple-snackbar'

const STATE_NONE = 0;
const STATE_UPLOADING = 1;
const STATE_UPLOADED = 2;

export default function Home() {
    const [openSnackbar, closeSnackbar] = useSnackbar()
    
   

    const axios = require("axios");
    const [appState, setAppState] = useState(STATE_NONE)
    const [percentageProgress, setPercentageProgress] = useState(0);

    const [uploadedImage, setUploadedImage] = useState('');
    const [uploadedLink, setUploadedLink] = useState('');
    
    const maxProg = Math.random() * 10 + 85;

    function uploadProgress(progressEvent){
        setPercentageProgress(progressEvent.total / progressEvent.loaded * maxProg);
    }

    // axios paramters
    const config={
        method: "post",
        url: "/api/upload",
        headers: {
            'Content-Type': "multipart/form-data"
        },
        onUploadProgress: uploadProgress
    }


    function fileDrop(ev){
        ev.preventDefault();

        ev.target.style.backgroundColor = "";

        if(ev.dataTransfer.items.length == 1){
            if(ev.dataTransfer.items[0].kind === 'file'){
                let file = ev.dataTransfer.items[0].getAsFile();
                uploadFile(file);
            }
        }
    }


    function fileChange(ev){
        if(ev.target.files.length > 0){
            uploadFile(ev.target.files[0]);
        }
    }

    function setFileAsImageSource(file){
        // setUploadedImage(URL.createObjectURL(file));
        const reader = new FileReader();
        reader.onloadend = () => {
            // log to console
            // logs data:<type>;base64,wL2dvYWwgbW9yZ...
            setUploadedImage(reader.result);
        };
        reader.readAsDataURL(file);
    }

    async function copyToClipboard(){
        await navigator.clipboard.writeText(uploadedLink)
        openSnackbar("✅  Copied to Clipboard.");
    }

    async function uploadFile(file){
        if(file.type.match("image")){
            setFileAsImageSource(file);
            let formdata = new FormData();
            formdata.append("image", file);
            config.data = formdata;
            console.log(config);
            try{
                setAppState(STATE_UPLOADING);
                let res = await axios(config);
                if(res.data.status){
                    setPercentageProgress(100);
                    setFileAsImageSource(file);
                    setAppState(STATE_UPLOADED);
                    setUploadedLink(res.data.link)
                }else{
                    openSnackbar("❌  Upload failed. Please try again.");
                    setAppState(STATE_NONE);
                    setPercentageProgress(0);
                }
        
            }catch(err){
                console.log(err);
            }
        }
    }

    const FOOTER = (
        <div className="mt-8 font-semibold p-3 text-center w-full" style={{color: '#A9A9A9'}}>
            <h1>created by <a href="https://github.com/floooptimism" target="_blank" rel="noreferrer" className="underline">floooptimism</a> · devChallenges.io</h1>
        </div>
    )

    const NONE_PAGE = (
        <>
        <div className={`w-full sm:w-5/6 md:w-1/3 bg-white mx-auto rounded p-8 mt-16 ${styles.content} text-center`}>
            <h1 className={`text-2xl font-semibold ${styles.header} mb-6`}>Upload your image</h1>
            <p className={`${styles.secondary} text-sm font-semibold mb-8`}>File should be Jpeg, Png,...</p>
            <DropImage drop={fileDrop}></DropImage>
            
            <p className={`hidden md:block font-semibold my-8 mb-10`} style={{color: "#BDBDBD"}}>Or</p>

            <form>
                <label htmlFor="file" className={`${styles.button} p-3`}>Choose a file</label>
                <input id="file" className="hidden" type="file" onChange={fileChange}/>
            </form>
            
        </div>
        {FOOTER}
        </>
        
    )

    const UPLOADING_PAGE = (
        <div className={`w-full sm:w-5/6 md:w-1/3 bg-white mx-auto rounded p-8 mt-40 ${styles.content}`}>
            <div className="flex justify-between">
            <h1 id="upload_text" className="mb-4 font-semibold text-lg" style={{color: '#4F4F4F'}}>Uploading...</h1>
            <p className="font-semibold " style={{color: '#4F4F4F'}}>{parseInt(percentageProgress)}%</p>
            </div>
            <Line percent={parseInt(percentageProgress)} strokeWidth="1" strokeColor="#2F80ED" trailColor="#F2F2F2"/>  
        </div>
    )

    const UPLOADED_PAGE = (
        <div className={`w-full sm:w-5/6 md:w-1/3 bg-white mx-auto rounded p-8 mt-20 text-center ${styles.content}`}>
            <svg style={{fill: "#219653"}} className="mx-auto" xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 512 512"><title>ionicons-v5-e</title><path d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48ZM364.25,186.29l-134.4,160a16,16,0,0,1-12,5.71h-.27a16,16,0,0,1-11.89-5.3l-57.6-64a16,16,0,1,1,23.78-21.4l45.29,50.32L339.75,165.71a16,16,0,0,1,24.5,20.58Z"/></svg>
            <h1 className="font-semibold text-2xl mt-4" style={{color: "#4F4F4F"}}>Uploaded Successfully!</h1>
            <div className="w-full h-96 relative my-8">
                {uploadedImage && <Image src={uploadedImage} alt="uploaded image" layout="fill" className="mx-auto my-8 rounded-lg"/>}
            </div>
            <div className="relative">
                <input type="text" value={uploadedLink} className={`${styles.uploaded_resultlink} px-2 py-3 w-full font-semibold`} readOnly></input>
                <button className="absolute right-1 h-5/6 top-1 px-3 py-2 text-white rounded-lg" style={{backgroundColor: "#2F80ED"}} onClick={copyToClipboard}>Copy Link</button>
                
            </div>

            {/* <button className="p-3 bg-gray-700 text-white rounded-lg mt-12 font-semibold">Upload another Image</button> */}
            <a className="text-gray-500 underline font-semibold" href="#" onClick={()=>{setAppState(STATE_NONE)}}><p className="mt-12">Upload another image</p></a>

        </div>
    )

        return (
            <div>
                <Head>
                    <title>Image Uploader</title>
                </Head>
                <div>
                    {appState === STATE_NONE && NONE_PAGE ||
                    appState === STATE_UPLOADED && UPLOADED_PAGE ||
                    appState === STATE_UPLOADING && UPLOADING_PAGE}
                </div>

            
            </div>
        )
    
}
