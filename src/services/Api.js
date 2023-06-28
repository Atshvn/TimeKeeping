import axios from 'axios';
import Axios from 'axios'
import axiosClient from './axiosClient';
import PostImages from './PostImagesAPI';
import TimeKeeping from './TimeKeepingAPI';

export const API_DOMAIN = 'https://api-v4-erp.vps.vn/api/ApiMain'
export const IMAGES_DOMAIN = 'https://mediaimages.vps.vn'
// const API_DOMAIN = 'http://api-v4-erp.chuyenphatnhanh.vn/api' // Test

const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
}

export const callApi = {
    Main : ( data) => {
        return axiosClient.post('/API_spCallServer', data );
    },
    PostImages : ( data) => {
        return PostImages.post('/API_spCallPostImage_TimeKeeping', data , config);
    },
    UploadFile : ( data) => {
        return PostImages.post('/API_spCallPostImage_NonResizeImage', data, config );
    },
    Upload : ( data) => {
        return PostImages.post('/API_spCallPostImage', data, config );
    }
}

export const callApiTimeKeeping = {
    Main: (data) => {
        return TimeKeeping.post('', data);
    }
}





export const DecryptAndEncrypt = {
    DecryptString : ( data) => {
        return axiosClient.post('/DecryptString', data );
    },
    EncryptString : ( data) => {
        return axiosClient.post('/EncryptString', data );
    }
}

 


