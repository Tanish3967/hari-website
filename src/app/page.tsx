import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4 md:px-8 bg-gradient-to-b from-blue-50 to-slate-50 relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
          <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-300 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-300 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              Accepting New Patients
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Expert Medical Care <br />
              <span className="text-blue-600">You Can Trust.</span>
            </h1>
            <p className="text-lg text-slate-600 md:text-xl max-w-[600px] leading-relaxed">
              Dr. Smith is a board-certified physician with over 15 years of experience providing compassionate, comprehensive healthcare for patients of all ages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/book">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 text-md px-8 h-14 rounded-full transition-all hover:scale-105 active:scale-95">
                  Book Appointment Now
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-md px-8 h-14 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 transition-all">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] aspect-square animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full shadow-2xl transform rotate-3 scale-105 transition-transform hover:rotate-6 duration-700"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white shadow-inner bg-slate-200 flex items-center justify-center">
              {/* Fallback image if custom image is not provided yet */}
              <div className="text-slate-400 font-medium text-lg text-center p-8">
                Doctor Image Placeholder <br />
                <span className="text-sm">(Add image to /public directory later)</span>
              </div>
            </div>

            {/* Floating stats card */}
            <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 font-bold text-xl">15+</div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Years of</p>
                <p className="text-sm font-bold text-slate-900">Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors border border-slate-100 group">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Emergency Care</h3>
            <p className="text-slate-600 mb-4">Immediate medical attention for urgent health concerns. Call ahead for fastest service.</p>
            <p className="font-semibold text-blue-600">1-800-123-4567</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors border border-slate-100 group">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Opening Hours</h3>
            <ul className="text-slate-600 space-y-2">
              <li className="flex justify-between"><span>Mon - Fri</span> <span>10:00 AM - 1:00 PM</span></li>
              <li className="flex justify-between"><span></span> <span>5:00 PM - 8:00 PM</span></li>
              <li className="flex justify-between font-medium text-slate-900"><span>Weekend</span> <span>Closed</span></li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors border border-slate-100 group">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Location</h3>
            <p className="text-slate-600 mb-4">123 Health Avenue, Medical District<br />Cityville, ST 12345</p>
            <Link href="/contact" className="text-blue-600 font-medium hover:underline flex items-center">
              View Map <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
