import React, { useState,useEffect} from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select,
  InputLabel, MenuItem, FormControl, Divider, Grid,IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, KeyboardDatePicker,} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { format } from "date-fns";
import addDays from 'date-fns/addDays';
import DateFnsUtils from '@date-io/date-fns';
import {Row,Col,Container} from 'react-grid-system';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
 import  './LicenseManagement.css';
import { makeStyles } from '@material-ui/core/styles';
import { getSolutionList,getModuleList,getClientList } from './licence-management.service';


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
}));


// const initialState={
//   clientId: " ",
//   clientName:" ",
//    modules: [],
//   moduleName:" ",
//   solutionName:" ",
//   noActUsers: " ",
//   startDate: " ",
//    endDate: " "

// }

// const required = value => (value ? undefined : 'You must select mandatory field')


  export default function AddLicence({ open, options, dialogData }) {
   
    



 
  const classes = useStyles();
   const [dataObj, setDataObj] = useState(dialogData);
   const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [moduleList,setModuleList]=useState([]);
  const [moduleValue,setModuleValue]=useState([]);
  const [solutionList,setSolutionList]=useState([]);
  const [clientList,setClientList]=useState([]);
  
  
   
   

  const closeDialog = () => {
    options.onSubmit(dataObj);
  }
  

    
   const handleChange = (e,value) => {
    
     setDataObj({
      ...dataObj,
       [e.target.name]: e.target.value
     });
     
   }

   const TagChangeClient = (e, values) => {
     console.log(values)

    setDataObj({
      ...dataObj,
      clientName: values,
      clientId:values.clientId
    })
  }


  
  const TagChangeModule = (e, values) => {

      console.log("modules array.... ",values)
         
      setDataObj({
        ...dataObj,
        modules: values
      }) 
  }

  
 
 let modulesMap = [];
 let modulesToPop = [];

  for (let j in moduleList) {
       
    modulesMap.push(moduleList[j].moduleName);
  }

  const TagChangeSol = (e, values) => {

    for (let i in values) {
      values[i]["modules"].forEach((e1) =>
        modulesMap.forEach((e2) => {
          if (e1 === e2) {
            modulesToPop.push(e1);
            console.log("modules.......--", modulesToPop);
            TagChangeModule(e,modulesToPop)
              setModuleValue(modulesToPop);
          } else {
            console.log("false");
          }
        })
      );
    }
   
  const solArr= values.map((item, i)=>
   {
     return item.solutionName
   }
  )
    setDataObj({
      ...dataObj,
      solutionName: solArr,
       modules: modulesToPop
    });

  };


   useEffect(() => {
    getModuleList()
    .then(res=>{
      console.log(res.data.data)
      setModuleList(res.data.data)
      
    })
    .catch(err => {
      setModuleList([]); 
    });
      
    },[]); 



    useEffect(() => {
      getSolutionList()
      .then(res=>{
        setSolutionList(res.data.data)
        console.log(res.data.data)
      })
      .catch(err => {
        setSolutionList([]); 
      });
        
      },[]); 

    

    useEffect(()=>{

      getClientList()
      .then(listData => {
        console.log("table data", listData.data.data)
        setClientList(listData.data.data);
      })
      .catch(err => {
        setClientList([]);
      });

    },[])


    const handleStartDateChange = (date,values) => {
       setStartDate(date);
        // console.log( "Start date..",date)
      
      setDataObj({
          ...dataObj,
            startDate: values
          })
      
    };

    const handleEndDateChange = (date,values) => {
      
       setEndDate(date);
      //  console.log( "End date..",date)

      setDataObj({
            ...dataObj,
            endDate: values
          })
      
    };


  

  

   return (
            <div>
                <Dialog maxWidth={options.maxWidth} disableBackdropClick disableEscapeKeyDown open={open} onClose={options.handleClose} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">{options.titleText}</DialogTitle>
                  <IconButton aria-label="close" className={classes.closeButton} onClick={options.onCancel}>
                    <CloseIcon />
                </IconButton>
                <Divider />
                
                 <ValidatorForm  className={classes.root}  > 
                 <DialogContent >
                   <Container>
                          <Row>
                            <Col sm={6}>
                                  <Autocomplete 
                                          limitTags={2}
                                          size="small"
                                           onChange={TagChangeClient}
                                           value={dataObj.clientName}
                                           name="clientName"
                                           id="multiple-limit-tags"
                                          options={clientList}
                                         getOptionLabel={(option) => option.clientName}
                                          style={{ width: 200 }}
                                          renderInput={(params) => (
                                          <TextField {...params} variant="outlined" label="Client Name*" placeholder="Client Name" name="clientName"  size="small" />
                                          )}
                                      />
                                   </Col>

                                   <Col sm={6}>
                                    <TextValidator id="outlined-basic" type="number" name="noActUsers" autoComplete="off" label="No.of Users*" placeholder="No.of Users" value={dataObj.noActUsers}  onChange={handleChange}  
                                    variant="outlined" size="small"   validators={['isPositive','isNumber' ]}  errorMessages={['This field is required']}   validators={['required']} /> 
                                  
                                 </Col>
                                 </Row>

                                   
                              <Row>
                                  <Col lg={6}  >
                                {/* <FormControl  fullWidth className="mt-2"> */}
                                  <Autocomplete 
                                     multiple
                                    //  limitTags={1}
                                     onChange={TagChangeSol}
                                     value={dataObj.solutionName}
                                     name="solutionName"
                                     size="small"
                                     id="multiple-limit-tags"
                                    options={solutionList}
                                    getOptionLabel={(option) => option.solutionName}
                                    renderInput={(params) => (
                                      <TextField {...params} variant="outlined" label="Solution Name*"   id="outlined-multiline-static"  name="solutionName"   placeholder=" Solution Name"  size="small" className="scroll" />
                                    )}
                                  />
                             {/* </FormControl> */}
                      
                             </Col>
              
                                 <Col lg={6} >
                               {/* <FormControl fullWidth className="mt-2" > */}
                                  <Autocomplete
                                    multiple
                                   onChange={TagChangeModule}
                                   value={moduleValue}
                                        // value={dataObj.modules}
                                   name="modules"
                                    size="small"
                                    id="multiple-limit-tags"
                                    fullWidth
                                    // options={moduleList}
                                    // getOptionLabel={(option) => option.moduleName}
                                     options={moduleList.map((option) => option.moduleName)}
                                    renderInput={(params) => (
                                      <TextField {...params} variant="outlined" label="Module Name*" id="outlined-multiline-static"   name="modules"    placeholder=" Module Name" size="small"  className="scroll"/>
                                    )}
                                  />
                            {/* </FormControl>  */}
                            
                               </Col>
                             </Row>
                                
                                 <Row>
                                   <Col sm={6}>
                                          <MuiPickersUtilsProvider utils={MomentUtils} >
                                            <KeyboardDatePicker
                                            disableToolbar 
                                            variant="outlined"
                                             name="startDate"
                                           onChange={handleStartDateChange}
                                            inputVariant="outlined"
                                            format="DD/MM/YY"
                                            label="Start Date"
                                            required
                                            minDate={(new Date())}
                                          //  valid={dateValid}
                                            value={startDate}
                                           //  onChange={date => setStartDate(date)}
                                            KeyboardButtonProps={{
                                              'aria-label': 'change date',
                                            }}
                                          />
                                        </MuiPickersUtilsProvider>
                                    
                                        </Col>
                                        
                                      <Col sm={6}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                          <KeyboardDatePicker
                                            disableToolbar
                                            variant="outlined"
                                            name="endDate"
                                            onChange={handleEndDateChange}
                                            inputVariant="outlined"
                                            format="DD/MM/YY"
                                            label="End Date"
                                            required
                                           minDateMessage="End Date should be future Date"
                                            value={endDate}
                                             minDate={addDays(new Date(), 1)}
                                          //  maxDate={(new Date())}
                                          //  onChange={date => setEndDate(date)}
                                            KeyboardButtonProps={{
                                              'aria-label': 'change date',
                                            }}
                                          />
                                        </MuiPickersUtilsProvider>
                                        </Col>
                                        </Row>
                                        </Container>
                                    </DialogContent>
                                    
                                    <Divider />
                                    <DialogActions>
                                      {
                                        options.showCancel &&
                                        <Button onClick={options.onCancel} variant="contained">
                                          {options.cancelText}
                                        </Button>
                                      }
                                      {
                                        options.showSubmit &&
                                        <Button  type="submit" onClick={closeDialog} variant="contained" color="primary">
                                          {options.submitText}
                                        </Button>
                                      }
                                    </DialogActions>
                                    </ValidatorForm> 
                                  </Dialog>

                                </div>
                           )
                     }


