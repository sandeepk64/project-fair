import React, { useContext, useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import uploadImg from '../assets/gallery.png';
import SERVER_URL from '../services/serverURL';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { editProjectAPI } from '../services/allAPI';
import { editResponseContext } from '../contexts/ContextAPI';


const Edit = ({project}) => {
  
  const {editResponse,setEditResponse} = useContext(editResponseContext)
  const [imageFileStatus,setImageFileStatus] = useState(true)

  const [projectDetails,setProjectDetails] = useState({
   id:project?._id, title:project?.title,languages:project?.languages,github:project?.github,website:project?.website,overview:project?.overview,projectImg:""
  })


  const [preview,setPreview] = useState("")
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setProjectDetails({id:project?._id,title:project?.title,languages:project?.languages,github:project?.github,website:project?.website,overview:project?.overview,projectImg:""})
  }
  const handleShow = () => {
    setShow(true);
    setProjectDetails({id:project?._id,title:project?.title,languages:project?.languages,github:project?.github,website:project?.website,overview:project?.overview,projectImg:""})
  }

  useEffect(()=>{
    if(projectDetails.projectImg.type=="image/jpeg" || projectDetails.projectImg.type=="image/jpg" || projectDetails.projectImg.type=="image/png"){
      setPreview(URL.createObjectURL(projectDetails.projectImg))
      setImageFileStatus(true)
    }else{
      setImageFileStatus(false)
      setPreview("")
      setProjectDetails({...projectDetails,projectImg:""})
    }
  },[projectDetails.projectImg])

  const handleUpdateProject = async ()=>{
    const {id,title,languages,github,website,overview,projectImg} = projectDetails
    if(title && languages && github && website && overview){
      //api call proceed
      //req-body - add items to form data
      const reqBody = new FormData
      reqBody.append("title",title)
      reqBody.append("languages",languages)
       reqBody.append("overview",overview)
      reqBody.append("github",github)
      reqBody.append("website",website)
      preview?reqBody.append("projectImg",projectImg) : reqBody.append("projectImg",project.projectImg)
       const token = sessionStorage.getItem("token")
        if(token){
          const reqHeader = {
            "Content-Type": preview?"multipart/form-data":"application/json",
            "Authorization": `Bearer ${token}`
          }
          //api call
          try{
           const result = await editProjectAPI(id,reqBody,reqHeader)
           console.log(result);
           if(result.status==200){
            handleClose()
            //pass response view
            setEditResponse(result)
           }else{
            console.log(result.response);
           }
          }catch(err){
            console.log(err);
          }
        }
    }else{
      toast.warning("Please fill the form completely!!!")
    }
  }


  return (
    <>
    <button onClick={handleShow} className='btn'><i className="fa-solid fa-edit"></i></button>

    <Modal size='lg' centered show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Update Project Details!!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row align-items-center">
            <div className="col-lg-4">
              <label>
                <input type="file" style={{display:'none'}} 
                onChange={e=>setProjectDetails({...projectDetails,projectImg:e.target.files[0]})}
                />
                <img height ={'200px'} className='img-fluid' src={preview?preview:`${SERVER_URL}/uploads/${project?.projectImg}`} alt="" />
              </label>
              { !imageFileStatus && <div className="text-warning fw-bolder my-2">
                *Upload only the following file types (jpeg, jpg, png) here!!
              </div>}
            </div>
            <div className="col-lg-8">
              <div className="mb-2">
                <input type="text" className='form-control' placeholder='Project tilte' 
                value={projectDetails.title}
                onChange={e=>setProjectDetails({...projectDetails,title:e.target.value})}/>
              </div>
              <div className="mb-2">
                <input type="text" className='form-control' placeholder='Languages used in Project'
                value={projectDetails.languages}
                onChange={e=>setProjectDetails({...projectDetails,languages:e.target.value})}
                />
              </div>
              <div className="mb-2">
                <input type="text" className='form-control' placeholder='Project Github Link' 
                value={projectDetails.github}
                onChange={e=>setProjectDetails({...projectDetails,github:e.target.value})}
                />
              </div>
              <div className="mb-2">
                <input type="text" className='form-control' placeholder='Project Website Link' 
                value={projectDetails.website}
                onChange={e=>setProjectDetails({...projectDetails,website:e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="mb-2">
                <input type="text" className='form-control' placeholder='Project Over View' 
                value={projectDetails.overview}
                onChange={e=>setProjectDetails({...projectDetails,overview:e.target.value})}
                />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CANCEL
          </Button>
          <Button onClick={handleUpdateProject} variant="primary">UPDATE</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position='top-center' theme='colored' autoclose={3000}/>
    </>
  )
}

export default Edit