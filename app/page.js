"use client";
import SideNavBar from "../components/SideNavBar";
import SearchBar from "../components/SearchBar";
import CategoryList from "../components/CategoryList";
import BusinessList from "../components/BusinessList";
import GlobalApi from "../services/GlobalApi";
import { useContext, useEffect, useState } from "react";
import GoogleMap_ from "../components/GoogleMap_";
import { BusinessListContext } from "../context/BusinessListContext";
import { UserLocationContext } from "../context/UserLocationContext";
import { SelectedBusinessContext } from "../context/SelectedBusinessContext";
import BusinessToast from "../components/BusinessToast";

export default function Home() {
  const [ userLocation, setUserLocation ] = useState();

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Lokasi pengguna berhasil diperoleh:", latitude, longitude);
            setUserLocation({ lat: latitude, lng: longitude });
            console.log(userLocation)
          },
          (error) => {
            console.error("Gagal mendapatkan lokasi:", error);
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error("Pengguna menolak permintaan geolokasi.");
                break;
              case error.POSITION_UNAVAILABLE:
                console.error("Informasi lokasi tidak tersedia.");
                break;
              case error.TIMEOUT:
                console.error("Permintaan lokasi melebihi batas waktu.");
                break;
              default:
                console.error("Terjadi kesalahan yang tidak diketahui.");
            }
            // Fallback lokasi default
            setUserLocation?.({ lat: -6.200000, lng: 106.816666 }); // Jakarta, Indonesia
          }
        );
      } else {
        console.error("Geolokasi tidak didukung oleh browser ini.");
        // Fallback lokasi default
        setUserLocation?.({ lat: -6.200000, lng: 106.816666 }); // Jakarta, Indonesia
      }
    };
  
    // Panggil fungsi untuk mendapatkan lokasi jika belum disetel
    if (!userLocation) {
      getLocation();
    }
  }, [userLocation, setUserLocation]);
  
  
  return (
    <UserLocationContext.Provider value={{ userLocation }}>
      <App/>
    </UserLocationContext.Provider>
  );
}

function App() {
  const [businessList,setBusinessList]=useState([]);
  const [selectedBusiness,setSelectedBusiness]=useState([]);

  const { userLocation } = useContext(UserLocationContext);

  useEffect(()=>{
    if(userLocation)
      getNearByPlace('restaurant');
    
   
  },[userLocation])

  const getNearByPlace=(category)=>{
    GlobalApi.getNearByPlace(category,userLocation?.lat, userLocation.lng)
    .then(resp=>{
      setBusinessList(resp.data)
    })
  }
  
  return (
      <div className="flex">
        <SelectedBusinessContext.Provider value={{selectedBusiness,setSelectedBusiness}}>
        <BusinessListContext.Provider value={{businessList,setBusinessList}}>
        <SideNavBar />
        <div className="grid grid-cols-1
        md:grid-cols-2 px-6 md:px-10 w-full mt-10 gap-8">
        
          <div>
            {/* Search Bar  */}
            <SearchBar/>
            {/* Category List  */}
            <CategoryList setSelectedCategory={(category)=>
              getNearByPlace(category)} />
            {/* Business List */}
            <BusinessList businessListData={businessList} />
          </div>

          {/* Google Map */}
          <div className="order-first md:order-last">
            <GoogleMap_/>
            <BusinessToast userLocation={userLocation} />
          </div>
        </div>
        </BusinessListContext.Provider>
        </SelectedBusinessContext.Provider>
      </div>
  );
}
