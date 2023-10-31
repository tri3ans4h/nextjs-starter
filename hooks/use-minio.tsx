//REFERENCE
//https://github.com/harshavardhana/minio-js-browser-upload/blob/master/index-post.html
//https://github.com/tx7do/minio-typescript-example/blob/main/react-app/src/util/put_upload.ts



import { useContext, useState } from "react";

//import { makeAPIRequest } from "./base";

type APICreateUpload = {
    key: string;
    presigned_upload_url: string;
};

async function getPresignedUrl(file: File): Promise<APICreateUpload> {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/minio/presignedUrl?name=' + file.name, {
        method: 'GET',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })

    return await response.json()
}

function uploadFile(
    file: File,
    presignedUploadUrl: string,
    onProgress: (pct: number) => void,
) {
    return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
                const pct = e.loaded / e.total;
                onProgress(pct * 100);
            }
        });
        xhr.upload.addEventListener("error", (e) => {
            reject(new Error("Upload failed: " + e.toString()));
        });
        xhr.upload.addEventListener("abort", (e) => {
            reject(new Error("Upload aborted: " + e.toString()));
        });
        xhr.addEventListener("load", (e) => {
            if (xhr.status === 200) {
                resolve();
            } else {
                reject(new Error("Upload failed " + xhr.status));
            }
        });
        xhr.open("PUT", presignedUploadUrl, true);
        try {
            xhr.send(file);
        } catch (e: any) {
            reject(new Error("Upload failed: " + e.toString()));
        }
    });
}

/**
 * @description
 * belum diperbaiki
 * buggy
 * 
 * @param file 
 * @param presignedUploadUrl 
 * @param onProgress 
 * @returns 
 */
function uploadPostFile(
    file: File,
    presignedUploadUrl: string,
    onProgress: (pct: number) => void,

) {
    return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
                const pct = e.loaded / e.total;
                onProgress(pct * 100);
            }
        });
        xhr.upload.addEventListener("error", (e) => {
            reject(new Error("Upload failed: " + e.toString()));
        });
        xhr.upload.addEventListener("abort", (e) => {
            reject(new Error("Upload aborted: " + e.toString()));
        });
        xhr.addEventListener("load", (e) => {
            if (xhr.status === 200) {
                resolve();
            } else {
                reject(new Error("Upload failed " + xhr.status));
            }
        });
        xhr.open("POST", presignedUploadUrl, true);
        try {
            xhr.send(file);
        } catch (e: any) {
            reject(new Error("Upload failed: " + e.toString()));
        }
    });
}

export function useUpload() {
    const [uploadState, setUploadState] = useState<
        "idle" | "starting" | "uploading" | "finishing" | "done" | "error"
    >("idle");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<Error | null>(null);

    return {
        uploadState,
        uploadProgress,
        uploadError,
        upload: async (
            file: File,
            onSuccess: (uploadKey: string) => Promise<void>,
        ) => {
            if (uploadState !== "idle") {
                throw new Error("Already uploading");
            }

            setUploadState("starting");
            setUploadProgress(0);
            setUploadError(null);

            try {
                const { key, presigned_upload_url } = await getPresignedUrl(file);
                setUploadState("uploading");
                await uploadFile(file, presigned_upload_url, (pct) => {
                    setUploadProgress(pct);
                });
                setUploadState("finishing");
                setUploadState("done");
                await onSuccess(key);
            } catch (e: any) {
                setUploadState("error");
                setUploadError(e);
            }
        },
        setUploadState
    };
}



/*
PUT - server

var Minio = require('minio');

var client = new Minio.Client({
    endPoint: 'play.minio.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
})

// express is a small HTTP server wrapper, but this works with any HTTP server
const server = require('express')()

server.get('/presignedUrl', (req, res) => {
    // Construct a new postPolicy.
    var policy = client.newPostPolicy()
    // Set the object name my-objectname.
    policy.setKey(req.query.name)
    // Set the bucket to my-bucketname.
    policy.setBucket('uploads')

    var expires = new Date
    expires.setSeconds(24 * 60 * 60 * 10) // 10 days expiry.
    policy.setExpires(expires)
    client.presignedPostPolicy(policy, function(e, urlStr, formData) {
        if (e) throw e
        res.end(JSON.stringify({urlStr, formData}))
    })
})

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index-post.html');
})

server.listen(8080)


PUT - client

function upload() {
    [$('#selector')[0].files].forEach(fileObj => {
      var file = fileObj[0]
      // Retrieve a URL from our server.
      retrieveNewURL(file, url => {
        // Upload the file to the server.
        uploadFile(file, url)
      })
    })
  }
 
  // Request to our Node.js server for an upload URL.
  function retrieveNewURL(file, cb) {
    $.get(`/presignedUrl?name=${file.name}`, (url) => {
      cb(url)
    })
  }
 
  // Use XMLHttpRequest to upload the file to S3.
  function uploadFile(file, url) {
      var xhr = new XMLHttpRequest ()
      xhr.open('PUT', url, true)
      xhr.send(file)
      xhr.onload = () => {
        if (xhr.status == 200) {
          $('#status').text(`Uploaded ${file.name}.`)
        }
      }
  }
  */

  /*

  POST - SERVER
  var Minio = require('minio');

var client = new Minio.Client({
    endPoint: 'play.minio.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
})

// express is a small HTTP server wrapper, but this works with any HTTP server
const server = require('express')()

server.get('/presignedUrl', (req, res) => {
    // Construct a new postPolicy.
    var policy = client.newPostPolicy()
    // Set the object name my-objectname.
    policy.setKey(req.query.name)
    // Set the bucket to my-bucketname.
    policy.setBucket('uploads')

    var expires = new Date
    expires.setSeconds(24 * 60 * 60 * 10) // 10 days expiry.
    policy.setExpires(expires)
    client.presignedPostPolicy(policy, function(e, urlStr, formData) {
        if (e) throw e
        res.end(JSON.stringify({urlStr, formData}))
    })
})

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index-post.html');
})

server.listen(8080)

POST - CLIENT

  function upload() {
   [$('#selector')[0].files].forEach(fileObj => {
     var file = fileObj[0]
     // Retrieve a URL from our server.
     retrieveNewURL(file, obj => {
       // Upload the file to the server.
       uploadFile(file, obj)
     })
   })
 }

 // Request to our Node.js server for an upload URL.
 function retrieveNewURL(file, cb) {
   $.get(`/presignedUrl?name=${file.name}`, (obj) => {
     cb(obj)
   })
 }

 // Use XMLHttpRequest to upload the file to S3.
 function uploadFile(file, obj) {
     var xhr = new XMLHttpRequest ()
     var objSon = JSON.parse(obj);
     xhr.open('POST', objSon.urlStr.postURL, true);

     var fd = new FormData();
     Object.entries(objSon.urlStr.formData).forEach(([key, value]) => {
         fd.append(key, value);
     });

     fd.append('file', file);
     xhr.send(fd);

     xhr.onload = () => {
       if (xhr.status == 204) {
         $('#status').text(`Uploaded ${file.name}.`)
       }
     }
 }

 */