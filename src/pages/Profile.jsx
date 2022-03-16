import {getAuth, updateProfile} from 'firebase/auth'

import {updateDoc, doc, collection,query,where,orderBy,deleteDoc, getDocs} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import ListingItem from '../components/ListingItem'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'



function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const[listings,setListings] = useState(null)
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

  useEffect(()=>{
      const fetchUserListings= async()=>{
        const listingsRef = collection(db,'listings')
        const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid),orderBy('timestamp','desc'))
        const querySnap = await getDocs(q)
        
        let listings = []

        querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data: doc.data()
          })
        })

        setListings(listings)
        setLoading(false)
      }

      fetchUserListings()
  },[auth.currentUser.uid])

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

  const onDelete=async (listingId)=>{
    if(window.confirm('Are you sure you want to delete this listing?')){
      await deleteDoc(doc(db,'listings', listingId))
      const updatedListings = listings.filter((listing)=> listing.id !==listingId)
      setListings(updatedListings)
      toast.success('Listing successfully deleted')
    }
  }

  const onEdit=(listingId)=>{
    navigate(`/edit-listing/${listingId}`)
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
     <Link to='/create-listing' className='createListing'>
       <img src={homeIcon} alt="home" />
       <p>Sell or rent your home</p>
       <img src={arrowRight} alt="arrow right" />
     </Link>
     {!loading && listings?.length > 0  &&(
       <>
        <p className='listingText'>Your Listings</p>
        <ul className="listingsList">
          {listings.map((listing)=>(
            <ListingItem key={listing.id} 
            listing={listing.data}
            id={listing.id}
            onDelete={()=>onDelete(listing.id)}
            onEdit={()=>onEdit(listing.id)}/>
          ))}
        </ul>
       </>
     )}
   </main>
 </div>
  }
  
  export default Profile