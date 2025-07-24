// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { Camera, Mail, User } from "lucide-react";
// import toast from "react-hot-toast";

// const ProfilePage = () => {
//   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
//   const [selectedImg, setSelectedImg] = useState(null);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = async () => {
//       setSelectedImg(reader.result);
//       try {
//         await updateProfile({ profilePic: reader.result });
//       } catch (error) {
//         toast.error("Failed to upload image");
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-2xl mx-auto px-4">
//         <div className="card p-8 space-y-8">
//           {/* Header */}
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
//             <p className="mt-2 text-gray-600">Your profile information</p>
//           </div>

//           {/* Avatar Upload Section */}
//           <div className="flex flex-col items-center gap-4">
//             <div className="relative">
//               <img
//                 src={selectedImg || authUser?.profilePic || "/avatar.png"}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//               />
//               <label
//                 htmlFor="avatar-upload"
//                 className={`absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 ${
//                   isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
//                 }`}
//               >
//                 <Camera className="w-5 h-5 text-white" />
//                 <input
//                   type="file"
//                   id="avatar-upload"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   disabled={isUpdatingProfile}
//                 />
//               </label>
//             </div>
//             <p className="text-sm text-gray-500">
//               {isUpdatingProfile
//                 ? "Uploading..."
//                 : "Click the camera icon to update your photo"}
//             </p>
//           </div>

//           {/* User Information */}
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <div className="text-sm text-gray-500 flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 Username
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                 {authUser?.username || "N/A"}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="text-sm text-gray-500 flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 Email Address
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                 {authUser?.email || "N/A"}
//               </div>
//             </div>
//           </div>

//           {/* Account Information */}
//           <div className="bg-gray-50 rounded-xl p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">
//               Account Information
//             </h2>
//             <div className="space-y-3 text-sm">
//               <div className="flex items-center justify-between py-2 border-b border-gray-200">
//                 <span className="text-gray-600">Member Since</span>
//                 <span className="font-medium text-gray-900">
//                   {authUser?.createdAt
//                     ? new Date(authUser.createdAt).toLocaleDateString()
//                     : "N/A"}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between py-2">
//                 <span className="text-gray-600">Account Status</span>
//                 <span className="text-green-600 font-medium">Active</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;



import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    city: "",
    country: "",
    relationship: "",
    dateOfBirth: "",
  });

  // Load existing user data into form
  useEffect(() => {
    if (authUser) {
      setFormData({
        username: authUser.username || "",
        email: authUser.email || "",
        city: authUser.city || "",
        country: authUser.country || "",
        relationship: authUser.relationship || "",
        dateOfBirth: authUser.dateOfBirth || "",
      });
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      setSelectedImg(reader.result);
      try {
        await updateProfile({ avatar: reader.result });
        toast.success("Profile photo updated");
      } catch (error) {
        toast.error("Failed to upload image");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const dataToUpdate = {
        ...formData,
        avatar: selectedImg || authUser?.avatar,
      };
      await updateProfile(dataToUpdate);
    } catch (error) {
      toast.error("Profile update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card p-8 space-y-8 bg-white shadow rounded-xl">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your profile information
            </p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.avatar || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            {[
              { label: "Username", name: "username" },
              { label: "Email", name: "email" },
              { label: "City", name: "city" },
              { label: "Country", name: "country" },
              { label: "Relationship", name: "relationship" },
              { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name} className="space-y-1">
                <label className="text-sm text-gray-500">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>

          {/* Update Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={isUpdatingProfile}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </div>

          {/* Account Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium text-gray-900">
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Account Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

