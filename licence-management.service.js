import axios from 'axios';


const  ApiUrl='https://stg-api.dfoundry.ai'

  
let headers = {
  'Authorization': 'ffcb407e-5f01-445c-8b1a-796884f922b9',
  'Content-Type': 'application/json',
  

}

  
export const createLicence = (data) => {
  return axios.post(`${ApiUrl}/license/create`, data, { headers: headers })
}

export const getUpdateLicenceStatus = (data) => {
  return axios.post(`${ApiUrl}/license/status`, data, { headers: headers })
}


export const getListLicence = (data) => {
  return axios.post(`${ApiUrl}/license/list`, data, { headers: headers })
}

export const getModuleList =(data)=>{
  return axios.post(`${ApiUrl}/module/list`,data,{headers:headers})
}

export const getSolutionList = (data) =>{
  return axios.post(`${ApiUrl}/solution/list`,data,{headers:headers})
}

export const getClientList =(data)=>{
   return axios.post(`${ApiUrl}/client/list`,data,{headers:headers})
}




