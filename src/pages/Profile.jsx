import {getAuth, updateProfile} from 'firebase/auth'
import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'



function Profile() {
  const auth = getAuth()
  const[changeDetails, setChangeDetails] = useState(false)
  const [formData,setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const{name,email}  = formData

  const navigate = useNavigate()

  const onLogOut = ()=>{
    auth.signOut()
    navigate('/')
  }

  const onSubmit=async()=>{
    try {
      if(auth.currentUser.displayName !== name){
        //Update displayname in FireBase
        await updateProfile(auth.currentUser,{
          displayName:name,
        })
        //Update in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef,{
          name,
        })
      }
    } catch (error) {
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value,
    }))
    
  }
  
 return <div className='profile'>
   <header className='profileHeader'>
     <p className="pageHeader">My Profile</p>
     <button className="logOut" type='button' onClick={onLogOut}>Log Out</button>
   </header>
   <main>
     <div className="profileDetailsHeader">
       <p className="ProfileDetailsText">Personal details</p>
       <p className="changePersonalDetails" 
          onClick={()=>{
            changeDetails && onSubmit()
            setChangeDetails ((prevState)=>!prevState)
          }}>
          {changeDetails ? 'Done' : 'Change'}
        </p>
     </div>
     <div className="profileCard">
       <form>
         <input type="text" 
                id='name'
                className={!changeDetails ? 'profileName' : 'profileNameActive'}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}/>
         <input type="text" 
                id='email'
                className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
                />
       </form>
     </div>
   </main>
 </div>
  }
  
  export default Profile