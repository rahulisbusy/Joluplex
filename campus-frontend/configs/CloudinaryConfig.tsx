import { Cloudinary } from "@cloudinary/url-gen";

export const cld=new Cloudinary(
    {
        cloud:{
            cloudName: process.env.EXPO_CLOUD_NAME,
            apiKey:process.env.EXPO_CLOUD_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET,
        },
        url:{
            secure:true
        }
    }
)
export const options={
    upload_preset:"joluplex",
    tag:"sample",
    unsigned:true

}