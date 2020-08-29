// Components import
import React, { useState, useEffect } from 'react';
import { React15Tabulator, reactFormatter } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import AddLicence from './AddLicence';
 import UpdateStatus from './UpdateStatus';
 import './LicenseManagement.css'
import { getListLicence, createLicence,getUpdateLicenceStatus ,getModuleList } from './licence-management.service';
import { useToasts } from "react-toast-notifications";

const initialState = {
     licenseId:'',
    clientId: ' ',
    clientName:' ',
    moduleName:' ',
    solutionName:' ',
    startDate:null,
    endDate: null,
     modules:'',
    noActUsers:' ',
    status:' '
}



const options = {
  movableColumns: true,
  // movableRows: true,
  // groupBy:"role",
  pagination: "local",
  paginationSize: 10,
  borderColor: '#000',
  rowBorderColor: '#000',
  headerBorderColor: '#000'
}


   function LicenceManagement() {



 
  const [licenceList,setLicenceList]=useState([]);
  const [moduleList , setModuleList] = useState([]);
  const [modVal,setModVal]=useState([]);
  const [createdLicence,setCreatedLicence]=useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogStatus,setshowDialogStatus]=useState(false);
  const [status,setStatus]=useState([]);
  const [dialogData, setDialogData] = useState(initialState);
   const { addToast } = useToasts()
     // const [editDialog, setEditDialog] = useState(false);
    //   const [editData, setEditData] = useState(initialState);
  const [dialogOptions, setDialogOptions] = useState({
    maxWidth: 'sm',
    showTitle: true,
    showCancel: true,
    showSubmit: true,
    titleText: 'Create Licence',
    submitText: 'Submit',
    cancelText: 'Cancel',
    onCancel: '',
    onSubmit: ''
  });


  const GreenSwitch = withStyles({
    switchBase: {
      color: green[30],
      '&$checked': {
        color: green[800],
      },
      '&$checked + $track': {
        backgroundColor: green[900],
      },
    },
    checked: {},
    track: {},
  })(Switch);


  const Status=(props)=>{
    const rowData = props.cell._cell.row.data;
    return(
     <div className=" d-flex justify-content-center">
       <FormControlLabel
         control={
           <GreenSwitch
               size="small"
               defaultChecked={rowData.status==="active"? true : false}
               value={rowData.status}
              //  onChange={handle}
               color="primary"
               name="status"
               inputProps={{ 'aria-label': 'primary checkbox' }}
           />
         }
        //  label={rowData.status}
       />
       </div>
     )

 }

  

  
  const userColumns = [
    { title: 'Licence ID', field: 'licenseId', type: 'numeric' ,headerFilter: "input"},
    { title: 'Client Name', field: 'clientName', headerFilter: "input"},
    { title: 'Solution', field: 'solutionName',headerFilter: "input"},
    { title: 'Module', field: 'modules',headerFilter: "input"},
    { title: 'Start Date', field: 'startDate',headerFilter: "input", hozAlign:"center"},
    { title: 'End Date', field: 'endDate',headerFilter: "input", hozAlign:"center"},
    { title: 'Active Users', field: 'noActUsers',headerFilter: "input", hozAlign:"center"},
   
    { title: 'Status', field: 'status',headerSort:false,
    
      cellClick: (e, value) => {
        setDialogOptions({
          ...dialogOptions,
          titleText: "Update Status",
          submitText: "Update",
          onCancel: handleCloseStatus,
          onSubmit: handleStatus
        });
        setDialogData(value._cell.row.data)
        setshowDialogStatus(true);
        console.log("Licence:-", value._cell.row.data['status']);
        if (value._cell.row.data['status'] == "active") {
          setDialogData(value._cell.row.data['status'] = "inactive")
        } 
        else {
          setDialogData(value._cell.row.data['status'] = "active")
        }

      },
      formatter: reactFormatter(
        <Status />
      )
    

    },
    
  ];
  
  

  const handleStatus=(data)=>{
    getUpdateLicenceStatus(data)
    .then(statusData=>{
      console.log("staus has been success",statusData.data.data)
      setStatus(statusData.data.data)
      setshowDialogStatus(false)
    })

    .catch(err => {
      console.log("Error while handling status: ", err);
      setStatus([]);
    });
  }
   
  const handleCloseStatus=()=>{
    setshowDialogStatus(false);
   return getListLicenceData();

  }

  const handleClose = () => {
    setShowDialog(false);
  };


  const toast = (toastName) => {
    addToast(`Record ${toastName} Successfully`, {
      appearance: "success",
      autoDismiss: true,
      pauseOnHover: true,
    });
  };



  const handleSubmit = (data, event) => {
    createLicence(data)
    .then((createdData) => {
      if (createdData.data.statusCode == "200") {
        setShowDialog(false);
        toast("Submitted");
        return getListLicenceData();
      }
    })
    .catch(() => {
      setLicenceList([]);
    });
  };

  
  const getListLicenceData = () => {
    getListLicence()
      .then((listData) => {
        console.log("Licence table data", listData.data.data);
        if (listData.data.statusCode == "200") {
          var dt = listData.data.data;
          getModuleList()
            .then((moduleData) => {
              var data = moduleData.data.data;
              console.log("Module table data ", data);
              for (let i in data) {
                for (let j in dt) {
                  if (dt[j].licenseId === data[i].licenseId) {
                    dt[j].moduleName = data[i].moduleName;
                  }
                }
              }
              setLicenceList(listData.data.data);
            })
            .catch(() => {
              setModuleList([]);
            });
        }
      })
      .catch(() => {
        setLicenceList([]);
      });
  };



  useEffect(() => {

    getListLicenceData()
    
  }, []);


  // const handClose=()=>{
  //   setEditDialog(false)
  // }
   






  

  // const  edithandleClose = () => {
  //   setEditDialog(false);
  // };


  const openAddUser = () => {
    setDialogOptions({
      ...dialogOptions,
      titleText: "Create Licence",
          submitText: "Create",
        
      onCancel: handleClose,
      onSubmit: handleSubmit
    });
    setDialogData(true);
    setShowDialog(true);
  }

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary m-2">
                <div className="card-header d-flex justify-content-center">
                  <h3 className="card-title text-center">Licence Details</h3>
                </div>
                <div className="card-body">
                  {/*  AddUser  */}
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-primary btn-sm" onClick={openAddUser}>Create Licence</button>
                   
                  </div>
                  <div className="mt-3">
                  <Divider />
                  </div>

                  {
                    showDialog &&
                    <AddLicence open={showDialog} options={dialogOptions} dialogData={dialogData}  />
                  }
                     {
                      showDialogStatus &&
                    <UpdateStatus open={showDialogStatus} options={dialogOptions} dialogData={dialogData} />
                    }   
                  <div className="react-table">
                    <React15Tabulator columns={userColumns} data={licenceList} options={options} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LicenceManagement;