"use client";

import { useRouter } from 'next/navigation';
import { User, Users, Shield } from 'lucide-react';

export default function LoginEntryPage() {
 const router = useRouter();

 const loginOptions = [
   {
     id: 'user',
     title: 'User Login',
     description: 'Access your personal account to book services and manage bookings',
     icon: User,
     path: '/login/user',
     color: 'bg-blue-500'
   },
   {
     id: 'helper',
     title: 'Helper Login',
     description: 'Service providers can access their dashboard and manage jobs',
     icon: Users,
     path: '/login/helper',
     color: 'bg-green-500'
   },
   {
     id: 'admin',
     title: 'Admin Login',
     description: 'Administrative access for system management and oversight',
     icon: Shield,
     path: '/login/admin',
     color: 'bg-purple-500'
   }
 ];

 return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
     <div className="w-full max-w-6xl">
       {/* Header */}
       <div className="text-center mb-12">
         <h1 className="text-3xl font-bold text-gray-900 mb-4">
           Welcome to Our Platform
         </h1>
         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           Choose your login type to access the appropriate dashboard and features
         </p>
       </div>

       {/* Login Options Grid */}
       <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
         {loginOptions.map((option) => {
           const IconComponent = option.icon;
           return (
             <div
               key={option.id}
               className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 cursor-pointer group"
               onClick={() => router.push(option.path)}
             >
               {/* Icon */}
               <div className="flex justify-center mb-6">
                 <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                   <IconComponent className="w-8 h-8 text-white" />
                 </div>
               </div>

               {/* Content */}
               <div className="text-center flex-1">
                 <h3 className="text-xl font-semibold text-gray-900 mb-3">
                   {option.title}
                 </h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   {option.description}
                 </p>
               </div>

               {/* Button */}
               <div className="mt-6">
                 <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                   Login Now
                 </button>
               </div>
             </div>
           );
         })}
       </div>

       {/* Footer */}
       <div className="text-center mt-12">
         <p className="text-gray-500 text-sm">
           Don't have an account?{' '}
           <button
             onClick={() => router.push('/login/user')}
             className="text-purple-600 hover:text-purple-700 font-medium"
           >
             Sign up as a user
           </button>
         </p>
       </div>
     </div>
   </div>
 );
}
