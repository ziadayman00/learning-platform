// lib/uploadthing.ts
import { OurFileRouter } from "@/app/api/uploadThing/core";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";


export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();